import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SuccessGoal, UserProfileAge } from '@/types/countdown';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  ageProfile: UserProfileAge;
  successGoal: SuccessGoal;
  onSaveAge: (profile: UserProfileAge) => void;
  onSaveSuccess: (goal: SuccessGoal) => void;
  initialTab?: 'age' | 'success';
}

export function EditProfileModal({
  visible,
  onClose,
  ageProfile,
  successGoal,
  onSaveAge,
  onSaveSuccess,
  initialTab = 'age',
}: EditProfileModalProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'age' | 'success'>(initialTab);

  // Age fields
  const [birthDate, setBirthDate] = useState(ageProfile.birthDate);
  const [expectedYears, setExpectedYears] = useState(
    String(ageProfile.expectedLifespanYears)
  );

  // Success fields
  const [successTitle, setSuccessTitle] = useState(successGoal.title);
  const [successTargetDate, setSuccessTargetDate] = useState(() => {
    try {
      return new Date(successGoal.targetDate).toISOString().split('T')[0];
    } catch {
      return '2027-12-31';
    }
  });
  const [visionNote, setVisionNote] = useState(successGoal.visionNote ?? '');

  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
      setBirthDate(ageProfile.birthDate);
      setExpectedYears(String(ageProfile.expectedLifespanYears));
      setSuccessTitle(successGoal.title);
      try {
        setSuccessTargetDate(new Date(successGoal.targetDate).toISOString().split('T')[0]);
      } catch {
        setSuccessTargetDate('2027-12-31');
      }
      setVisionNote(successGoal.visionNote ?? '');
    }
  }, [visible, initialTab, ageProfile, successGoal]);

  const handleSave = () => {
    if (activeTab === 'age') {
      const yearsNum = parseInt(expectedYears, 10) || 80;
      onSaveAge({
        birthDate: birthDate.trim() || '2000-01-01',
        expectedLifespanYears: Math.max(10, Math.min(130, yearsNum)),
      });
    } else {
      let validIso: string;
      try {
        validIso = new Date(`${successTargetDate}T23:59:59`).toISOString();
      } catch {
        validIso = new Date(Date.now() + 365 * 86400000).toISOString();
      }

      onSaveSuccess({
        ...successGoal,
        title: successTitle.trim() || 'My Major Milestone',
        targetDate: validIso,
        visionNote: visionNote.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Customize Countdowns
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}>
              <Ionicons name="close" size={18} color={theme.text} />
            </Pressable>
          </View>

          {/* Segmented Control Tabs */}
          <View
            style={[
              styles.tabSelector,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.borderSubtle,
              },
            ]}>
            <Pressable
              onPress={() => setActiveTab('age')}
              style={[
                styles.tabButton,
                activeTab === 'age' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.cardElevated },
                ],
              ]}>
              <Ionicons
                name="hourglass-outline"
                size={14}
                color={activeTab === 'age' ? theme.text : theme.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'age' ? theme.text : theme.textSecondary,
                    fontWeight: activeTab === 'age' ? '700' : '500',
                  },
                ]}>
                Remaining Age
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('success')}
              style={[
                styles.tabButton,
                activeTab === 'success' && [
                  styles.tabButtonActive,
                  { backgroundColor: theme.cardElevated },
                ],
              ]}>
              <Ionicons
                name="trophy-outline"
                size={14}
                color={activeTab === 'success' ? theme.text : theme.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'success' ? theme.text : theme.textSecondary,
                    fontWeight: activeTab === 'success' ? '700' : '500',
                  },
                ]}>
                Success Target
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}>
            {activeTab === 'age' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    DATE OF BIRTH (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    value={birthDate}
                    onChangeText={setBirthDate}
                    placeholder="2000-01-01"
                    placeholderTextColor={theme.textMuted}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderSubtle,
                        color: theme.text,
                      },
                    ]}
                  />
                  <Text style={[styles.helperText, { color: theme.textMuted }]}>
                    Used to calculate exact lived seconds and remaining age.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    EXPECTED LIFESPAN (YEARS)
                  </Text>
                  <TextInput
                    value={expectedYears}
                    onChangeText={setExpectedYears}
                    keyboardType="number-pad"
                    placeholder="80"
                    placeholderTextColor={theme.textMuted}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderSubtle,
                        color: theme.text,
                      },
                    ]}
                  />
                  <Text style={[styles.helperText, { color: theme.textMuted }]}>
                    Average life expectancy (e.g. 75 to 90 years).
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    SUCCESS MILESTONE TITLE
                  </Text>
                  <TextInput
                    value={successTitle}
                    onChangeText={setSuccessTitle}
                    placeholder="Next Level Breakthrough & Freedom"
                    placeholderTextColor={theme.textMuted}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderSubtle,
                        color: theme.text,
                      },
                    ]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    TARGET SUCCESS DATE (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    value={successTargetDate}
                    onChangeText={setSuccessTargetDate}
                    placeholder="2027-12-31"
                    placeholderTextColor={theme.textMuted}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderSubtle,
                        color: theme.text,
                      },
                    ]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    VISION STATEMENT / DAILY MANIFESTO
                  </Text>
                  <TextInput
                    value={visionNote}
                    onChangeText={setVisionNote}
                    placeholder="Daily discipline, master the craft, relentless focus."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={3}
                    style={[
                      styles.textAreaInput,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderSubtle,
                        color: theme.text,
                      },
                    ]}
                  />
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}>
              <Ionicons name="save-outline" size={16} color={theme.accentInverted} />
              <Text style={[styles.submitButtonText, { color: theme.accentInverted }]}>
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.15)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.sm,
  },
  tabButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
  },
  scrollContent: {
    maxHeight: 400,
  },
  scrollInner: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  helperText: {
    fontSize: 11,
    marginTop: 2,
  },
  textInput: {
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  textAreaInput: {
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
  },
  submitButton: {
    height: 48,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

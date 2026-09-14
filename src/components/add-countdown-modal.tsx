import React, { useState } from 'react';
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
import { CountdownCategory, CountdownItem } from '@/types/countdown';

interface AddCountdownModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: Omit<CountdownItem, 'id' | 'createdAt'>) => void;
}

const CATEGORIES: CountdownCategory[] = [
  'Milestone',
  'Project',
  'Event',
  'Habit',
  'Personal',
];

const PRESET_DAYS = [7, 30, 90, 180, 365];

export function AddCountdownModal({
  visible,
  onClose,
  onAdd,
}: AddCountdownModalProps) {
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CountdownCategory>('Milestone');
  const [note, setNote] = useState('');
  const [daysPreset, setDaysPreset] = useState<number>(30);
  const [customDate, setCustomDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [isCustomDate, setIsCustomDate] = useState(false);

  const handleSelectPreset = (days: number) => {
    setDaysPreset(days);
    setIsCustomDate(false);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setCustomDate(d.toISOString().split('T')[0]);
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    let targetIso: string;
    if (isCustomDate && customDate) {
      targetIso = new Date(`${customDate}T23:59:59`).toISOString();
    } else {
      const d = new Date();
      d.setDate(d.getDate() + daysPreset);
      d.setHours(23, 59, 59, 999);
      targetIso = d.toISOString();
    }

    onAdd({
      title: title.trim(),
      category,
      note: note.trim() || undefined,
      targetDate: targetIso,
      startDate: new Date().toISOString(),
      isPinned: false,
    });

    // Reset fields
    setTitle('');
    setNote('');
    setCategory('Milestone');
    setDaysPreset(30);
    setIsCustomDate(false);
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
            <View style={styles.modalHeaderTitleWrap}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                New Countdown
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Runs 24/7 even when closed
              </Text>
            </View>
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

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                TITLE *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Demo Day, Half Marathon, Book Launch"
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

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                CATEGORY
              </Text>
              <View style={styles.categoryPillsRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryPill,
                        {
                          backgroundColor: isSelected
                            ? theme.accent
                            : theme.backgroundElement,
                          borderColor: isSelected
                            ? theme.accent
                            : theme.borderSubtle,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.categoryPillText,
                          {
                            color: isSelected
                              ? theme.accentInverted
                              : theme.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Target Duration / Date Presets */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                TARGET DATE SHORTCUTS
              </Text>
              <View style={styles.presetsRow}>
                {PRESET_DAYS.map((days) => {
                  const isSelected = !isCustomDate && daysPreset === days;
                  return (
                    <Pressable
                      key={days}
                      onPress={() => handleSelectPreset(days)}
                      style={[
                        styles.presetChip,
                        {
                          backgroundColor: isSelected
                            ? theme.accent
                            : theme.backgroundElement,
                          borderColor: isSelected
                            ? theme.accent
                            : theme.borderSubtle,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.presetChipText,
                          {
                            color: isSelected
                              ? theme.accentInverted
                              : theme.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        +{days}d
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Custom Exact Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                OR EXACT DATE (YYYY-MM-DD)
              </Text>
              <TextInput
                value={customDate}
                onChangeText={(val) => {
                  setCustomDate(val);
                  setIsCustomDate(true);
                }}
                placeholder="2027-12-31"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: isCustomDate
                      ? theme.borderStrong
                      : theme.borderSubtle,
                    color: theme.text,
                  },
                ]}
              />
            </View>

            {/* Note Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                VISION NOTE / PURPOSE (OPTIONAL)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Keep the standard high every single morning..."
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
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.modalFooter}>
            <Pressable
              onPress={handleCreate}
              disabled={!title.trim()}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: title.trim()
                    ? theme.accent
                    : theme.backgroundElement,
                  opacity: pressed ? 0.8 : title.trim() ? 1 : 0.5,
                },
              ]}>
              <Ionicons
                name="timer-outline"
                size={18}
                color={title.trim() ? theme.accentInverted : theme.textMuted}
              />
              <Text
                style={[
                  styles.submitButtonText,
                  {
                    color: title.trim() ? theme.accentInverted : theme.textMuted,
                  },
                ]}>
                Start Countdown
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
    maxWidth: 520,
    maxHeight: '90%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
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
  modalHeaderTitleWrap: {
    gap: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    maxHeight: 460,
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
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  categoryPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  presetChip: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipText: {
    fontSize: 13,
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

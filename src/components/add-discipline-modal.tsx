import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing } from '@/constants/theme';
import { FAMOUS_PERSONALITIES_DATA, PersonalityQuoteQuest } from '@/services/personality-wisdom';

interface AddDisciplineModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (title: string, subtitle: string, icon: keyof typeof Ionicons.glyphMap) => void;
}

const AVAILABLE_ICONS: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { icon: 'flash-outline', label: 'Deep Work' },
  { icon: 'barbell-outline', label: 'Workout' },
  { icon: 'book-outline', label: 'Reading' },
  { icon: 'water-outline', label: 'Hydration' },
  { icon: 'leaf-outline', label: 'Mindfulness' },
  { icon: 'moon-outline', label: 'Sleep' },
  { icon: 'code-slash-outline', label: 'Coding' },
  { icon: 'flame-outline', label: 'Intensity' },
  { icon: 'bicycle-outline', label: 'Cardio' },
  { icon: 'heart-outline', label: 'Health' },
  { icon: 'nutrition-outline', label: 'Diet' },
  { icon: 'sunny-outline', label: 'Morning' },
];

export function AddDisciplineModal({ isVisible, onClose, onAdd }: AddDisciplineModalProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'custom' | 'personality'>('custom');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof Ionicons.glyphMap>('flash-outline');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please give your daily discipline standard a title.');
      return;
    }
    onAdd(title.trim(), subtitle.trim(), selectedIcon);
    resetForm();
    onClose();
  };

  const handleSelectPersonalityQuest = (item: PersonalityQuoteQuest) => {
    onAdd(
      `${item.questTitle} (${item.name.split(' ')[0]})`,
      item.questSubtitle,
      item.questIcon
    );
    resetForm();
    onClose();
    Alert.alert(
      'Quest Adopted!',
      `Added "${item.questTitle}" inspired by ${item.name} to your Daily Discipline.`
    );
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setSelectedIcon('flash-outline');
    setActiveTab('custom');
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.headerLeft}>
            <Ionicons name="add-circle-outline" size={24} color={theme.accent} />
            <Text style={[styles.headerTitle, { color: theme.text }]}>New Daily Discipline</Text>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Ionicons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>

        {/* Tab Switcher: Custom vs Personality Quests */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('custom')}
            style={[
              styles.tabSwitchBtn,
              {
                backgroundColor: activeTab === 'custom' ? theme.accent : theme.backgroundElement,
                borderColor: activeTab === 'custom' ? theme.accent : theme.borderSubtle,
              },
            ]}>
            <Text
              style={[
                styles.tabSwitchBtnText,
                {
                  color: activeTab === 'custom' ? theme.accentInverted : theme.textSecondary,
                  fontWeight: activeTab === 'custom' ? '700' : '500',
                },
              ]}>
              Custom Standard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('personality')}
            style={[
              styles.tabSwitchBtn,
              {
                backgroundColor:
                  activeTab === 'personality' ? theme.accent : theme.backgroundElement,
                borderColor: activeTab === 'personality' ? theme.accent : theme.borderSubtle,
              },
            ]}>
            <Text
              style={[
                styles.tabSwitchBtnText,
                {
                  color:
                    activeTab === 'personality' ? theme.accentInverted : theme.textSecondary,
                  fontWeight: activeTab === 'personality' ? '700' : '500',
                },
              ]}>
              ⚡ Great Minds Quests ({FAMOUS_PERSONALITIES_DATA.length})
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'custom' ? (
            <>
              {/* Title Input */}
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                DISCIPLINE STANDARD
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. 100 Pushups, 45m Cold Coding, No Sugar"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
              />

              {/* Subtitle / Why Input */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: theme.textSecondary, marginTop: Spacing.three },
                ]}>
                AIM / DETAILS (OPTIONAL)
              </Text>
              <TextInput
                value={subtitle}
                onChangeText={setSubtitle}
                placeholder="e.g. Before 9 AM with zero distractions"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
              />

              {/* Icon Selector */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: theme.textSecondary, marginTop: Spacing.four },
                ]}>
                SELECT ICON
              </Text>
              <View style={styles.iconGrid}>
                {AVAILABLE_ICONS.map((item) => {
                  const isSelected = selectedIcon === item.icon;
                  return (
                    <Pressable
                      key={item.icon}
                      onPress={() => setSelectedIcon(item.icon)}
                      style={({ pressed }) => [
                        styles.iconOption,
                        {
                          backgroundColor: isSelected ? theme.accent : theme.backgroundElement,
                          borderColor: isSelected ? theme.accent : theme.borderSubtle,
                          opacity: pressed ? 0.75 : 1,
                        },
                      ]}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={isSelected ? theme.accentInverted : theme.text}
                      />
                      <Text
                        style={[
                          styles.iconLabel,
                          { color: isSelected ? theme.accentInverted : theme.textSecondary },
                        ]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Streak Warning Info */}
              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: theme.badgeBackground,
                    borderColor: theme.border,
                  },
                ]}>
                <Ionicons name="flame" size={20} color="#FF9500" />
                <Text style={[styles.warningText, { color: theme.textSecondary }]}>
                  Non-negotiable rule: Every discipline you add must be checked off daily. If you
                  miss a day, your entire streak resets to 0.
                </Text>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: theme.accent,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={theme.accentInverted}
                />
                <Text style={[styles.submitBtnText, { color: theme.accentInverted }]}>
                  Commit Daily Discipline
                </Text>
              </Pressable>
            </>
          ) : (
            /* Personality Quests Selection List */
            <View style={styles.personalityList}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                CHOOSE A QUEST FROM HISTORY’S GREATEST MINDS
              </Text>
              <Text style={[styles.personalityHelpText, { color: theme.textMuted }]}>
                Tap any quest to instantly commit it as your daily discipline standard.
              </Text>

              {FAMOUS_PERSONALITIES_DATA.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelectPersonalityQuest(item)}
                  style={({ pressed }) => [
                    styles.personalityQuestCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <View style={styles.personalityQuestTop}>
                    <View style={styles.personalityQuestAvatarRow}>
                      <View
                        style={[
                          styles.questIconBox,
                          { backgroundColor: theme.backgroundElement },
                        ]}>
                        <Ionicons name={item.questIcon} size={20} color={theme.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.personalityQuestTitle, { color: theme.text }]}>
                          {item.questTitle}
                        </Text>
                        <Text
                          style={[styles.personalityAuthorText, { color: theme.textSecondary }]}>
                          Inspired by {item.name} • {item.role}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.adoptPill,
                        { backgroundColor: theme.accent },
                      ]}>
                      <Ionicons name="add" size={14} color={theme.accentInverted} />
                      <Text style={[styles.adoptPillText, { color: theme.accentInverted }]}>
                        Adopt
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.personalityQuestSub, { color: theme.textSecondary }]}>
                    {item.questSubtitle}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[styles.personalityMiniQuote, { color: theme.textMuted }]}>
                    &ldquo;{item.quote}&rdquo;
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSwitchBtnText: {
    fontSize: 12,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.one,
    marginLeft: Spacing.one,
  },
  personalityHelpText: {
    fontSize: 12,
    marginLeft: Spacing.one,
    marginBottom: Spacing.three,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  iconOption: {
    width: '30.5%',
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.four,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 52,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.four,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  personalityList: {
    gap: Spacing.three,
  },
  personalityQuestCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.one,
  },
  personalityQuestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personalityQuestAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  questIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalityQuestTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  personalityAuthorText: {
    fontSize: 11,
  },
  adoptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  adoptPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  personalityQuestSub: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  personalityMiniQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
});

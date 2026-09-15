import React, { useState, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCustomAlert } from '@/features/alerts';
import {
  FAMOUS_PERSONALITIES_DATA,
  PersonalityCategory,
  PersonalityQuoteQuest,
} from '@/services/personality-wisdom';
import { disciplineService } from '@/services/discipline-service';

const CATEGORIES: Array<'All' | PersonalityCategory> = [
  'All',
  'Stoic',
  'Innovator',
  'Polymath',
  'Philosopher',
  'Strategist',
];

interface PersonalityWisdomSectionProps {
  onQuestAdopted?: () => void;
}

export function PersonalityWisdomSection({ onQuestAdopted }: PersonalityWisdomSectionProps) {
  const theme = useTheme();
  const { showAlert } = useCustomAlert();

  const [selectedCategory, setSelectedCategory] = useState<'All' | PersonalityCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [adoptedQuestId, setAdoptedQuestId] = useState<string | null>(null);

  // Filtered list
  const filteredList = useMemo(() => {
    return FAMOUS_PERSONALITIES_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.questTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const filteredPersonalities = filteredList;

  // Safe current item
  const currentItem: PersonalityQuoteQuest | undefined =
    filteredList[currentIndex % (filteredList.length || 1)] || FAMOUS_PERSONALITIES_DATA[0];

  const handleNext = () => {
    if (filteredList.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredList.length);
    }
  };

  const handlePrev = () => {
    if (filteredList.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
    }
  };

  const handleShareQuote = async (item: PersonalityQuoteQuest) => {
    try {
      // In native React Native we can copy or log
      console.log(`"${item.quote}" — ${item.name}`);
    } catch {
      // Ignored
    }
  };

  const handleAdoptQuest = async (item: PersonalityQuoteQuest) => {
    try {
      await disciplineService.addTask(
        `${item.questTitle} (${item.name.split(' ')[0]})`,
        item.questSubtitle,
        item.questIcon
      );
      setAdoptedQuestId(item.id);
      showAlert({
        title: 'Quest Adopted!',
        message: `"${item.questTitle}" inspired by ${item.name} has been added to your Daily Discipline standards. Check the Tracker tab to execute it!`,
        type: 'success',
        confirmText: 'Great!',
      });
      if (onQuestAdopted) onQuestAdopted();
      setTimeout(() => setAdoptedQuestId(null), 3000);
    } catch (err) {
      console.warn('Failed to adopt quest:', err);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(350).duration(400)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}>
      {/* Section Header */}
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.badgeBackground },
            ]}>
            <Ionicons name="trophy-outline" size={12} color={theme.badgeText} />
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              GREAT MINDS WISDOM & QUESTS
            </Text>
          </View>
          <Text style={[styles.counterText, { color: theme.textSecondary }]}>
            {filteredList.length} of {FAMOUS_PERSONALITIES_DATA.length} Personalities
          </Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Quotes & Quests of History’s Giants
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Absorb timeless perspectives and adopt their daily life discipline quests.
        </Text>
      </View>

      {/* Search Input */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.borderSubtle,
          },
        ]}>
        <Ionicons name="search-outline" size={16} color={theme.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentIndex(0);
          }}
          placeholder="Search Marcus Aurelius, Tesla, Da Vinci, Seneca..."
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { color: theme.text }]}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={theme.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              style={({ pressed }) => [
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? theme.accent : theme.backgroundElement,
                  borderColor: isSelected ? theme.accent : theme.borderSubtle,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}>
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: isSelected ? theme.accentInverted : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Quote & Quest Card */}
      {currentItem && (
        <View
          style={[
            styles.quoteContainer,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
            },
          ]}>
          {/* Personality identity header */}
          <View style={styles.personalityHeader}>
            <View style={styles.personalityLeft}>
              <View
                style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderStrong,
                  },
                ]}>
                <Ionicons name={currentItem.avatarIcon} size={18} color={theme.accent} />
              </View>
              <View>
                <Text style={[styles.personalityName, { color: theme.text }]}>
                  {currentItem.name}
                </Text>
                <Text style={[styles.personalityRole, { color: theme.textSecondary }]}>
                  {currentItem.role} • {currentItem.era}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.card, borderColor: theme.borderSubtle },
              ]}>
              <Text style={[styles.categoryBadgeText, { color: theme.textSecondary }]}>
                {currentItem.category}
              </Text>
            </View>
          </View>

          {/* Quote Body */}
          <Text style={[styles.quoteText, { color: theme.text }]}>
            &ldquo;{currentItem.quote}&rdquo;
          </Text>

          <Text style={[styles.quoteSource, { color: theme.textMuted }]}>
            — {currentItem.source}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          {/* Actionable Daily Quest Box */}
          <View
            style={[
              styles.questBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}>
            <View style={styles.questHeader}>
              <View style={styles.questTitleRow}>
                <Ionicons name={currentItem.questIcon} size={16} color={theme.accent} />
                <Text style={[styles.questBadgeLabel, { color: theme.accent }]}>
                  DAILY QUEST
                </Text>
              </View>
              <Text style={[styles.questTitle, { color: theme.text }]}>
                {currentItem.questTitle}
              </Text>
              <Text style={[styles.questSubtitle, { color: theme.textSecondary }]}>
                {currentItem.questSubtitle}
              </Text>
            </View>

            <Pressable
              onPress={() => handleAdoptQuest(currentItem)}
              style={({ pressed }) => [
                styles.adoptBtn,
                {
                  backgroundColor: adoptedQuestId === currentItem.id ? '#34C759' : theme.accent,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}>
              <Ionicons
                name={adoptedQuestId === currentItem.id ? 'checkmark' : 'add'}
                size={16}
                color={theme.accentInverted}
              />
              <Text style={[styles.adoptBtnText, { color: theme.accentInverted }]}>
                {adoptedQuestId === currentItem.id
                  ? 'Added to Daily Discipline!'
                  : 'Adopt as Daily Discipline'}
              </Text>
            </Pressable>
          </View>

          {/* Navigation Controls */}
          <View style={styles.controlsRow}>
            <Pressable
              onPress={handlePrev}
              style={({ pressed }) => [
                styles.navBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.borderSubtle,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <Ionicons name="chevron-back" size={16} color={theme.text} />
              <Text style={[styles.navBtnText, { color: theme.text }]}>Previous</Text>
            </Pressable>

            <Text style={[styles.navPageText, { color: theme.textMuted }]}>
              {((currentIndex % (filteredList.length || 1)) + 1)} / {filteredList.length}
            </Text>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.navBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.borderSubtle,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <Text style={[styles.navBtnText, { color: theme.text }]}>Next Mind</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.text} />
            </Pressable>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    gap: Spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 42,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  categoryScroll: {
    gap: Spacing.one,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
  },
  quoteContainer: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personalityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalityName: {
    fontSize: 15,
    fontWeight: '700',
  },
  personalityRole: {
    fontSize: 11,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  quoteSource: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  questBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  questHeader: {
    gap: 2,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  questSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  adoptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  adoptBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navPageText: {
    fontSize: 11,
    fontFamily: Fonts?.mono ?? 'monospace',
  },
});

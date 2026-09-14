import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SuccessGoal, TimeRemaining } from '@/types/countdown';
import { AnimatedDigit } from './animated-digit';

interface SuccessCountdownCardProps {
  successGoal: SuccessGoal;
  remaining: TimeRemaining;
  progressPercent: number;
  onEditPress: () => void;
}

export function SuccessCountdownCard({
  successGoal,
  remaining,
  progressPercent,
  onEditPress,
}: SuccessCountdownCardProps) {
  const theme = useTheme();

  const formattedTargetDate = new Date(successGoal.targetDate).toLocaleDateString(
    undefined,
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(600).springify()}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: theme.badgeBackground,
              },
            ]}>
            <Ionicons name="trophy-outline" size={12} color={theme.badgeText} />
            <Text style={[styles.categoryText, { color: theme.badgeText }]}>
              SUCCESS TARGET
            </Text>
          </View>
          <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={1}>
            {successGoal.title}
          </Text>
        </View>

        <Pressable
          onPress={onEditPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
              opacity: pressed ? 0.7 : 1,
            },
          ]}>
          <Ionicons name="create-outline" size={16} color={theme.text} />
        </Pressable>
      </View>

      {/* Vision Statement if present */}
      {Boolean(successGoal.visionNote) && (
        <Text style={[styles.visionText, { color: theme.textSecondary }]}>
          &ldquo;{successGoal.visionNote}&rdquo;
        </Text>
      )}

      {/* Main Countdown Digits */}
      <View style={styles.digitsContainer}>
        <AnimatedDigit
          value={remaining.days}
          label="Days"
          padZero={false}
          size="lg"
          highlight
        />
        <AnimatedDigit value={remaining.hours} label="Hours" size="lg" />
        <AnimatedDigit value={remaining.minutes} label="Mins" size="lg" />
        <AnimatedDigit value={remaining.seconds} label="Secs" size="lg" showLiveDot />
      </View>

      {/* Progress Bar towards Milestone */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>
            Milestone Progress
          </Text>
          <Text style={[styles.progressStatLabel, { color: theme.text, fontWeight: '700' }]}>
            {progressPercent}% Achieved
          </Text>
        </View>

        <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor: theme.progressFill,
              },
            ]}
          />
        </View>
      </View>

      {/* Target Date Pill */}
      <View
        style={[
          styles.footerBanner,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.borderSubtle,
          },
        ]}>
        <Ionicons name="flag-outline" size={14} color={theme.textSecondary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Target Date: <Text style={{ color: theme.text, fontWeight: '700' }}>{formattedTargetDate}</Text>
          {remaining.isPast ? ' · Passed' : ' · Relentless Execution'}
        </Text>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.one,
    paddingRight: Spacing.two,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  visionText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressSection: {
    gap: Spacing.two,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatLabel: {
    fontSize: 12,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  footerText: {
    fontSize: 12,
    flex: 1,
    fontFamily: Fonts?.sans,
  },
});

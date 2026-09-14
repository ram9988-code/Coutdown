import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedDigit } from '@/components/animated-digit';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CircadianSectionProps {
  nowTick: number;
  circadianPhase: string;
  progressPercent: number;
}

export function CircadianSection({
  nowTick,
  circadianPhase,
  progressPercent,
}: CircadianSectionProps) {
  const theme = useTheme();
  const currentDate = new Date(nowTick);

  const circadianInfo = useMemo(() => {
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();

    let title = 'Deep Cognitive Prime';
    let subtitle = 'Peak analytical flow, high willpower & problem solving';
    let endHour = 13;
    let iconName: keyof typeof Ionicons.glyphMap = 'flash-outline';

    if (hour >= 6 && hour < 9) {
      title = 'Dawn Awakening & Fasted Focus';
      subtitle = 'Natural cortisol surge, hydration & priority mapping';
      endHour = 9;
      iconName = 'sunny-outline';
    } else if (hour >= 9 && hour < 13) {
      title = 'Deep Cognitive Prime';
      subtitle = 'Peak neuroplasticity & uninterrupted execution';
      endHour = 13;
      iconName = 'flame-outline';
    } else if (hour >= 13 && hour < 15) {
      title = 'Metabolic Recharge & Pause';
      subtitle = 'Digestive lull, light tasks, walking or power nap';
      endHour = 15;
      iconName = 'cafe-outline';
    } else if (hour >= 15 && hour < 19) {
      title = 'Second Flow Wave & Execution';
      subtitle = 'Physical training, creative brainstorming & strategy';
      endHour = 19;
      iconName = 'trending-up-outline';
    } else if (hour >= 19 && hour < 22) {
      title = 'Twilight Wind-Down';
      subtitle = 'Digital sunset, reading, dinner & autonomic calm';
      endHour = 22;
      iconName = 'partly-sunny-outline';
    } else {
      title = 'Cellular Restoration & Sleep';
      subtitle = 'Glymphatic brain clearance & physical recovery';
      endHour = hour >= 22 ? 30 : 6;
      iconName = 'moon-outline';
    }

    const currentTotalSec = hour * 3600 + minute * 60 + second;
    const endTotalSec = endHour * 3600;
    const remainingSec = Math.max(0, endTotalSec - currentTotalSec);

    const remHours = Math.floor(remainingSec / 3600);
    const remMins = Math.floor((remainingSec % 3600) / 60);
    const remSecs = remainingSec % 60;

    return {
      title,
      subtitle,
      remHours,
      remMins,
      remSecs,
      iconName,
    };
  }, [nowTick]);

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.badgeBackground },
            ]}>
            <Ionicons name={circadianInfo.iconName} size={12} color={theme.badgeText} />
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              ACTIVE BIOLOGICAL WINDOW
            </Text>
          </View>
          <Text style={[styles.phaseIndicator, { color: theme.textSecondary }]}>
            {circadianPhase}
          </Text>
        </View>

        <Text style={[styles.circadianTitle, { color: theme.text }]}>
          {circadianInfo.title}
        </Text>
        <Text style={[styles.circadianSub, { color: theme.textSecondary }]}>
          {circadianInfo.subtitle}
        </Text>
      </View>

      {/* Countdown Digits to Window End */}
      <View style={styles.circadianTimerBox}>
        <Text style={[styles.circadianTimerLabel, { color: theme.textSecondary }]}>
          TIME REMAINING IN THIS WINDOW
        </Text>
        <View style={styles.digitsRow}>
          <AnimatedDigit
            value={circadianInfo.remHours}
            label="Hours"
            size="lg"
            highlight
          />
          <AnimatedDigit
            value={circadianInfo.remMins}
            label="Mins"
            size="lg"
          />
          <AnimatedDigit
            value={circadianInfo.remSecs}
            label="Secs"
            size="lg"
            showLiveDot
          />
        </View>
      </View>

      {/* Day Horizon Progression */}
      <View style={styles.progressWrap}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
            Day Cadence Elapsed
          </Text>
          <Text style={[styles.progressLabel, { color: theme.text, fontWeight: '700' }]}>
            {progressPercent}%
          </Text>
        </View>
        <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: theme.progressFill,
              },
            ]}
          />
        </View>
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
  phaseIndicator: {
    fontSize: 11,
    fontWeight: '600',
  },
  circadianTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  circadianSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  circadianTimerBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.two,
  },
  circadianTimerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  progressWrap: {
    gap: Spacing.one,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

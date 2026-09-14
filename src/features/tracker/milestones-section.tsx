import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedDigit } from '@/components/animated-digit';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface MilestonesSectionProps {
  birthDate: string;
  nowTick: number;
}

export function MilestonesSection({ birthDate, nowTick }: MilestonesSectionProps) {
  const theme = useTheme();

  const birthdayInfo = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date(nowTick);

    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(), 0, 0, 0);
    if (nextBday.getTime() <= now.getTime()) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate(), 0, 0, 0);
    }

    const diffMs = nextBday.getTime() - now.getTime();
    const totalSec = Math.max(0, Math.floor(diffMs / 1000));
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const totalDaysOnEarth = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const turningAge =
      now.getFullYear() -
      birth.getFullYear() +
      (nextBday.getFullYear() > now.getFullYear() ? 1 : 0);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalDaysOnEarth,
      turningAge,
    };
  }, [birthDate, nowTick]);

  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(400)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.badgeBackground },
          ]}>
          <Ionicons name="gift-outline" size={12} color={theme.badgeText} />
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>
            LIFE ODYSSEY MILESTONES
          </Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Days on Earth & Next Milestone
        </Text>
      </View>

      {/* Days on Earth Stat Box */}
      <View
        style={[
          styles.odysseyBox,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.borderSubtle,
          },
        ]}>
        <Text style={[styles.odysseyNumber, { color: theme.text }]}>
          Day {birthdayInfo.totalDaysOnEarth.toLocaleString()}
        </Text>
        <Text style={[styles.odysseyDesc, { color: theme.textSecondary }]}>
          Total consecutive sunrises witnessed on planet Earth.
        </Text>
      </View>

      {/* Next Birthday Live Countdown */}
      <View style={styles.bdaySection}>
        <View style={styles.bdayHeader}>
          <Text style={[styles.bdayTitle, { color: theme.text }]}>
            Countdown to Age {birthdayInfo.turningAge}
          </Text>
          <Text style={[styles.bdayDate, { color: theme.textSecondary }]}>
            Born {birthDate}
          </Text>
        </View>

        <View style={styles.digitsRow}>
          <AnimatedDigit
            value={birthdayInfo.days}
            label="Days"
            padZero={false}
            size="md"
            highlight
          />
          <AnimatedDigit value={birthdayInfo.hours} label="Hours" size="md" />
          <AnimatedDigit value={birthdayInfo.minutes} label="Mins" size="md" />
          <AnimatedDigit value={birthdayInfo.seconds} label="Secs" size="md" showLiveDot />
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.one,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  odysseyBox: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  odysseyNumber: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  odysseyDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  bdaySection: {
    gap: Spacing.two,
  },
  bdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bdayTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bdayDate: {
    fontSize: 11,
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});

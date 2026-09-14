import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedDigit } from '@/components/animated-digit';
import { ThemedView } from '@/components/themed-view';
import {
  BorderRadius,
  BottomTabInset,
  Fonts,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';
import { useCountdowns } from '@/hooks/use-countdowns';
import { useTheme } from '@/hooks/use-theme';
import { PERSPECTIVE_REFLECTIONS } from '@/services/cadence';
import { tickAudio } from '@/services/tick-audio';
import { PersonalityWisdomSection } from '@/features/perspective';

type HorizonTab = 'today' | 'hour' | 'minute' | 'year';
type MatrixMode = 'year52' | 'day24' | 'life';

export default function LifePerspectiveScreen() {
  const theme = useTheme();
  const { ageProfile, ageRemaining, successGoal, cadence, existential, nowTick } = useCountdowns();

  // Active Horizon selection
  const [activeHorizon, setActiveHorizon] = useState<HorizonTab>('today');

  // Active Matrix visualization mode
  const [activeMatrix, setActiveMatrix] = useState<MatrixMode>('year52');

  // Audio tick toggle state
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => tickAudio.getEnabled());

  // Stoic quote index
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const handleToggleAudio = () => {
    const newState = tickAudio.toggle();
    setAudioEnabled(newState);
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % PERSPECTIVE_REFLECTIONS.length);
  };

  const currentQuote = PERSPECTIVE_REFLECTIONS[quoteIndex];

  // Current date info
  const currentDate = new Date(nowTick);
  const formattedTodayDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Current week number in the year (approx 1-52)
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor(
    (currentDate.getTime() - startOfYear.getTime()) / 86400000
  );
  const currentWeekOfYear = Math.min(52, Math.max(1, Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)));

  return (
    <ThemedView style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top App Bar */}
        <View style={styles.topAppBar}>
          <View>
            <Text
              style={[
                styles.screenTitle,
                {
                  color: theme.text,
                  fontFamily: Fonts?.mono ?? 'monospace',
                },
              ]}>
              PERSPECTIVE
            </Text>
            <View style={styles.appBarSubtitleRow}>
              <View style={[styles.liveDot, { backgroundColor: theme.text }]} />
              <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
                Live Cadence & Memento Mori
              </Text>
            </View>
          </View>

          {/* Sound Toggle */}
          <Pressable
            onPress={handleToggleAudio}
            hitSlop={8}
            style={({ pressed }) => [
              styles.audioToggleBtn,
              {
                backgroundColor: audioEnabled ? theme.accent : theme.backgroundElement,
                borderColor: audioEnabled ? theme.accent : theme.borderSubtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons
              name={audioEnabled ? 'volume-high' : 'volume-mute-outline'}
              size={16}
              color={audioEnabled ? theme.accentInverted : theme.textSecondary}
            />
            <Text
              style={[
                styles.audioToggleText,
                {
                  color: audioEnabled ? theme.accentInverted : theme.textSecondary,
                  fontFamily: Fonts?.mono ?? 'monospace',
                },
              ]}>
              {audioEnabled ? 'TICK ON' : 'TICK OFF'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}>

          {/* SECTION 1: THE RHYTHM OF NOW (LIVE CADENCE) */}
          <Animated.View
            entering={FadeInUp.duration(400)}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}>
            {/* Header & Tabs */}
            <View style={styles.cadenceHeader}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.badgeBackground },
                  ]}>
                  <View style={[styles.pulseDot, { backgroundColor: theme.text }]} />
                  <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                    LIVE CADENCE HORIZONS
                  </Text>
                </View>
                <Text style={[styles.dateSubtext, { color: theme.textSecondary }]}>
                  {formattedTodayDate}
                </Text>
              </View>

              {/* Horizon Selector Chips */}
              <View style={styles.horizonTabs}>
                {(['today', 'hour', 'minute', 'year'] as HorizonTab[]).map((tab) => {
                  const isSelected = activeHorizon === tab;
                  const labels: Record<HorizonTab, string> = {
                    today: 'Today (24h)',
                    hour: 'This Hour',
                    minute: 'This Minute',
                    year: 'Year 2026',
                  };
                  return (
                    <Pressable
                      key={tab}
                      onPress={() => setActiveHorizon(tab)}
                      style={[
                        styles.horizonChip,
                        {
                          backgroundColor: isSelected
                            ? theme.accent
                            : theme.backgroundElement,
                          borderColor: isSelected ? theme.accent : theme.borderSubtle,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.horizonChipText,
                          {
                            color: isSelected ? theme.accentInverted : theme.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        {labels[tab]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Content for Selected Horizon */}
            {activeHorizon === 'today' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.horizonContent}>
                <View style={styles.horizonSummaryRow}>
                  <Text style={[styles.horizonTitle, { color: theme.text }]}>
                    Remaining in Today
                  </Text>
                  <View
                    style={[
                      styles.phasePill,
                      { backgroundColor: theme.backgroundElement },
                    ]}>
                    <Ionicons
                      name={
                        cadence.dayCadence.circadianPhase === 'Night'
                          ? 'moon-outline'
                          : cadence.dayCadence.circadianPhase === 'Evening'
                          ? 'cloudy-night-outline'
                          : 'sunny-outline'
                      }
                      size={12}
                      color={theme.text}
                    />
                    <Text style={[styles.phaseText, { color: theme.text }]}>
                      {cadence.dayCadence.circadianPhase} Phase
                    </Text>
                  </View>
                </View>

                {/* Hours, Mins, Secs Digits */}
                <View style={styles.digitsRow}>
                  <AnimatedDigit
                    value={cadence.dayCadence.hoursLeft}
                    label="Hours Left"
                    size="lg"
                    highlight
                  />
                  <AnimatedDigit
                    value={cadence.dayCadence.minutesLeft}
                    label="Mins Left"
                    size="lg"
                  />
                  <AnimatedDigit
                    value={cadence.dayCadence.secondsLeft}
                    label="Secs Left"
                    size="lg"
                    showLiveDot
                  />
                </View>

                {/* Circadian Day Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>
                      Circadian Progression
                    </Text>
                    <Text style={[styles.progressStatLabel, { color: theme.text, fontWeight: '700' }]}>
                      {cadence.dayCadence.progressPercent}% Elapsed
                    </Text>
                  </View>
                  <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${cadence.dayCadence.progressPercent}%`,
                          backgroundColor: theme.progressFill,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.circadianMarkers}>
                    <Text style={[styles.markerText, { color: theme.textMuted }]}>00:00 (Dawn)</Text>
                    <Text style={[styles.markerText, { color: theme.textMuted }]}>12:00 (Noon)</Text>
                    <Text style={[styles.markerText, { color: theme.textMuted }]}>23:59 (Midnight)</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {activeHorizon === 'hour' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.horizonContent}>
                <View style={styles.horizonSummaryRow}>
                  <Text style={[styles.horizonTitle, { color: theme.text }]}>
                    Current Hour Cadence
                  </Text>
                  <Text style={[styles.horizonSub, { color: theme.textSecondary }]}>
                    Minute {cadence.hourCadence.currentMinute} of 60
                  </Text>
                </View>

                {/* Mins and Secs Digits */}
                <View style={styles.digitsRowWide}>
                  <AnimatedDigit
                    value={cadence.hourCadence.minutesLeft}
                    label="Minutes Left In Hour"
                    size="xl"
                    highlight
                  />
                  <AnimatedDigit
                    value={cadence.hourCadence.secondsLeft}
                    label="Seconds Left"
                    size="xl"
                    showLiveDot
                  />
                </View>

                {/* Hour Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>
                      Hour Completion
                    </Text>
                    <Text style={[styles.progressStatLabel, { color: theme.text, fontWeight: '700' }]}>
                      {cadence.hourCadence.progressPercent}%
                    </Text>
                  </View>
                  <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${cadence.hourCadence.progressPercent}%`,
                          backgroundColor: theme.progressFill,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.cadenceTip, { color: theme.textSecondary }]}>
                  &ldquo;A focused hour compounds into a transcendent year.&rdquo;
                </Text>
              </Animated.View>
            )}

            {activeHorizon === 'minute' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.horizonContent}>
                <View style={styles.horizonSummaryRow}>
                  <Text style={[styles.horizonTitle, { color: theme.text }]}>
                    This Minute Pulse
                  </Text>
                  <View style={styles.liveTickBadge}>
                    <View style={[styles.livePulseDot, { backgroundColor: theme.text }]} />
                    <Text style={[styles.liveTickLabel, { color: theme.text }]}>
                      1-SECOND RESOLUTION
                    </Text>
                  </View>
                </View>

                {/* Central Second Counter */}
                <View style={styles.minuteCountdownWrap}>
                  <View
                    style={[
                      styles.bigSecondBox,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.borderStrong,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.bigSecondNum,
                        {
                          color: theme.text,
                          fontFamily: Fonts?.mono ?? 'monospace',
                        },
                      ]}>
                      {String(cadence.secondCadence.secondsLeft).padStart(2, '0')}
                    </Text>
                    <Text style={[styles.bigSecondUnit, { color: theme.textSecondary }]}>
                      SECONDS REMAINING
                    </Text>
                  </View>
                </View>

                {/* 60-Second Segmented Live Bar */}
                <View style={styles.segmentedSecondsWrap}>
                  <View style={styles.secondTrack}>
                    <View
                      style={[
                        styles.secondFill,
                        {
                          width: `${cadence.secondCadence.progressPercent}%`,
                          backgroundColor: theme.progressFill,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.secondStatsRow}>
                    <Text style={[styles.secondSubText, { color: theme.textMuted }]}>
                      Current: :{String(cadence.secondCadence.currentSecond).padStart(2, '0')}s
                    </Text>
                    <Text style={[styles.secondSubText, { color: theme.textMuted }]}>
                      End: :59s
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cadenceTip, { color: theme.textSecondary }]}>
                  The present moment is the only slice of time you truly control.
                </Text>
              </Animated.View>
            )}

            {activeHorizon === 'year' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.horizonContent}>
                <View style={styles.horizonSummaryRow}>
                  <Text style={[styles.horizonTitle, { color: theme.text }]}>
                    {cadence.yearCadence.currentYear} Remaining Time
                  </Text>
                  <Text style={[styles.horizonSub, { color: theme.textSecondary }]}>
                    Week {currentWeekOfYear} of 52
                  </Text>
                </View>

                <View style={styles.digitsRow}>
                  <AnimatedDigit
                    value={cadence.yearCadence.daysLeft}
                    label="Days"
                    padZero={false}
                    size="md"
                    highlight
                  />
                  <AnimatedDigit value={cadence.yearCadence.hoursLeft} label="Hours" size="md" />
                  <AnimatedDigit value={cadence.yearCadence.minutesLeft} label="Mins" size="md" />
                  <AnimatedDigit value={cadence.yearCadence.secondsLeft} label="Secs" size="md" showLiveDot />
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>
                      Year Completed
                    </Text>
                    <Text style={[styles.progressStatLabel, { color: theme.text, fontWeight: '700' }]}>
                      {cadence.yearCadence.progressPercent.toFixed(3)}%
                    </Text>
                  </View>
                  <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${cadence.yearCadence.progressPercent}%`,
                          backgroundColor: theme.progressFill,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* SECTION 2: EXISTENTIAL HORIZONS (PROFOUND PERSPECTIVES) */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.badgeBackground },
                ]}>
                <Ionicons name="telescope-outline" size={12} color={theme.badgeText} />
                <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                  DEEP EXISTENTIAL PERSPECTIVE
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              The Architecture of Your Remaining Time
            </Text>

            {/* Waking Conscious Time vs Sleep Card */}
            <View
              style={[
                styles.existentialBox,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}>
              <View style={styles.existentialHeader}>
                <Ionicons name="sunny-outline" size={16} color={theme.text} />
                <Text style={[styles.existentialTitle, { color: theme.text }]}>
                  Conscious Waking Years
                </Text>
              </View>
              <Text style={[styles.existentialStat, { color: theme.text }]}>
                ~{existential.wakingYearsRemaining} Active Years{' '}
                <Text style={[styles.existentialStatSub, { color: theme.textSecondary }]}>
                  ({existential.wakingDaysRemaining.toLocaleString()} days)
                </Text>
              </Text>
              <Text style={[styles.existentialDesc, { color: theme.textSecondary }]}>
                Humans spend ~1/3 of life sleeping ({existential.sleepDaysRemaining.toLocaleString()} days).
                Your actual, waking, conscious existence is roughly two-thirds of your projected lifespan.
              </Text>
            </View>

            {/* Grid of Two Key Finite Horizons: Weekends & Summers */}
            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.gridBox,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.borderSubtle,
                  },
                ]}>
                <Ionicons name="cafe-outline" size={16} color={theme.text} />
                <Text style={[styles.gridBoxNumber, { color: theme.text }]}>
                  {existential.remainingWeekends.toLocaleString()}
                </Text>
                <Text style={[styles.gridBoxLabel, { color: theme.textSecondary }]}>
                  WEEKENDS LEFT
                </Text>
                <Text style={[styles.gridBoxSub, { color: theme.textMuted }]}>
                  Saturdays & Sundays to spend with people who matter.
                </Text>
              </View>

              <View
                style={[
                  styles.gridBox,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.borderSubtle,
                  },
                ]}>
                <Ionicons name="flame-outline" size={16} color={theme.text} />
                <Text style={[styles.gridBoxNumber, { color: theme.text }]}>
                  {existential.remainingSummers}
                </Text>
                <Text style={[styles.gridBoxLabel, { color: theme.textSecondary }]}>
                  SUMMERS LEFT
                </Text>
                <Text style={[styles.gridBoxSub, { color: theme.textMuted }]}>
                  Warm seasons and long twilight evenings are strictly finite.
                </Text>
              </View>
            </View>

            {/* Live Vitality Pulse Ticker (Heartbeats & Breaths) */}
            <View
              style={[
                styles.vitalityCard,
                {
                  backgroundColor: theme.cardElevated,
                  borderColor: theme.borderStrong,
                },
              ]}>
              <View style={styles.vitalityHeader}>
                <View style={styles.vitalityTitleRow}>
                  <View style={[styles.pulseDot, { backgroundColor: theme.text }]} />
                  <Text style={[styles.vitalityHeading, { color: theme.text }]}>
                    LIVE VITALITY TICKER
                  </Text>
                </View>
                <Text style={[styles.vitalityLiveBadge, { color: theme.textSecondary }]}>
                  TICKS EVERY SECOND
                </Text>
              </View>

              <View style={styles.vitalityMetricsRow}>
                <View style={styles.vitalityItem}>
                  <Text
                    style={[
                      styles.vitalityValue,
                      {
                        color: theme.text,
                        fontFamily: Fonts?.mono ?? 'monospace',
                      },
                    ]}>
                    ~{existential.estimatedHeartbeatsRemaining.toLocaleString()}
                  </Text>
                  <Text style={[styles.vitalityLabel, { color: theme.textSecondary }]}>
                    ESTIMATED HEARTBEATS LEFT
                  </Text>
                </View>

                <View style={[styles.vitalityDivider, { backgroundColor: theme.borderSubtle }]} />

                <View style={styles.vitalityItem}>
                  <Text
                    style={[
                      styles.vitalityValue,
                      {
                        color: theme.text,
                        fontFamily: Fonts?.mono ?? 'monospace',
                      },
                    ]}>
                    ~{existential.estimatedBreathsRemaining.toLocaleString()}
                  </Text>
                  <Text style={[styles.vitalityLabel, { color: theme.textSecondary }]}>
                    ESTIMATED BREATHS LEFT
                  </Text>
                </View>
              </View>

              <Text style={[styles.vitalityFooter, { color: theme.textMuted }]}>
                Calculated dynamically from your life expectancy ({ageProfile.expectedLifespanYears} years, projected ~{existential.estimatedEndYear}).
              </Text>
            </View>
          </Animated.View>

          {/* SECTION 3: INTERACTIVE MEMENTO MORI MATRIX */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(400)}
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
                <Ionicons name="grid-outline" size={12} color={theme.badgeText} />
                <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                  MEMENTO MORI VISUALIZER
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Visual Time Matrix
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Select a visual lens to perceive the passage of existence
              </Text>
            </View>

            {/* Matrix View Selector */}
            <View style={styles.matrixSelectorRow}>
              {(
                [
                  { id: 'year52', label: '52 Weeks of 2026' },
                  { id: 'day24', label: '24 Hours of Today' },
                  { id: 'life', label: 'Life in Decades' },
                ] as const
              ).map((mode) => {
                const isSelected = activeMatrix === mode.id;
                return (
                  <Pressable
                    key={mode.id}
                    onPress={() => setActiveMatrix(mode.id)}
                    style={[
                      styles.matrixTabBtn,
                      {
                        backgroundColor: isSelected
                          ? theme.accent
                          : theme.backgroundElement,
                        borderColor: isSelected ? theme.accent : theme.borderSubtle,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.matrixTabBtnText,
                        {
                          color: isSelected ? theme.accentInverted : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {mode.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Render Selected Matrix */}
            {activeMatrix === 'year52' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.matrixViewBox}>
                <View style={styles.matrixStatusRow}>
                  <Text style={[styles.matrixStatusText, { color: theme.text }]}>
                    Week <Text style={{ fontWeight: '800' }}>{currentWeekOfYear}</Text> of 52
                  </Text>
                  <Text style={[styles.matrixStatusText, { color: theme.textSecondary }]}>
                    {52 - currentWeekOfYear} weeks remaining in 2026
                  </Text>
                </View>

                {/* 52 Week Grid */}
                <View style={styles.fiftyTwoGrid}>
                  {Array.from({ length: 52 }).map((_, idx) => {
                    const weekNum = idx + 1;
                    const isPast = weekNum < currentWeekOfYear;
                    const isCurrent = weekNum === currentWeekOfYear;

                    return (
                      <View
                        key={idx}
                        style={[
                          styles.weekDot,
                          isPast && {
                            backgroundColor: theme.textSecondary,
                            borderColor: theme.textSecondary,
                          },
                          isCurrent && {
                            backgroundColor: theme.text,
                            borderColor: theme.accent,
                            borderWidth: 2,
                            transform: [{ scale: 1.2 }],
                          },
                          !isPast &&
                            !isCurrent && {
                              backgroundColor: 'transparent',
                              borderColor: theme.borderStrong,
                            },
                        ]}
                      />
                    );
                  })}
                </View>

                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: theme.textSecondary }]} />
                    <Text style={[styles.legendText, { color: theme.textSecondary }]}>Lived</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendSquare,
                        {
                          backgroundColor: theme.text,
                          borderColor: theme.accent,
                          borderWidth: 1.5,
                        },
                      ]}
                    />
                    <Text style={[styles.legendText, { color: theme.text, fontWeight: '700' }]}>
                      Current Week (Live)
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendSquare,
                        { backgroundColor: 'transparent', borderColor: theme.borderStrong, borderWidth: 1 },
                      ]}
                    />
                    <Text style={[styles.legendText, { color: theme.textMuted }]}>Remaining</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {activeMatrix === 'day24' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.matrixViewBox}>
                <View style={styles.matrixStatusRow}>
                  <Text style={[styles.matrixStatusText, { color: theme.text }]}>
                    Hour <Text style={{ fontWeight: '800' }}>{cadence.dayCadence.currentHour}:00</Text>
                  </Text>
                  <Text style={[styles.matrixStatusText, { color: theme.textSecondary }]}>
                    {cadence.dayCadence.hoursLeft} hours left today
                  </Text>
                </View>

                {/* 24 Hours Blocks */}
                <View style={styles.twentyFourGrid}>
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const isPast = hour < cadence.dayCadence.currentHour;
                    const isCurrent = hour === cadence.dayCadence.currentHour;

                    return (
                      <View
                        key={hour}
                        style={[
                          styles.hourBlock,
                          {
                            borderColor: isCurrent
                              ? theme.accent
                              : isPast
                              ? theme.borderSubtle
                              : theme.borderStrong,
                            backgroundColor: isCurrent
                              ? theme.text
                              : isPast
                              ? theme.backgroundElement
                              : 'transparent',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.hourBlockNum,
                            {
                              color: isCurrent
                                ? theme.accentInverted
                                : isPast
                                ? theme.textSecondary
                                : theme.textMuted,
                              fontFamily: Fonts?.mono ?? 'monospace',
                            },
                          ]}>
                          {hour}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={[styles.matrixFootnote, { color: theme.textMuted }]}>
                  Each block is a precious 60-minute window of your life.
                </Text>
              </Animated.View>
            )}

            {activeMatrix === 'life' && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.matrixViewBox}>
                <View style={styles.matrixStatusRow}>
                  <Text style={[styles.matrixStatusText, { color: theme.text }]}>
                    {ageRemaining.yearsLived} Years Lived ({ageRemaining.percentageLived}%)
                  </Text>
                  <Text style={[styles.matrixStatusText, { color: theme.textSecondary }]}>
                    {ageProfile.expectedLifespanYears - Math.floor(ageRemaining.yearsLived)} Years Remaining
                  </Text>
                </View>

                {/* Life Stages Milestones */}
                <View style={styles.lifeStagesList}>
                  {[
                    { label: 'Foundation & Youth', range: 'Age 0 — 20', max: 20 },
                    { label: 'Prime Ascent & Building', range: 'Age 20 — 40', max: 40 },
                    { label: 'Mastery & Influence', range: 'Age 40 — 60', max: 60 },
                    { label: 'Wisdom & Legacy', range: `Age 60 — ${ageProfile.expectedLifespanYears}`, max: ageProfile.expectedLifespanYears },
                  ].map((stage, idx) => {
                    const prevMax = idx === 0 ? 0 : [20, 40, 60][idx - 1];
                    const stageDuration = stage.max - prevMax;
                    const livedInStage = Math.max(0, Math.min(stageDuration, ageRemaining.yearsLived - prevMax));
                    const stagePercent = Math.min(100, Math.round((livedInStage / stageDuration) * 100));

                    return (
                      <View key={stage.label} style={styles.stageItem}>
                        <View style={styles.stageTitleRow}>
                          <Text style={[styles.stageLabel, { color: theme.text }]}>
                            {stage.label}
                          </Text>
                          <Text style={[styles.stageRange, { color: theme.textSecondary }]}>
                            {stage.range} · {stagePercent}%
                          </Text>
                        </View>
                        <View style={[styles.stageBarTrack, { backgroundColor: theme.progressTrack }]}>
                          <View
                            style={[
                              styles.stageBarFill,
                              {
                                width: `${stagePercent}%`,
                                backgroundColor: theme.progressFill,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* SECTION 4: STOIC PERSPECTIVE REFLECTION */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(400)}
            style={[
              styles.quoteCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.borderSubtle,
              },
            ]}>
            <View style={styles.quoteHeaderRow}>
              <View style={styles.quoteBadge}>
                <Ionicons name="sparkles-outline" size={12} color={theme.text} />
                <Text style={[styles.quoteBadgeText, { color: theme.text }]}>
                  STOIC PERSPECTIVE REFLECTION
                </Text>
              </View>

              <Pressable
                onPress={handleNextQuote}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.refreshQuoteBtn,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderSubtle,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}>
                <Ionicons name="shuffle-outline" size={14} color={theme.text} />
                <Text style={[styles.refreshQuoteText, { color: theme.text }]}>Shift</Text>
              </Pressable>
            </View>

            <Text style={[styles.quoteBody, { color: theme.text }]}>
              &ldquo;{currentQuote.quote}&rdquo;
            </Text>

            <View style={styles.quoteAuthorRow}>
              <Text style={[styles.quoteAuthor, { color: theme.text }]}>
                — {currentQuote.author}
              </Text>
              <Text style={[styles.quoteContext, { color: theme.textSecondary }]}>
                {currentQuote.context}
              </Text>
            </View>
          </Animated.View>

          {/* SECTION 5: GREAT MINDS QUOTES & QUESTS ARCHIVE */}
          <PersonalityWisdomSection />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.12)',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  appBarSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  screenSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  audioToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    height: 32,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  audioToggleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.five,
  },
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
  cadenceHeader: {
    gap: Spacing.three,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dateSubtext: {
    fontSize: 11,
    fontWeight: '500',
  },
  horizonTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  horizonChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  horizonChipText: {
    fontSize: 11,
  },
  horizonContent: {
    gap: Spacing.four,
  },
  horizonSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizonTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  horizonSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  phaseText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  digitsRowWide: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  minuteCountdownWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  bigSecondBox: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
    minWidth: 160,
  },
  bigSecondNum: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  bigSecondUnit: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  segmentedSecondsWrap: {
    gap: Spacing.one,
  },
  secondTrack: {
    height: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  secondFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  secondStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondSubText: {
    fontSize: 10,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  liveTickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveTickLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cadenceTip: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
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
  circadianMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerText: {
    fontSize: 9,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  existentialBox: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  existentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  existentialTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  existentialStat: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  existentialStatSub: {
    fontSize: 14,
    fontWeight: '500',
  },
  existentialDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  gridBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.half,
  },
  gridBoxNumber: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gridBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  gridBoxSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  vitalityCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  vitalityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vitalityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  vitalityHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  vitalityLiveBadge: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  vitalityMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  vitalityItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  vitalityValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  vitalityLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  vitalityDivider: {
    width: 1,
    height: 36,
  },
  vitalityFooter: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cardHeader: {
    gap: Spacing.one,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  matrixSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  matrixTabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixTabBtnText: {
    fontSize: 11,
  },
  matrixViewBox: {
    gap: Spacing.three,
  },
  matrixStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixStatusText: {
    fontSize: 12,
  },
  fiftyTwoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: Spacing.one,
  },
  weekDot: {
    width: 9,
    height: 9,
    borderRadius: 2,
    borderWidth: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
  },
  twentyFourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: Spacing.one,
  },
  hourBlock: {
    width: 32,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourBlockNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  matrixFootnote: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lifeStagesList: {
    gap: Spacing.three,
  },
  stageItem: {
    gap: 4,
  },
  stageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  stageRange: {
    fontSize: 11,
  },
  stageBarTrack: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  stageBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  quoteCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.three,
  },
  quoteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  quoteBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  refreshQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  refreshQuoteText: {
    fontSize: 10,
    fontWeight: '700',
  },
  quoteBody: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  quoteAuthorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.12)',
    paddingTop: Spacing.two,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '700',
  },
  quoteContext: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCustomAlert } from '@/features/alerts';

export const FOCUS_PRESETS = [
  { label: '25m Sprint', seconds: 25 * 60 },
  { label: '50m Deep Flow', seconds: 50 * 60 },
  { label: '90m Ultradian', seconds: 90 * 60 },
];

export function FocusTimerSection() {
  const theme = useTheme();
  const { showAlert } = useCustomAlert();

  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [focusRemainingSeconds, setFocusRemainingSeconds] = useState<number>(
    FOCUS_PRESETS[0].seconds
  );
  const [isFocusActive, setIsFocusActive] = useState<boolean>(false);
  const [completedSessionsToday, setCompletedSessionsToday] = useState<number>(1);
  const [totalFocusedMinutesToday, setTotalFocusedMinutesToday] = useState<number>(45);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isFocusActive) {
      timer = setInterval(() => {
        setFocusRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsFocusActive(false);
            const durationMins = Math.round(FOCUS_PRESETS[selectedPreset].seconds / 60);
            setCompletedSessionsToday((c) => c + 1);
            setTotalFocusedMinutesToday((m) => m + durationMins);
            showAlert({
              title: 'Session Complete!',
              message: `Great job! You executed a ${durationMins}-minute relentless focus block. Keep up the high discipline.`,
              type: 'success',
              confirmText: 'Continue',
            });
            return FOCUS_PRESETS[selectedPreset].seconds;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFocusActive, selectedPreset, showAlert]);

  const handleSelectPreset = (index: number) => {
    if (isFocusActive) return;
    setSelectedPreset(index);
    setFocusRemainingSeconds(FOCUS_PRESETS[index].seconds);
  };

  const handleToggleFocusTimer = () => {
    setIsFocusActive(!isFocusActive);
  };

  const handleResetFocusTimer = () => {
    setIsFocusActive(false);
    setFocusRemainingSeconds(FOCUS_PRESETS[selectedPreset].seconds);
  };

  const focusMins = Math.floor(focusRemainingSeconds / 60);
  const focusSecs = focusRemainingSeconds % 60;
  const focusProgressPercent =
    ((FOCUS_PRESETS[selectedPreset].seconds - focusRemainingSeconds) /
      FOCUS_PRESETS[selectedPreset].seconds) *
    100;

  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(400)}
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
            <Ionicons name="timer-outline" size={12} color={theme.badgeText} />
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              FOCUS ENGINE
            </Text>
          </View>
          <Text style={[styles.phaseIndicator, { color: theme.textSecondary }]}>
            {completedSessionsToday} Sessions ({totalFocusedMinutesToday}m) Logged
          </Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Deep Work Focus Block
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Immerse in single-task execution with high-cadence momentum.
        </Text>
      </View>

      {/* Preset Selector */}
      <View style={styles.presetsRow}>
        {FOCUS_PRESETS.map((preset, idx) => {
          const isSelected = selectedPreset === idx;
          return (
            <Pressable
              key={preset.label}
              onPress={() => handleSelectPreset(idx)}
              style={({ pressed }) => [
                styles.presetBtn,
                {
                  backgroundColor: isSelected
                    ? theme.accent
                    : theme.backgroundElement,
                  borderColor: isSelected ? theme.accent : theme.borderSubtle,
                  opacity: pressed && !isFocusActive ? 0.75 : 1,
                },
              ]}>
              <Text
                style={[
                  styles.presetBtnText,
                  {
                    color: isSelected ? theme.accentInverted : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Focus Timer Display */}
      <View
        style={[
          styles.focusTimerContainer,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: isFocusActive ? theme.accent : theme.borderSubtle,
          },
        ]}>
        <Text
          style={[
            styles.focusDigits,
            {
              color: isFocusActive ? theme.text : theme.textSecondary,
            },
          ]}>
          {String(focusMins).padStart(2, '0')}:{String(focusSecs).padStart(2, '0')}
        </Text>
        <Text style={[styles.focusStatusText, { color: theme.textSecondary }]}>
          {isFocusActive ? 'FOCUS SESSION IN FLIGHT' : 'READY TO ENGAGE'}
        </Text>

        <View style={styles.focusProgressLine}>
          <View
            style={[
              styles.focusProgressFill,
              {
                width: `${focusProgressPercent}%`,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.focusActionRow}>
        <Pressable
          onPress={handleToggleFocusTimer}
          style={({ pressed }) => [
            styles.primaryFocusBtn,
            {
              backgroundColor: theme.accent,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <Ionicons
            name={isFocusActive ? 'pause' : 'play'}
            size={18}
            color={theme.accentInverted}
          />
          <Text style={[styles.focusBtnText, { color: theme.accentInverted }]}>
            {isFocusActive ? 'Pause Session' : 'Start Focus Flow'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleResetFocusTimer}
          style={({ pressed }) => [
            styles.secondaryFocusBtn,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
              opacity: pressed ? 0.7 : 1,
            },
          ]}>
          <Ionicons name="refresh-outline" size={16} color={theme.text} />
          <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Reset</Text>
        </Pressable>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetBtnText: {
    fontSize: 12,
  },
  focusTimerContainer: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.one,
    position: 'relative',
    overflow: 'hidden',
  },
  focusDigits: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  focusStatusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  focusProgressLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
  },
  focusProgressFill: {
    height: '100%',
  },
  focusActionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
  primaryFocusBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  focusBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryFocusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

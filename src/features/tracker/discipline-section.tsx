import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DisciplineTask, StreakData } from '@/services/discipline-service';

interface DisciplineSectionProps {
  tasks: DisciplineTask[];
  completedTaskIds: string[];
  streakData: StreakData | null;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (task: DisciplineTask) => void;
  onOpenAddModal: () => void;
}

export function DisciplineSection({
  tasks,
  completedTaskIds,
  streakData,
  onToggleTask,
  onDeleteTask,
  onOpenAddModal,
}: DisciplineSectionProps) {
  const theme = useTheme();

  const completedHabitsCount = tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const habitPercentage =
    tasks.length > 0 ? Math.round((completedHabitsCount / tasks.length) * 100) : 0;

  return (
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
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.badgeBackground },
            ]}>
            <Ionicons name="checkmark-done-outline" size={12} color={theme.badgeText} />
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              DAILY DISCIPLINE
            </Text>
          </View>

          {streakData?.wasStreakReset ? (
            <View
              style={[
                styles.streakResetPill,
                {
                  backgroundColor: 'rgba(255, 69, 58, 0.15)',
                  borderColor: '#FF453A',
                },
              ]}>
              <Ionicons name="warning" size={11} color="#FF453A" />
              <Text style={[styles.streakResetPillText, { color: '#FF453A' }]}>
                Streak: 0 (Missed Day)
              </Text>
            </View>
          ) : (
            <Text style={[styles.streakBadge, { color: theme.text }]}>
              🔥 {streakData?.currentStreak ?? 0} Day Streak
              {streakData && streakData.bestStreak > 0
                ? ` (Best: ${streakData.bestStreak})`
                : ''}
            </Text>
          )}
        </View>

        <View style={styles.sectionTitleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Daily Non-Negotiable Rituals
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Discipline creates freedom. Every missed day resets streak to 0.
            </Text>
          </View>
          <Pressable
            onPress={onOpenAddModal}
            style={({ pressed }) => [
              styles.addTaskBtn,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.75 : 1,
              },
            ]}>
            <Ionicons name="add" size={15} color={theme.accentInverted} />
            <Text style={[styles.addTaskBtnText, { color: theme.accentInverted }]}>
              Add Task
            </Text>
          </Pressable>
        </View>
      </View>

      {/* STREAK RESET WARNING BANNER IF MISSED */}
      {streakData?.wasStreakReset && (
        <View
          style={[
            styles.resetWarningBanner,
            {
              backgroundColor: 'rgba(255, 69, 58, 0.08)',
              borderColor: '#FF453A',
            },
          ]}>
          <Ionicons name="alert-circle" size={20} color="#FF453A" />
          <View style={styles.resetWarningTextWrap}>
            <Text style={[styles.resetWarningTitle, { color: '#FF453A' }]}>
              STREAK WAS RESET TO 0
            </Text>
            <Text style={[styles.resetWarningDesc, { color: theme.textSecondary }]}>
              You missed completing yesterday's discipline tasks. Complete all standards today
              to begin a fresh streak!
            </Text>
          </View>
        </View>
      )}

      {/* 7-DAY CONSISTENCY WEEK STRIP */}
      {streakData?.recentDays && streakData.recentDays.length > 0 && (
        <View
          style={[
            styles.weekStrip,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
            },
          ]}>
          {streakData.recentDays.map((item) => (
            <View
              key={item.dateKey}
              style={[
                styles.weekDayCol,
                item.isToday && [
                  styles.weekDayToday,
                  { borderColor: theme.accent, backgroundColor: theme.backgroundSelected },
                ],
              ]}>
              <Text
                style={[
                  styles.weekDayLabel,
                  { color: item.isToday ? theme.accent : theme.textSecondary },
                ]}>
                {item.dayLabel}
              </Text>
              <Text style={[styles.weekDayNum, { color: theme.text }]}>
                {item.dateNum}
              </Text>
              <View
                style={[
                  styles.weekDayStatus,
                  {
                    backgroundColor: item.isCompleted
                      ? '#34C759'
                      : item.isToday
                      ? 'transparent'
                      : 'rgba(255, 69, 58, 0.15)',
                    borderColor: item.isCompleted
                      ? '#34C759'
                      : item.isToday
                      ? theme.borderStrong
                      : 'rgba(255, 69, 58, 0.4)',
                  },
                ]}>
                {item.isCompleted ? (
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                ) : item.isToday ? (
                  <View style={[styles.todayPendingDot, { backgroundColor: theme.accent }]} />
                ) : (
                  <Ionicons name="close" size={10} color="#FF453A" />
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Rituals Progress Bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
            {completedHabitsCount} of {tasks.length} Standards Met
          </Text>
          <Text style={[styles.progressLabel, { color: theme.text, fontWeight: '700' }]}>
            {habitPercentage}% Completed
          </Text>
        </View>
        <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${habitPercentage}%`,
                backgroundColor: theme.progressFill,
              },
            ]}
          />
        </View>
      </View>

      {/* Habit Items List */}
      {tasks.length === 0 ? (
        <View style={[styles.emptyBox, { borderColor: theme.borderSubtle }]}>
          <Ionicons name="sparkles-outline" size={28} color={theme.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Daily Standards Yet
          </Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Tap "+ Add Task" to set up habits you must execute every day.
          </Text>
        </View>
      ) : (
        <View style={styles.habitsList}>
          {tasks.map((habit) => {
            const isDone = completedTaskIds.includes(habit.id);
            return (
              <View
                key={habit.id}
                style={[
                  styles.habitItem,
                  {
                    backgroundColor: isDone
                      ? theme.backgroundSelected
                      : theme.backgroundElement,
                    borderColor: isDone ? theme.borderStrong : theme.borderSubtle,
                  },
                ]}>
                <Pressable
                  onPress={() => onToggleTask(habit.id)}
                  style={({ pressed }) => [
                    styles.habitLeft,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}>
                  <View
                    style={[
                      styles.checkboxCircle,
                      {
                        backgroundColor: isDone ? theme.accent : 'transparent',
                        borderColor: isDone ? theme.accent : theme.borderStrong,
                      },
                    ]}>
                    {isDone && (
                      <Ionicons name="checkmark" size={13} color={theme.accentInverted} />
                    )}
                  </View>
                  <View style={styles.habitTextWrap}>
                    <Text
                      style={[
                        styles.habitTitle,
                        {
                          color: theme.text,
                          textDecorationLine: isDone ? 'line-through' : 'none',
                          opacity: isDone ? 0.7 : 1,
                        },
                      ]}>
                      {habit.title}
                    </Text>
                    <Text style={[styles.habitSubtitle, { color: theme.textSecondary }]}>
                      {habit.subtitle}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.habitRightActions}>
                  <Ionicons
                    name={habit.icon}
                    size={18}
                    color={isDone ? theme.text : theme.textMuted}
                  />
                  <Pressable
                    onPress={() => onDeleteTask(habit)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.deleteIconBtn,
                      { opacity: pressed ? 0.5 : 0.8 },
                    ]}>
                    <Ionicons name="trash-outline" size={15} color={theme.textMuted} />
                  </Pressable>
                </View>
              </View>
            );
          })}
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
  streakBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  streakResetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  streakResetPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: 2,
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
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  addTaskBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resetWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  resetWarningTextWrap: {
    flex: 1,
    gap: 2,
  },
  resetWarningTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resetWarningDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  weekDayCol: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.md,
  },
  weekDayToday: {
    borderWidth: 1,
  },
  weekDayLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  weekDayNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  weekDayStatus: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  todayPendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: Spacing.one,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  habitsList: {
    gap: Spacing.two,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
    paddingRight: Spacing.two,
  },
  habitRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  deleteIconBtn: {
    padding: 4,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitTextWrap: {
    flex: 1,
    gap: 2,
  },
  habitTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  habitSubtitle: {
    fontSize: 11,
  },
});

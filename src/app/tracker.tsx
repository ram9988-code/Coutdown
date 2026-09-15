import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { AddDisciplineModal } from '@/components/add-discipline-modal';
import { useCustomAlert } from '@/features/alerts';
import {
  BorderRadius,
  BottomTabInset,
  Fonts,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';
import {
  CircadianSection,
  DisciplineSection,
  FocusTimerSection,
  MilestonesSection,
} from '@/features/tracker';
import { SecurityModal } from '@/features/security';
import { useCountdowns } from '@/hooks/use-countdowns';
import { useTheme } from '@/hooks/use-theme';
import {
  disciplineService,
  DisciplineTask,
  StreakData,
  formatDateKey,
} from '@/services/discipline-service';

export default function TrackerScreen() {
  const theme = useTheme();
  const { showDeleteAlert } = useCustomAlert();
  const { ageProfile, cadence, nowTick } = useCountdowns();

  // Daily Discipline State
  const [tasks, setTasks] = useState<DisciplineTask[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isAddDisciplineVisible, setIsAddDisciplineVisible] = useState<boolean>(false);
  const [isSecurityVisible, setIsSecurityVisible] = useState<boolean>(false);

  const currentDate = new Date(nowTick);
  const todayKey = formatDateKey(currentDate);

  // Reload tasks, completions, and streak calculations
  const reloadDisciplines = async () => {
    try {
      const [loadedTasks, allCompletions, calculatedStreak] = await Promise.all([
        disciplineService.getTasks(),
        disciplineService.getCompletions(),
        disciplineService.calculateStreak(currentDate),
      ]);
      setTasks(loadedTasks);
      setCompletedTaskIds(allCompletions[todayKey] || []);
      setStreakData(calculatedStreak);
    } catch (err) {
      console.warn('Failed to load disciplines:', err);
    }
  };

  useEffect(() => {
    reloadDisciplines();
  }, [nowTick]);

  // Toggle habit completion for today
  const handleToggleHabit = async (id: string) => {
    try {
      const { completedTaskIds: updatedList } = await disciplineService.toggleTaskCompletion(
        todayKey,
        id
      );
      setCompletedTaskIds(updatedList);
      const updatedStreak = await disciplineService.calculateStreak(currentDate);
      setStreakData(updatedStreak);
    } catch (err) {
      console.warn('Failed to toggle discipline task:', err);
    }
  };

  // Add custom discipline task
  const handleAddDiscipline = async (
    title: string,
    subtitle: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    await disciplineService.addTask(title, subtitle, icon);
    await reloadDisciplines();
  };

  // Delete discipline task with custom confirmation alert
  const handleDeleteDiscipline = (task: DisciplineTask) => {
    showDeleteAlert({
      title: 'Remove Discipline',
      itemName: task.title,
      message: 'Are you sure you want to remove this discipline standard from your daily tracking?',
      confirmText: 'Remove Standard',
      cancelText: 'Keep Standard',
      onDelete: async () => {
        await disciplineService.deleteTask(task.id);
        await reloadDisciplines();
      },
    });
  };

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
              CHRONO TRACKER
            </Text>
            <View style={styles.subRow}>
              <View style={[styles.liveDot, { backgroundColor: theme.text }]} />
              <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
                Circadian Rhythm & Daily Focus Mastery
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            {/* Security & Lock Settings Button */}
            <Pressable
              onPress={() => setIsSecurityVisible(true)}
              style={({ pressed }) => [
                styles.securityBtn,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <Ionicons name="shield-checkmark" size={13} color={theme.accent} />
              <Text style={[styles.securityBtnText, { color: theme.text }]}>Security</Text>
            </Pressable>

            {/* Midnight Reset Badge */}
            <View
              style={[
                styles.resetPill,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}>
              <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
              <Text
                style={[
                  styles.resetText,
                  {
                    color: theme.textSecondary,
                    fontFamily: Fonts?.mono ?? 'monospace',
                  },
                ]}>
                {String(cadence.dayCadence.hoursLeft).padStart(2, '0')}:
                {String(cadence.dayCadence.minutesLeft).padStart(2, '0')}:
                {String(cadence.dayCadence.secondsLeft).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}>
          {/* SECTION 1: CIRCADIAN ENERGY WINDOW */}
          <CircadianSection
            nowTick={nowTick}
            circadianPhase={cadence.dayCadence.circadianPhase}
            progressPercent={cadence.dayCadence.progressPercent}
          />

          {/* SECTION 2: FOCUS ENGINE & DEEP WORK TIMER */}
          <FocusTimerSection />

          {/* SECTION 3: DAILY DISCIPLINE & STREAK TRACKING */}
          <DisciplineSection
            tasks={tasks}
            completedTaskIds={completedTaskIds}
            streakData={streakData}
            onToggleTask={handleToggleHabit}
            onDeleteTask={handleDeleteDiscipline}
            onOpenAddModal={() => setIsAddDisciplineVisible(true)}
          />

          {/* SECTION 4: LIFE ODYSSEY & NEXT MILESTONES */}
          <MilestonesSection birthDate={ageProfile.birthDate} nowTick={nowTick} />
        </ScrollView>

        {/* Add Daily Discipline Modal */}
        <AddDisciplineModal
          isVisible={isAddDisciplineVisible}
          onClose={() => setIsAddDisciplineVisible(false)}
          onAdd={handleAddDiscipline}
        />

        {/* Security & Preferences Modal (Includes Master PIN Setup) */}
        <SecurityModal
          isVisible={isSecurityVisible}
          onClose={() => setIsSecurityVisible(false)}
        />
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
  subRow: {
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  securityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  securityBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.five,
  },
});

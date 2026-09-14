import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export interface DisciplineTask {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  createdAt: string;
}

export interface DayHistoryItem {
  dateKey: string;
  dayLabel: string; // e.g. "Mon", "Tue"
  dateNum: number;  // e.g. 14
  isCompleted: boolean;
  isToday: boolean;
  completedCount: number;
  totalCount: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  wasStreakReset: boolean;
  isTodayCompleted: boolean;
  isYesterdayCompleted: boolean;
  recentDays: DayHistoryItem[];
}

const STORAGE_KEYS = {
  TASKS: '@daily_discipline_tasks_v2',
  COMPLETIONS: '@daily_discipline_completions_v2',
  BEST_STREAK: '@daily_discipline_best_streak_v2',
};

const DEFAULT_INITIAL_TASKS: DisciplineTask[] = [
  {
    id: 'deep-work',
    title: '90m Deep Work Block',
    subtitle: 'Zero distraction high-leverage execution',
    icon: 'flash-outline',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'physical-training',
    title: 'Physical Movement & Training',
    subtitle: '45+ mins strength, cardio or mobility',
    icon: 'barbell-outline',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mindful-solitude',
    title: 'Mindful Solitude & Walk',
    subtitle: '15 mins silence or nature without screens',
    icon: 'leaf-outline',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Before 11:00 PM',
    subtitle: 'Complete darkness, 7.5+ hours restoration',
    icon: 'moon-outline',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Format a Date object as YYYY-MM-DD
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date with offset days from a base date
 */
export function getDateWithOffset(base: Date, offsetDays: number): Date {
  const res = new Date(base);
  res.setDate(res.getDate() + offsetDays);
  return res;
}

class DisciplineService {
  /**
   * Load user's configured daily discipline tasks
   */
  async getTasks(): Promise<DisciplineTask[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Initialize with default tasks if empty
      await this.saveTasks(DEFAULT_INITIAL_TASKS);
      return DEFAULT_INITIAL_TASKS;
    } catch (err) {
      console.warn('Failed to load discipline tasks:', err);
      return DEFAULT_INITIAL_TASKS;
    }
  }

  /**
   * Save configured tasks
   */
  async saveTasks(tasks: DisciplineTask[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.warn('Failed to save discipline tasks:', err);
    }
  }

  /**
   * Add a new discipline task
   */
  async addTask(title: string, subtitle: string, icon: keyof typeof Ionicons.glyphMap): Promise<DisciplineTask> {
    const tasks = await this.getTasks();
    const newTask: DisciplineTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Daily non-negotiable standard',
      icon,
      createdAt: new Date().toISOString(),
    };

    const updated = [...tasks, newTask];
    await this.saveTasks(updated);
    return newTask;
  }

  /**
   * Delete a discipline task
   */
  async deleteTask(taskId: string): Promise<DisciplineTask[]> {
    const tasks = await this.getTasks();
    const updated = tasks.filter((t) => t.id !== taskId);
    await this.saveTasks(updated);
    return updated;
  }

  /**
   * Get all completion records: dateKey -> string[] (completed task IDs)
   */
  async getCompletions(): Promise<Record<string, string[]>> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      if (raw) {
        return JSON.parse(raw);
      }
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Toggle completion of a task on a specific date
   */
  async toggleTaskCompletion(dateKey: string, taskId: string): Promise<{ completedTaskIds: string[]; isFullyCompleted: boolean }> {
    try {
      const completions = await this.getCompletions();
      const currentList = completions[dateKey] || [];

      let updatedList: string[];
      if (currentList.includes(taskId)) {
        updatedList = currentList.filter((id) => id !== taskId);
      } else {
        updatedList = [...currentList, taskId];
      }

      completions[dateKey] = updatedList;
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));

      const tasks = await this.getTasks();
      const isFullyCompleted = tasks.length > 0 && tasks.every((t) => updatedList.includes(t.id));

      return { completedTaskIds: updatedList, isFullyCompleted };
    } catch (err) {
      console.warn('Failed to toggle completion:', err);
      return { completedTaskIds: [], isFullyCompleted: false };
    }
  }

  /**
   * Check if a specific date was fully completed
   */
  private checkDateFullyCompleted(
    dateKey: string,
    tasks: DisciplineTask[],
    completions: Record<string, string[]>
  ): boolean {
    if (tasks.length === 0) return false;
    const completedIds = completions[dateKey] || [];
    return tasks.every((t) => completedIds.includes(t.id));
  }

  /**
   * Calculate current streak, checking missed days and resetting to 0 if a day was missed
   */
  async calculateStreak(referenceDate: Date = new Date()): Promise<StreakData> {
    const [tasks, completions, rawBest] = await Promise.all([
      this.getTasks(),
      this.getCompletions(),
      AsyncStorage.getItem(STORAGE_KEYS.BEST_STREAK),
    ]);

    let savedBest = rawBest ? parseInt(rawBest, 10) : 0;
    if (isNaN(savedBest)) savedBest = 0;

    const todayKey = formatDateKey(referenceDate);
    const yesterday = getDateWithOffset(referenceDate, -1);
    const yesterdayKey = formatDateKey(yesterday);

    const isTodayCompleted = this.checkDateFullyCompleted(todayKey, tasks, completions);
    const isYesterdayCompleted = this.checkDateFullyCompleted(yesterdayKey, tasks, completions);

    let currentStreak = 0;
    let wasStreakReset = false;

    if (isTodayCompleted) {
      // Today is completed -> streak is at least 1
      currentStreak = 1;
      // Count backwards from yesterday
      let offset = -1;
      while (true) {
        const pastDate = getDateWithOffset(referenceDate, offset);
        const pastKey = formatDateKey(pastDate);
        if (this.checkDateFullyCompleted(pastKey, tasks, completions)) {
          currentStreak++;
          offset--;
        } else {
          break;
        }
      }
    } else {
      // Today is NOT yet completed
      if (isYesterdayCompleted) {
        // Yesterday was completed, so current ongoing streak is preserved while today is in progress
        currentStreak = 1;
        let offset = -2;
        while (true) {
          const pastDate = getDateWithOffset(referenceDate, offset);
          const pastKey = formatDateKey(pastDate);
          if (this.checkDateFullyCompleted(pastKey, tasks, completions)) {
            currentStreak++;
            offset--;
          } else {
            break;
          }
        }
      } else {
        // Yesterday was MISSED and today is not completed -> STREAK RESETS TO 0!
        currentStreak = 0;
        wasStreakReset = true;
      }
    }

    if (currentStreak > savedBest) {
      savedBest = currentStreak;
      AsyncStorage.setItem(STORAGE_KEYS.BEST_STREAK, String(savedBest)).catch(() => {});
    }

    // Build last 7 days history
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const recentDays: DayHistoryItem[] = [];

    for (let i = -6; i <= 0; i++) {
      const d = getDateWithOffset(referenceDate, i);
      const key = formatDateKey(d);
      const completedIds = completions[key] || [];
      const isCompleted = this.checkDateFullyCompleted(key, tasks, completions);

      recentDays.push({
        dateKey: key,
        dayLabel: dayNames[d.getDay()],
        dateNum: d.getDate(),
        isCompleted,
        isToday: i === 0,
        completedCount: completedIds.length,
        totalCount: tasks.length,
      });
    }

    return {
      currentStreak,
      bestStreak: savedBest,
      wasStreakReset,
      isTodayCompleted,
      isYesterdayCompleted,
      recentDays,
    };
  }
}

export const disciplineService = new DisciplineService();

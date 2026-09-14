import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownItem, SuccessGoal, TimeRemaining, UserProfileAge } from '@/types/countdown';

const STORAGE_KEYS = {
  AGE_PROFILE: '@countdown_age_profile_v1',
  SUCCESS_GOAL: '@countdown_success_goal_v1',
  CUSTOM_COUNTDOWNS: '@countdown_custom_items_v1',
};

// Default seed data
export const DEFAULT_AGE_PROFILE: UserProfileAge = {
  birthDate: '2000-01-01',
  expectedLifespanYears: 80,
};

// 1 year from now for default success goal
const defaultSuccessTarget = new Date();
defaultSuccessTarget.setFullYear(defaultSuccessTarget.getFullYear() + 1);
const defaultSuccessStart = new Date();
defaultSuccessStart.setMonth(defaultSuccessStart.getMonth() - 2);

export const DEFAULT_SUCCESS_GOAL: SuccessGoal = {
  title: 'Next Level Breakthrough & Freedom',
  targetDate: defaultSuccessTarget.toISOString(),
  startDate: defaultSuccessStart.toISOString(),
  visionNote: 'Execute daily discipline, master the craft, achieve relentless focus.',
};

// Next upcoming sample countdowns
const sampleEvent1 = new Date();
sampleEvent1.setDate(sampleEvent1.getDate() + 45);
sampleEvent1.setHours(18, 0, 0, 0);

const sampleEvent2 = new Date();
sampleEvent2.setDate(sampleEvent2.getDate() + 180);
sampleEvent2.setHours(9, 0, 0, 0);

export const DEFAULT_COUNTDOWNS: CountdownItem[] = [
  {
    id: 'sample-1',
    title: 'Product Launch v1.0',
    targetDate: sampleEvent1.toISOString(),
    startDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    category: 'Project',
    note: 'Ship MVP, onboard initial 100 beta users.',
    createdAt: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'sample-2',
    title: 'Solitary Retreat & Deep Focus',
    targetDate: sampleEvent2.toISOString(),
    category: 'Personal',
    note: 'Off-grid meditation and high-intensity learning.',
    createdAt: new Date().toISOString(),
    isPinned: false,
  },
];

export async function loadAgeProfile(): Promise<UserProfileAge> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AGE_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load age profile:', err);
  }
  return DEFAULT_AGE_PROFILE;
}

export async function saveAgeProfile(profile: UserProfileAge): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AGE_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save age profile:', err);
  }
}

export async function loadSuccessGoal(): Promise<SuccessGoal> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SUCCESS_GOAL);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load success goal:', err);
  }
  return DEFAULT_SUCCESS_GOAL;
}

export async function saveSuccessGoal(goal: SuccessGoal): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SUCCESS_GOAL, JSON.stringify(goal));
  } catch (err) {
    console.warn('Failed to save success goal:', err);
  }
}

export async function loadCustomCountdowns(): Promise<CountdownItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_COUNTDOWNS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load countdowns:', err);
  }
  return DEFAULT_COUNTDOWNS;
}

export async function saveCustomCountdowns(items: CountdownItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_COUNTDOWNS, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save countdowns:', err);
  }
}

/**
 * Calculates accurate real-time difference between target date and now.
 * Works seamlessly across app suspensions and restarts because it computes
 * from wall-clock timestamps.
 */
export function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isPast: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isPast: false,
  };
}

/**
 * Calculates remaining life age countdown from birth date and expected years.
 */
export function calculateAgeRemaining(
  birthDateIso: string,
  expectedLifespanYears: number
): {
  remaining: TimeRemaining & { years: number };
  yearsLived: number;
  percentageLived: number;
  totalLifeDays: number;
  remainingDays: number;
} {
  const birth = new Date(birthDateIso);
  const birthTime = birth.getTime();

  // End of life estimated timestamp
  const end = new Date(birth);
  end.setFullYear(birth.getFullYear() + expectedLifespanYears);
  const endTime = end.getTime();

  const now = Date.now();
  const totalLifeSpanMs = endTime - birthTime;
  const elapsedMs = Math.max(0, now - birthTime);
  const remainingMs = Math.max(0, endTime - now);

  const percentageLived = Math.min(
    100,
    Math.max(0, Number(((elapsedMs / totalLifeSpanMs) * 100).toFixed(4)))
  );

  const yearsLived = Number(((now - birthTime) / (365.25 * 86400000)).toFixed(2));

  const totalRemainingSeconds = Math.floor(remainingMs / 1000);
  const years = Math.floor(totalRemainingSeconds / (365.25 * 86400));
  const remainingSecondsAfterYears = totalRemainingSeconds - Math.floor(years * 365.25 * 86400);
  const days = Math.floor(remainingSecondsAfterYears / 86400);
  const hours = Math.floor((remainingSecondsAfterYears % 86400) / 3600);
  const minutes = Math.floor((remainingSecondsAfterYears % 3600) / 60);
  const seconds = remainingSecondsAfterYears % 60;

  const totalLifeDays = Math.round(totalLifeSpanMs / 86400000);
  const remainingDays = Math.max(0, Math.round(remainingMs / 86400000));

  return {
    remaining: {
      years,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: totalRemainingSeconds,
      isPast: remainingMs <= 0,
    },
    yearsLived,
    percentageLived,
    totalLifeDays,
    remainingDays,
  };
}

export type CountdownCategory =
  | 'All'
  | 'Milestone'
  | 'Project'
  | 'Event'
  | 'Habit'
  | 'Personal';

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string; // ISO date string
  startDate?: string; // Optional start date for progress percentage
  category: CountdownCategory;
  note?: string;
  createdAt: string;
  isPinned?: boolean;
  iconName?: string;
}

export interface UserProfileAge {
  birthDate: string; // ISO date string: YYYY-MM-DD
  expectedLifespanYears: number; // e.g. 80
}

export interface SuccessGoal {
  title: string;
  targetDate: string; // ISO date string
  startDate: string; // ISO date string for progress bar
  visionNote?: string;
}

export interface TimeRemaining {
  years?: number;
  months?: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

import { TimeRemaining, UserProfileAge } from '@/types/countdown';

export interface SecondCadence {
  secondsLeft: number;
  currentSecond: number;
  progressPercent: number; // 0 to 100 within current minute
}

export interface HourCadence {
  currentMinute: number;
  minutesLeft: number;
  secondsLeft: number;
  progressPercent: number; // 0 to 100 within current hour
}

export interface DayCadence {
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  progressPercent: number; // 0 to 100 within today (24h)
  circadianPhase: 'Dawn' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  currentHour: number;
}

export interface WeekCadence {
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  progressPercent: number;
  currentDayOfWeek: number; // 0 (Sun) to 6 (Sat)
}

export interface YearCadence {
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  progressPercent: number;
  currentYear: number;
}

export interface ExistentialPerspective {
  // Waking life calculation (assuming ~8 hours sleep per day = 1/3 of life)
  wakingYearsRemaining: number;
  wakingDaysRemaining: number;
  sleepDaysRemaining: number;

  // Weekends left in lifetime (Saturdays & Sundays)
  remainingWeekends: number;

  // Seasonal rhythms
  remainingSummers: number;
  remainingSprings: number;

  // Vitality live metrics (live ticking based on remaining lifetime seconds)
  estimatedHeartbeatsRemaining: number;
  estimatedBreathsRemaining: number;

  // Projected end year
  estimatedEndYear: number;
}

/**
 * Calculates live time cadence metrics for Second, Minute, Hour, Day, Week, and Year.
 * Uses system wall clock time so it updates every second accurately.
 */
export function calculateLiveCadence(now: Date = new Date()) {
  const currentSecond = now.getSeconds();
  const currentMinute = now.getMinutes();
  const currentHour = now.getHours();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday

  // 1. Second / Minute Cadence (this minute)
  const secondsLeftInMinute = 59 - currentSecond;
  const secondProgressPercent = Number(((currentSecond / 60) * 100).toFixed(1));

  const secondCadence: SecondCadence = {
    secondsLeft: secondsLeftInMinute,
    currentSecond,
    progressPercent: secondProgressPercent,
  };

  // 2. Hour Cadence (this hour)
  const minutesLeftInHour = 59 - currentMinute;
  const secondsLeftInHour = secondsLeftInMinute;
  const secondsElapsedInHour = currentMinute * 60 + currentSecond;
  const hourProgressPercent = Number(((secondsElapsedInHour / 3600) * 100).toFixed(1));

  const hourCadence: HourCadence = {
    currentMinute,
    minutesLeft: minutesLeftInHour,
    secondsLeft: secondsLeftInHour,
    progressPercent: hourProgressPercent,
  };

  // 3. Day Cadence (today until midnight)
  const hoursLeftInDay = 23 - currentHour;
  const minutesLeftInDay = 59 - currentMinute;
  const secondsLeftInDay = 59 - currentSecond;
  const secondsElapsedInDay = currentHour * 3600 + currentMinute * 60 + currentSecond;
  const dayProgressPercent = Number(((secondsElapsedInDay / 86400) * 100).toFixed(2));

  let circadianPhase: DayCadence['circadianPhase'] = 'Morning';
  if (currentHour >= 5 && currentHour < 8) circadianPhase = 'Dawn';
  else if (currentHour >= 8 && currentHour < 12) circadianPhase = 'Morning';
  else if (currentHour >= 12 && currentHour < 17) circadianPhase = 'Afternoon';
  else if (currentHour >= 17 && currentHour < 21) circadianPhase = 'Evening';
  else circadianPhase = 'Night';

  const dayCadence: DayCadence = {
    hoursLeft: hoursLeftInDay,
    minutesLeft: minutesLeftInDay,
    secondsLeft: secondsLeftInDay,
    progressPercent: dayProgressPercent,
    circadianPhase,
    currentHour,
  };

  // 4. Week Cadence (until end of Sunday)
  // Convert Sunday (0) to day index 6, Monday (1) to 0, etc., or standard ISO week
  const daysPassedInWeek = (currentDayOfWeek + 6) % 7; // Monday = 0, Sunday = 6
  const secondsElapsedInWeek = daysPassedInWeek * 86400 + secondsElapsedInDay;
  const totalSecondsInWeek = 7 * 86400;
  const weekProgressPercent = Number(((secondsElapsedInWeek / totalSecondsInWeek) * 100).toFixed(2));
  const totalWeekSecondsRemaining = totalSecondsInWeek - secondsElapsedInWeek;
  const daysLeftInWeek = Math.floor(totalWeekSecondsRemaining / 86400);
  const hoursLeftInWeek = Math.floor((totalWeekSecondsRemaining % 86400) / 3600);
  const minutesLeftInWeek = Math.floor((totalWeekSecondsRemaining % 3600) / 60);
  const secondsLeftInWeek = totalWeekSecondsRemaining % 60;

  const weekCadence: WeekCadence = {
    daysLeft: daysLeftInWeek,
    hoursLeft: hoursLeftInWeek,
    minutesLeft: minutesLeftInWeek,
    secondsLeft: secondsLeftInWeek,
    progressPercent: weekProgressPercent,
    currentDayOfWeek,
  };

  // 5. Year Cadence (until Dec 31, 23:59:59)
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0).getTime();
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999).getTime();
  const totalYearMs = endOfYear - startOfYear;
  const nowMs = now.getTime();
  const elapsedYearMs = Math.max(0, nowMs - startOfYear);
  const remainingYearMs = Math.max(0, endOfYear - nowMs);
  const yearProgressPercent = Number(((elapsedYearMs / totalYearMs) * 100).toFixed(4));

  const totalYearSecondsRemaining = Math.floor(remainingYearMs / 1000);
  const daysLeftInYear = Math.floor(totalYearSecondsRemaining / 86400);
  const hoursLeftInYear = Math.floor((totalYearSecondsRemaining % 86400) / 3600);
  const minutesLeftInYear = Math.floor((totalYearSecondsRemaining % 3600) / 60);
  const secondsLeftInYear = totalYearSecondsRemaining % 60;

  const yearCadence: YearCadence = {
    daysLeft: daysLeftInYear,
    hoursLeft: hoursLeftInYear,
    minutesLeft: minutesLeftInYear,
    secondsLeft: secondsLeftInYear,
    progressPercent: yearProgressPercent,
    currentYear,
  };

  return {
    secondCadence,
    hourCadence,
    dayCadence,
    weekCadence,
    yearCadence,
  };
}

/**
 * Calculates profound existential metrics:
 * Waking hours vs sleep, remaining weekends, summers left, and live approximate heartbeats/breaths.
 */
export function calculateExistentialPerspective(
  ageProfile: UserProfileAge,
  nowMs: number = Date.now()
): ExistentialPerspective {
  const birth = new Date(ageProfile.birthDate);
  const end = new Date(birth);
  end.setFullYear(birth.getFullYear() + ageProfile.expectedLifespanYears);
  const endTime = end.getTime();

  const remainingMs = Math.max(0, endTime - nowMs);
  const totalRemainingDays = Math.floor(remainingMs / 86400000);
  const totalRemainingSeconds = Math.floor(remainingMs / 1000);

  // Waking life calculation: ~8 hours per day is sleep (1/3), ~16 hours is awake (2/3)
  const wakingRatio = 2 / 3;
  const wakingDaysRemaining = Math.round(totalRemainingDays * wakingRatio);
  const sleepDaysRemaining = totalRemainingDays - wakingDaysRemaining;
  const wakingYearsRemaining = Number((wakingDaysRemaining / 365.25).toFixed(1));

  // Weekends left: ~2 weekend days out of 7 days, or total weeks left * 2 days
  const weeksLeft = Math.floor(totalRemainingDays / 7);
  const remainingWeekends = weeksLeft; // Count of full weekends (Sat + Sun)

  // Remaining Summers & Springs (approx equal to remaining whole years)
  const remainingYears = Math.floor(totalRemainingDays / 365.25);
  const remainingSummers = Math.max(0, remainingYears);
  const remainingSprings = Math.max(0, remainingYears);

  // Approximate vital pulses:
  // Average resting human heart rate ~ 72 beats per minute = 1.2 beats / sec
  // Average human respiration rate ~ 16 breaths per minute = ~0.267 breaths / sec
  const estimatedHeartbeatsRemaining = Math.floor(totalRemainingSeconds * 1.2);
  const estimatedBreathsRemaining = Math.floor(totalRemainingSeconds * (16 / 60));

  return {
    wakingYearsRemaining,
    wakingDaysRemaining,
    sleepDaysRemaining,
    remainingWeekends,
    remainingSummers,
    remainingSprings,
    estimatedHeartbeatsRemaining,
    estimatedBreathsRemaining,
    estimatedEndYear: end.getFullYear(),
  };
}

/**
 * Curated stoic and mindfulness perspective reflections
 */
export interface PerspectiveReflection {
  id: string;
  quote: string;
  author: string;
  context: string;
}

export const PERSPECTIVE_REFLECTIONS: PerspectiveReflection[] = [
  {
    id: 'seneca-1',
    quote: 'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough if you know how to use it.',
    author: 'Seneca',
    context: 'On the Brevity of Life',
  },
  {
    id: 'aurelius-1',
    quote: 'You could leave life right now. Let that determine what you do and say and think.',
    author: 'Marcus Aurelius',
    context: 'Meditations, Book II',
  },
  {
    id: 'burkeman-1',
    quote: 'The average human lifespan is absurdly, terrifyingly, insultingly short: just over four thousand weeks.',
    author: 'Oliver Burkeman',
    context: 'Four Thousand Weeks: Time Management for Mortals',
  },
  {
    id: 'jobs-1',
    quote: 'Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.',
    author: 'Steve Jobs',
    context: 'Stanford Commencement Address',
  },
  {
    id: 'epictetus-1',
    quote: 'Do not act as if you were going to live ten thousand years. Death hangs over you. While you live, while it is in your power, be good.',
    author: 'Epictetus',
    context: 'Discourses',
  },
  {
    id: 'nietzsche-1',
    quote: 'My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity.',
    author: 'Friedrich Nietzsche',
    context: 'Ecce Homo',
  },
];

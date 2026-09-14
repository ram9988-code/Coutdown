import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  calculateLiveCadence,
  calculateExistentialPerspective,
} from '@/services/cadence';
import {
  calculateAgeRemaining,
  calculateTimeRemaining,
  DEFAULT_AGE_PROFILE,
  DEFAULT_COUNTDOWNS,
  DEFAULT_SUCCESS_GOAL,
  loadAgeProfile,
  loadCustomCountdowns,
  loadSuccessGoal,
  saveAgeProfile,
  saveCustomCountdowns,
  saveSuccessGoal,
} from '@/services/storage';
import { tickAudio } from '@/services/tick-audio';
import { CountdownItem, SuccessGoal, UserProfileAge } from '@/types/countdown';

export function useCountdowns() {
  const [ageProfile, setAgeProfile] = useState<UserProfileAge>(DEFAULT_AGE_PROFILE);
  const [successGoal, setSuccessGoal] = useState<SuccessGoal>(DEFAULT_SUCCESS_GOAL);
  const [countdowns, setCountdowns] = useState<CountdownItem[]>(DEFAULT_COUNTDOWNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Tick state to trigger re-renders every 1 second
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Load persisted data on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const [storedAge, storedSuccess, storedItems] = await Promise.all([
        loadAgeProfile(),
        loadSuccessGoal(),
        loadCustomCountdowns(),
      ]);
      if (mounted) {
        setAgeProfile(storedAge);
        setSuccessGoal(storedSuccess);
        setCountdowns(storedItems);
        setIsLoaded(true);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Continuous live timer tick & AppState background re-sync
  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNowTick(current);
      tickAudio.playTick();
    }, 1000);

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App woke up from background/closed state - update timestamp immediately!
        setNowTick(Date.now());
      }
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

  // Update Age Profile
  const updateAge = useCallback(async (newProfile: UserProfileAge) => {
    setAgeProfile(newProfile);
    await saveAgeProfile(newProfile);
  }, []);

  // Update Success Goal
  const updateSuccess = useCallback(async (newGoal: SuccessGoal) => {
    setSuccessGoal(newGoal);
    await saveSuccessGoal(newGoal);
  }, []);

  // Add Custom Countdown
  const addCountdown = useCallback(
    async (item: Omit<CountdownItem, 'id' | 'createdAt'>) => {
      const newItem: CountdownItem = {
        ...item,
        id: `cd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...countdowns];
      setCountdowns(updated);
      await saveCustomCountdowns(updated);
      return newItem;
    },
    [countdowns]
  );

  // Update existing Countdown
  const updateCountdown = useCallback(
    async (updatedItem: CountdownItem) => {
      const updated = countdowns.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      setCountdowns(updated);
      await saveCustomCountdowns(updated);
    },
    [countdowns]
  );

  // Delete Countdown
  const deleteCountdown = useCallback(
    async (id: string) => {
      const updated = countdowns.filter((item) => item.id !== id);
      setCountdowns(updated);
      await saveCustomCountdowns(updated);
    },
    [countdowns]
  );

  // Toggle Pin
  const togglePinCountdown = useCallback(
    async (id: string) => {
      const updated = countdowns.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      // Sort pinned first
      updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      setCountdowns(updated);
      await saveCustomCountdowns(updated);
    },
    [countdowns]
  );

  // Live calculated age remaining metrics
  const ageRemaining = calculateAgeRemaining(
    ageProfile.birthDate,
    ageProfile.expectedLifespanYears
  );

  // Live calculated success goal metrics
  const successRemaining = calculateTimeRemaining(successGoal.targetDate);
  const successStartMs = new Date(successGoal.startDate).getTime();
  const successTargetMs = new Date(successGoal.targetDate).getTime();
  const totalSuccessDuration = Math.max(1, successTargetMs - successStartMs);
  const successElapsed = Math.max(0, nowTick - successStartMs);
  const successProgress = Math.min(
    100,
    Math.max(0, Number(((successElapsed / totalSuccessDuration) * 100).toFixed(1)))
  );

  // Live calculated time horizons & cadence
  const cadence = calculateLiveCadence(new Date(nowTick));

  // Live existential perspective
  const existential = calculateExistentialPerspective(ageProfile, nowTick);

  return {
    isLoaded,
    nowTick,
    ageProfile,
    successGoal,
    countdowns,
    ageRemaining,
    successRemaining,
    successProgress,
    cadence,
    existential,
    updateAge,
    updateSuccess,
    addCountdown,
    updateCountdown,
    deleteCountdown,
    togglePinCountdown,
  };
}

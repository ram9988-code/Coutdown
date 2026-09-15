import { useEffect, useState } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { securityService } from '@/services/security-service';

const KEEP_AWAKE_TAG = 'countdown_app_keep_awake';

/**
 * Hook to keep the screen awake and prevent phone from turning off or locking
 * when the app is active and open.
 */
export function useKeepAwakeManager() {
  const [isKeepAwakeActive, setIsKeepAwakeActive] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function applyKeepAwake() {
      try {
        const settings = await securityService.getSettings();
        if (!isMounted) return;

        if (settings.isKeepAwakeEnabled) {
          await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
          setIsKeepAwakeActive(true);
        } else {
          deactivateKeepAwake(KEEP_AWAKE_TAG);
          setIsKeepAwakeActive(false);
        }
      } catch (err) {
        console.warn('Keep awake error:', err);
      }
    }

    applyKeepAwake();

    return () => {
      isMounted = false;
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, []);

  const toggleKeepAwake = async (enable: boolean) => {
    try {
      await securityService.setKeepAwakeEnabled(enable);
      if (enable) {
        await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
        setIsKeepAwakeActive(true);
      } else {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
        setIsKeepAwakeActive(false);
      }
    } catch (err) {
      console.warn('Toggle keep awake error:', err);
    }
  };

  return { isKeepAwakeActive, toggleKeepAwake };
}

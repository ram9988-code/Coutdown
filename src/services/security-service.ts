import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const STORAGE_KEYS = {
  LOCK_ENABLED: '@app_lock_enabled_v1',
  MASTER_PIN: '@app_master_pin_v1',
  BIOMETRICS_ENABLED: '@app_biometrics_enabled_v1',
  KEEP_AWAKE_ENABLED: '@app_keep_awake_enabled_v1',
};

export interface SecuritySettings {
  isLockEnabled: boolean;
  hasPin: boolean;
  isBiometricsEnabled: boolean;
  isKeepAwakeEnabled: boolean;
  biometricHardwareAvailable: boolean;
  biometricEnrolled: boolean;
}

class SecurityService {
  /**
   * Check if device has biometric hardware and enrolled biometrics
   */
  async checkBiometricCapabilities(): Promise<{ hasHardware: boolean; isEnrolled: boolean }> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;
      return { hasHardware, isEnrolled };
    } catch {
      return { hasHardware: false, isEnrolled: false };
    }
  }

  /**
   * Get complete security settings
   */
  async getSettings(): Promise<SecuritySettings> {
    try {
      const { hasHardware, isEnrolled } = await this.checkBiometricCapabilities();
      const [rawLock, rawPin, rawBio, rawAwake] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LOCK_ENABLED),
        AsyncStorage.getItem(STORAGE_KEYS.MASTER_PIN),
        AsyncStorage.getItem(STORAGE_KEYS.BIOMETRICS_ENABLED),
        AsyncStorage.getItem(STORAGE_KEYS.KEEP_AWAKE_ENABLED),
      ]);

      const hasPin = !!rawPin && rawPin.length >= 4;
      // Lock is enabled if explicitly true, or if PIN is set and lock was never explicitly disabled
      const isLockEnabled = rawLock !== null ? rawLock === 'true' : hasPin;
      // Biometrics enabled by default if available and enrolled
      const isBiometricsEnabled = rawBio !== null ? rawBio === 'true' : isEnrolled;
      // Keep awake default is true as requested by user
      const isKeepAwakeEnabled = rawAwake !== null ? rawAwake === 'true' : true;

      return {
        isLockEnabled,
        hasPin,
        isBiometricsEnabled,
        isKeepAwakeEnabled,
        biometricHardwareAvailable: hasHardware,
        biometricEnrolled: isEnrolled,
      };
    } catch (err) {
      console.warn('Failed to load security settings:', err);
      return {
        isLockEnabled: false,
        hasPin: false,
        isBiometricsEnabled: false,
        isKeepAwakeEnabled: true,
        biometricHardwareAvailable: false,
        biometricEnrolled: false,
      };
    }
  }

  /**
   * Set master PIN and automatically enable lock
   */
  async setMasterPin(pin: string): Promise<boolean> {
    if (!pin || pin.length < 4) return false;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MASTER_PIN, pin);
      await AsyncStorage.setItem(STORAGE_KEYS.LOCK_ENABLED, 'true');
      return true;
    } catch (err) {
      console.warn('Failed to set master PIN:', err);
      return false;
    }
  }

  /**
   * Verify input PIN against saved master PIN
   */
  async verifyPin(inputPin: string): Promise<boolean> {
    try {
      const storedPin = await AsyncStorage.getItem(STORAGE_KEYS.MASTER_PIN);
      if (!storedPin) return false;
      return storedPin.trim() === inputPin.trim();
    } catch {
      return false;
    }
  }

  /**
   * Toggle App Lock
   */
  async setLockEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCK_ENABLED, enabled ? 'true' : 'false');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Toggle Biometrics
   */
  async setBiometricsEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRICS_ENABLED, enabled ? 'true' : 'false');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Toggle Keep Screen Awake
   */
  async setKeepAwakeEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.KEEP_AWAKE_ENABLED, enabled ? 'true' : 'false');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Prompt biometric authentication (Fingerprint / Face ID)
   */
  async authenticateBiometrics(promptMessage: string = 'Unlock Countdown'): Promise<{ success: boolean; error?: string }> {
    try {
      const { hasHardware, isEnrolled } = await this.checkBiometricCapabilities();
      if (!hasHardware || !isEnrolled) {
        return { success: false, error: 'Biometrics not available on this device' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Use PIN',
        disableDeviceFallback: true, // we handle PIN fallback with our custom secure PIN screen
      });

      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error || 'Authentication canceled or failed' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Biometric authentication failed' };
    }
  }
}

export const securityService = new SecurityService();

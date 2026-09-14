import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { securityService, SecuritySettings } from '@/services/security-service';
import { BorderRadius, Spacing } from '@/constants/theme';
import { SetPinModal } from './set-pin-modal';

interface SecurityModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRequestChangePin?: () => void;
}

export function SecurityModal({
  isVisible,
  onClose,
  onRequestChangePin,
}: SecurityModalProps) {
  const theme = useTheme();
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [isSetPinModalVisible, setIsSetPinModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      loadSettings();
    }
  }, [isVisible]);

  const loadSettings = async () => {
    const current = await securityService.getSettings();
    setSettings(current);
  };

  const handleToggleLock = async (val: boolean) => {
    if (val && !settings?.hasPin) {
      // Need PIN first -> Open Set PIN modal immediately!
      setIsSetPinModalVisible(true);
      return;
    }

    await securityService.setLockEnabled(val);
    loadSettings();
  };

  const handleToggleBiometrics = async (val: boolean) => {
    if (val && !settings?.biometricHardwareAvailable) {
      Alert.alert('Not Supported', 'No biometric sensor detected on this device.');
      return;
    }
    await securityService.setBiometricsEnabled(val);
    loadSettings();
  };

  const handleToggleKeepAwake = async (val: boolean) => {
    await securityService.setKeepAwakeEnabled(val);
    loadSettings();
  };

  const handleOpenSetPin = () => {
    setIsSetPinModalVisible(true);
    if (onRequestChangePin) {
      onRequestChangePin();
    }
  };

  const handlePinSetSuccess = async () => {
    setIsSetPinModalVisible(false);
    await loadSettings();
    Alert.alert(
      'Security Updated',
      'Master PIN has been saved successfully. App Lock is now active.'
    );
  };

  if (!settings) return null;

  return (
    <>
      <Modal
        visible={isVisible && !isSetPinModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: theme.background }]}
          edges={['top', 'bottom']}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="shield-checkmark" size={24} color={theme.accent} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Security & Display</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* SECTION 1: APP LOCK */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              APP ACCESS & PRIVACY
            </Text>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {/* Toggle App Lock */}
              <View style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowLabel, { color: theme.text }]}>Enable App Lock</Text>
                  <Text style={[styles.rowDesc, { color: theme.textSecondary }]}>
                    Require fingerprint or PIN each time the app opens or resumes
                  </Text>
                </View>
                <Switch
                  value={settings.isLockEnabled}
                  onValueChange={handleToggleLock}
                  trackColor={{ false: theme.borderStrong, true: theme.accent }}
                />
              </View>

              <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

              {/* Change / Set Master PIN */}
              <Pressable
                onPress={handleOpenSetPin}
                style={({ pressed }) => [
                  styles.row,
                  { opacity: pressed ? 0.7 : 1 },
                ]}>
                <View style={styles.rowInfo}>
                  <View style={styles.pinLabelRow}>
                    <Text style={[styles.rowLabel, { color: theme.text }]}>
                      {settings.hasPin ? 'Change Master PIN' : 'Set Up Master PIN'}
                    </Text>
                    {!settings.hasPin && (
                      <View style={[styles.actionBadge, { backgroundColor: theme.accent }]}>
                        <Text style={[styles.actionBadgeText, { color: theme.accentInverted }]}>
                          Setup Needed
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.rowDesc, { color: theme.textSecondary }]}>
                    {settings.hasPin
                      ? 'Update your 4-digit security passcode'
                      : 'Create a 4-digit PIN to secure and lock your app'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
              </Pressable>

              <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

              {/* Toggle Biometrics */}
              <View style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowLabel, { color: theme.text }]}>
                    Fingerprint / Biometric Unlock
                  </Text>
                  <Text style={[styles.rowDesc, { color: theme.textSecondary }]}>
                    {settings.biometricHardwareAvailable
                      ? settings.biometricEnrolled
                        ? 'Fast unlock with your device fingerprint sensor'
                        : 'Biometric hardware available (set up fingerprints in device settings)'
                      : 'Biometric hardware not available on this device'}
                  </Text>
                </View>
                <Switch
                  value={settings.isBiometricsEnabled}
                  disabled={!settings.biometricHardwareAvailable}
                  onValueChange={handleToggleBiometrics}
                  trackColor={{ false: theme.borderStrong, true: theme.accent }}
                />
              </View>
            </View>

            {/* SECTION 2: DISPLAY & AWAKE */}
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textSecondary, marginTop: Spacing.four },
              ]}>
              SCREEN & POWER BEHAVIOR
            </Text>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowLabel, { color: theme.text }]}>
                    Always Keep Screen On
                  </Text>
                  <Text style={[styles.rowDesc, { color: theme.textSecondary }]}>
                    Never turn off screen and do not lock phone while Countdown is open in
                    foreground
                  </Text>
                </View>
                <Switch
                  value={settings.isKeepAwakeEnabled}
                  onValueChange={handleToggleKeepAwake}
                  trackColor={{ false: theme.borderStrong, true: theme.accent }}
                />
              </View>
            </View>

            {/* Privacy info banner */}
            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: theme.badgeBackground,
                  borderColor: theme.border,
                },
              ]}>
              <Ionicons name="lock-closed" size={18} color={theme.badgeText} />
              <Text style={[styles.infoBannerText, { color: theme.badgeText }]}>
                All PIN passcodes and biometric authorizations are stored strictly locally on this
                device. Your discipline and countdown data remains private.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Embedded Set/Change PIN Modal */}
      <SetPinModal
        isVisible={isSetPinModalVisible}
        onClose={() => setIsSetPinModalVisible(false)}
        onSuccess={handlePinSetSuccess}
        isChangingExistingPin={settings.hasPin}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.four,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.two,
    marginLeft: Spacing.one,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  rowInfo: {
    flex: 1,
  },
  pinLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  actionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.three,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.four,
  },
  infoBannerText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});

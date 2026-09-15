import React, { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { securityService } from '@/services/security-service';
import { BorderRadius, Spacing } from '@/constants/theme';

interface SetPinModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isChangingExistingPin?: boolean;
}

type Step = 'enter' | 'confirm';

export function SetPinModal({
  isVisible,
  onClose,
  onSuccess,
  isChangingExistingPin = false,
}: SetPinModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const [step, setStep] = useState<Step>('enter');
  const [firstPin, setFirstPin] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const shakeOffset = useSharedValue(0);

  const triggerShake = useCallback(() => {
    shakeOffset.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, [shakeOffset]);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // Reset state on open
  const handleOpen = () => {
    setStep('enter');
    setFirstPin('');
    setPin('');
    setErrorText('');
  };

  const handleKeyPress = (digit: string) => {
    setErrorText('');
    if (pin.length >= 4) return;

    const nextPin = pin + digit;
    setPin(nextPin);

    if (nextPin.length === 4) {
      if (step === 'enter') {
        // Move to confirm step
        setFirstPin(nextPin);
        setPin('');
        setStep('confirm');
      } else {
        // Confirming step
        if (nextPin === firstPin) {
          handleSavePin(nextPin);
        } else {
          triggerShake();
          setErrorText('PINs did not match. Please try again.');
          setPin('');
          setFirstPin('');
          setStep('enter');
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorText('');
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleSavePin = async (newPin: string) => {
    const success = await securityService.setMasterPin(newPin);
    if (success) {
      setPin('');
      setFirstPin('');
      setStep('enter');
      onSuccess();
    } else {
      setErrorText('Failed to save PIN. Try again.');
      setPin('');
    }
  };

  const handleCancel = () => {
    setPin('');
    setFirstPin('');
    setStep('enter');
    setErrorText('');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={handleOpen}
      onRequestClose={handleCancel}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={['top', 'bottom']}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

        {/* Top Header */}
        <View style={styles.topBar}>
          <Pressable
            onPress={handleCancel}
            hitSlop={10}
            style={({ pressed }) => [
              styles.cancelBtn,
              { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Ionicons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>

        {/* Header content */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.badgeBackground, borderColor: theme.border },
            ]}>
            <Ionicons name="key-outline" size={32} color={theme.accent} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {step === 'enter'
              ? isChangingExistingPin
                ? 'Enter New Master PIN'
                : 'Create Master PIN'
              : 'Confirm Master PIN'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {step === 'enter'
              ? 'Choose a 4-digit PIN to lock and protect Countdown'
              : 'Re-enter your 4-digit PIN to confirm'}
          </Text>
        </View>

        {/* PIN dots */}
        <Animated.View style={[styles.dotsContainer, animatedShakeStyle]}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isFilled ? theme.accent : 'transparent',
                    borderColor: isFilled ? theme.accent : theme.borderStrong,
                    transform: [{ scale: isFilled ? 1.15 : 1 }],
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Error message */}
        <View style={styles.errorBox}>
          {!!errorText && (
            <Text style={[styles.errorText, { color: '#FF453A' }]}>{errorText}</Text>
          )}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ].map((row, rIdx) => (
            <View key={rIdx} style={styles.keypadRow}>
              {row.map((num) => (
                <Pressable
                  key={num}
                  onPress={() => handleKeyPress(num)}
                  style={({ pressed }) => [
                    styles.keyButton,
                    {
                      backgroundColor: pressed
                        ? theme.backgroundSelected
                        : theme.backgroundElement,
                      borderColor: theme.borderSubtle,
                    },
                  ]}>
                  <Text style={[styles.keyNumber, { color: theme.text }]}>{num}</Text>
                </Pressable>
              ))}
            </View>
          ))}

          {/* Bottom row: empty, 0, backspace */}
          <View style={styles.keypadRow}>
            <View style={[styles.keyButton, styles.emptyButton]} />

            <Pressable
              onPress={() => handleKeyPress('0')}
              style={({ pressed }) => [
                styles.keyButton,
                {
                  backgroundColor: pressed
                    ? theme.backgroundSelected
                    : theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}>
              <Text style={[styles.keyNumber, { color: theme.text }]}>0</Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.keyButton,
                {
                  backgroundColor: pressed
                    ? theme.backgroundSelected
                    : theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}>
              <Ionicons name="backspace-outline" size={24} color={theme.text} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.two,
  },
  cancelBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    marginVertical: Spacing.two,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  errorBox: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  keyButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  keyNumber: {
    fontSize: 28,
    fontWeight: '600',
  },
});

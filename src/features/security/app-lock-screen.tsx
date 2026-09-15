import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { securityService, SecuritySettings } from "@/services/security-service";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppLockScreenProps {
  isVisible: boolean;
  onUnlocked: () => void;
}

export function AppLockScreen({ isVisible, onUnlocked }: AppLockScreenProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [pin, setPin] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [isSettingUpPin, setIsSettingUpPin] = useState<boolean>(false);
  const [firstEnteredPin, setFirstEnteredPin] = useState<string>("");

  // Shake animation for incorrect PIN
  const shakeOffset = useSharedValue(0);

  const triggerShake = useCallback(() => {
    shakeOffset.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  }, [shakeOffset]);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // Load security settings
  useEffect(() => {
    if (!isVisible) return;
    let isMounted = true;

    async function checkLock() {
      const current = await securityService.getSettings();
      if (!isMounted) return;
      setSettings(current);

      if (!current.hasPin) {
        setIsSettingUpPin(true);
      } else {
        setIsSettingUpPin(false);
        // If biometrics enabled & enrolled, trigger biometric prompt on mount
        if (current.isBiometricsEnabled && current.biometricEnrolled) {
          setTimeout(() => {
            handleBiometricUnlock();
          }, 350);
        }
      }
    }

    setPin("");
    setErrorText("");
    setFirstEnteredPin("");
    checkLock();

    return () => {
      isMounted = false;
    };
  }, [isVisible]);

  const handleBiometricUnlock = async () => {
    setErrorText("");
    const res = await securityService.authenticateBiometrics(
      "Scan fingerprint to open Countdown",
    );
    if (res.success) {
      setPin("");
      setErrorText("");
      onUnlocked();
    } else if (res.error && res.error !== "user_cancel") {
      // User tapped use PIN or failed
      setErrorText("Biometric scan unverified. Use PIN.");
    }
  };

  const handleKeyPress = (num: string) => {
    setErrorText("");
    if (pin.length >= 4) return;

    const nextPin = pin + num;
    setPin(nextPin);

    if (nextPin.length === 4) {
      // Process full 4-digit PIN
      handleCompletePin(nextPin);
    }
  };

  const handleDelete = () => {
    setErrorText("");
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleCompletePin = async (enteredPin: string) => {
    if (isSettingUpPin) {
      if (!firstEnteredPin) {
        // First entry done, ask to confirm
        setFirstEnteredPin(enteredPin);
        setPin("");
        setErrorText("Re-enter your 4-digit PIN to confirm");
      } else {
        // Confirming PIN
        if (firstEnteredPin === enteredPin) {
          await securityService.setMasterPin(enteredPin);
          setIsSettingUpPin(false);
          setFirstEnteredPin("");
          setPin("");
          onUnlocked();
        } else {
          triggerShake();
          setErrorText("PINs do not match. Start again.");
          setFirstEnteredPin("");
          setPin("");
        }
      }
    } else {
      // Verifying existing PIN
      const isValid = await securityService.verifyPin(enteredPin);
      if (isValid) {
        setPin("");
        setErrorText("");
        onUnlocked();
      } else {
        triggerShake();
        setErrorText("Incorrect PIN. Try again.");
        setPin("");
      }
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        {/* Lock Header / Icon */}
        <View style={styles.header}>
          <View
            style={[
              styles.shieldBadge,
              {
                backgroundColor: theme.badgeBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={36} color={theme.accent} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {isSettingUpPin
              ? firstEnteredPin
                ? "Confirm Security PIN"
                : "Create Master PIN"
              : "App Protected"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isSettingUpPin
              ? firstEnteredPin
                ? "Re-enter your 4 digits to secure Countdown"
                : "Choose a 4-digit PIN to secure your data"
              : "Scan fingerprint or enter PIN to continue"}
          </Text>
        </View>

        {/* PIN Dots Indicator */}
        <Animated.View style={[styles.dotsContainer, animatedShakeStyle]}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isFilled ? theme.accent : "transparent",
                    borderColor: isFilled ? theme.accent : theme.borderStrong,
                    transform: [{ scale: isFilled ? 1.15 : 1 }],
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Error / Status Text */}
        <View style={styles.errorContainer}>
          {!!errorText && (
            <Text
              style={[
                styles.errorText,
                {
                  color: errorText.includes("Re-enter")
                    ? theme.accent
                    : "#FF453A",
                },
              ]}
            >
              {errorText}
            </Text>
          )}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
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
                  ]}
                >
                  <Text style={[styles.keyNumber, { color: theme.text }]}>
                    {num}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}

          {/* Bottom row: Biometrics, 0, Backspace */}
          <View style={styles.keypadRow}>
            {settings?.isBiometricsEnabled && settings?.biometricEnrolled ? (
              <Pressable
                onPress={handleBiometricUnlock}
                style={({ pressed }) => [
                  styles.keyButton,
                  styles.actionButton,
                  {
                    backgroundColor: pressed
                      ? theme.backgroundSelected
                      : theme.backgroundElement,
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={30}
                  color={theme.accent}
                />
              </Pressable>
            ) : (
              <View style={[styles.keyButton, styles.emptyButton]} />
            )}

            <Pressable
              onPress={() => handleKeyPress("0")}
              style={({ pressed }) => [
                styles.keyButton,
                {
                  backgroundColor: pressed
                    ? theme.backgroundSelected
                    : theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.keyNumber, { color: theme.text }]}>0</Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.keyButton,
                styles.actionButton,
                {
                  backgroundColor: pressed
                    ? theme.backgroundSelected
                    : theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Ionicons name="backspace-outline" size={24} color={theme.text} />
            </Pressable>
          </View>
        </View>

        {/* Biometrics Quick Action Text if available */}
        {settings?.isBiometricsEnabled && settings?.biometricEnrolled && (
          <Pressable
            onPress={handleBiometricUnlock}
            style={({ pressed }) => [
              styles.bioPromptBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="finger-print" size={18} color={theme.accent} />
            <Text style={[styles.bioPromptText, { color: theme.accent }]}>
              Unlock with Biometrics
            </Text>
          </Pressable>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing.four,
  },
  shieldBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    marginVertical: Spacing.three,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  errorContainer: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  keypad: {
    width: "100%",
    maxWidth: 320,
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  keyButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButton: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  keyNumber: {
    fontSize: 28,
    fontWeight: "600",
  },
  bioPromptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  bioPromptText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

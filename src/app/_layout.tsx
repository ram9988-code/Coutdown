import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
  StatusBar as RNStatusBar,
  useColorScheme,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { AlertProvider } from "@/features/alerts";
import { AppLockScreen } from "@/features/security";
import { useKeepAwakeManager } from "@/hooks/use-keep-awake-manager";
import { securityService } from "@/services/security-service";
import { Colors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Configure Android status bar & navigation bar transparency
  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor("transparent");
      const isDark = colorScheme === "dark";
      const bg = isDark ? Colors.dark.background : Colors.light.background;
      void SystemUI.setBackgroundColorAsync(bg);
      try {
        NavigationBar.setStyle(isDark ? "light" : "dark");
      } catch {
        // Ignored on unsupported platforms/devices
      }
    }
  }, [colorScheme]);

  // Automatically keep screen awake and prevent phone from turning off/locking
  useKeepAwakeManager();

  // Check lock on launch
  useEffect(() => {
    let isMounted = true;
    async function initLock() {
      const settings = await securityService.getSettings();
      if (!isMounted) return;
      if (settings.isLockEnabled && settings.hasPin) {
        setIsLocked(true);
      }
    }
    initLock();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for app going to background and resuming
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App has come to the foreground
          const settings = await securityService.getSettings();
          if (settings.isLockEnabled && settings.hasPin) {
            setIsLocked(true);
          }
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        animated
      />
      <AlertProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
        <AppLockScreen
          isVisible={isLocked}
          onUnlocked={() => setIsLocked(false)}
        />
      </AlertProvider>
    </ThemeProvider>
  );
}

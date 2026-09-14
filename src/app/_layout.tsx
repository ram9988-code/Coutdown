import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { AppLockScreen } from "@/features/security";
import { useKeepAwakeManager } from "@/hooks/use-keep-awake-manager";
import { securityService } from "@/services/security-service";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

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
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />
      <AnimatedSplashOverlay />
      <AppTabs />
      <AppLockScreen
        isVisible={isLocked}
        onUnlocked={() => setIsLocked(false)}
      />
    </ThemeProvider>
  );
}

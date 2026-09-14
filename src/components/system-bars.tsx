import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export default function SystemBars() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  useEffect(() => {
    // Android navigation button/icon style
    void NavigationBar.setButtonStyle(isDark ? "light" : "dark");
  }, [isDark]);

  return <StatusBar style={isDark ? "light" : "dark"} animated />;
}

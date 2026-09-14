import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import {
  BorderRadius,
  Colors,
  Fonts,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <CustomTabButton
              label="Countdowns"
              activeIcon="hourglass"
              inactiveIcon="hourglass-outline"
            />
          </TabTrigger>

          <TabTrigger name="explore" href="/explore" asChild>
            <CustomTabButton
              label="Perspective"
              activeIcon="planet"
              inactiveIcon="planet-outline"
            />
          </TabTrigger>

          <TabTrigger name="tracker" href="/tracker" asChild>
            <CustomTabButton
              label="Tracker"
              activeIcon="flame"
              inactiveIcon="flame-outline"
            />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface CustomTabButtonProps extends TabTriggerSlotProps {
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

function CustomTabButton({
  label,
  activeIcon,
  inactiveIcon,
  isFocused,
  ...props
}: CustomTabButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const scale = useSharedValue(isFocused ? 1.02 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.02 : 1, {
      damping: 14,
      stiffness: 160,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabBtnPressable,
        pressed && styles.pressed,
      ]}>
      <Animated.View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? colors.accent : 'transparent',
            borderColor: isFocused ? colors.accent : 'transparent',
          },
          animatedStyle,
        ]}>
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={16}
          color={isFocused ? colors.accentInverted : colors.textSecondary}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabButtonText,
            {
              color: isFocused ? colors.accentInverted : colors.textSecondary,
              fontWeight: isFocused ? '700' : '500',
            },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <View
        style={[
          styles.innerContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        {/* Brand Monogram */}
        <View style={styles.brandWrapper}>
          <Text
            style={[
              styles.brandText,
              {
                color: colors.text,
                fontFamily: Fonts?.mono ?? 'monospace',
              },
            ]}>
            CHRONOS
          </Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.buttonsWrap}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: Spacing.four,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    zIndex: 100,
  },
  innerContainer: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth - 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  brandWrapper: {
    paddingLeft: Spacing.two,
    paddingRight: Spacing.two,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  buttonsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabBtnPressable: {
    borderRadius: BorderRadius.full,
  },
  pressed: {
    opacity: 0.8,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
});

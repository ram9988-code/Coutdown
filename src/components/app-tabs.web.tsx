import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet, Text } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors, Fonts, MaxContentWidth, Spacing, BorderRadius } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Countdowns</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Perspective</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? colors.accent : 'transparent',
            borderColor: isFocused ? colors.accent : colors.borderSubtle,
          },
        ]}>
        <Text
          style={[
            styles.tabButtonText,
            {
              color: isFocused ? colors.accentInverted : colors.textSecondary,
              fontWeight: isFocused ? '700' : '500',
            },
          ]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
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

        <View style={styles.buttonsWrap}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  buttonsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.8,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 12,
  },
});

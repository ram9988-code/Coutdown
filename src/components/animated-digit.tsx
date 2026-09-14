import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BorderRadius, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AnimatedDigitProps {
  value: number;
  label: string;
  padZero?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlight?: boolean;
  showLiveDot?: boolean;
}

export function AnimatedDigit({
  value,
  label,
  padZero = true,
  size = 'md',
  highlight = false,
  showLiveDot = false,
}: AnimatedDigitProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const formattedValue = padZero ? String(value).padStart(2, '0') : String(value);

  useEffect(() => {
    // Micro-kinetic tick transition: slight upward drop and settle
    translateY.value = -3;
    scale.value = 1.04;

    translateY.value = withTiming(0, { duration: 160 });
    scale.value = withSequence(
      withTiming(1.04, { duration: 90 }),
      withTiming(1, { duration: 130 })
    );
  }, [value, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  const isXl = size === 'xl';
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View style={styles.outerContainer}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: highlight ? theme.cardElevated : theme.digitBackground,
            borderColor: highlight ? theme.borderStrong : theme.digitBorder,
          },
          isXl && styles.cardXl,
          isLg && styles.cardLg,
          isSm && styles.cardSm,
          animatedStyle,
        ]}>
        {showLiveDot && (
          <View
            style={[
              styles.liveTickDot,
              { backgroundColor: theme.accent },
            ]}
          />
        )}
        <Text
          style={[
            styles.valueText,
            {
              color: theme.digitText,
              fontFamily: Fonts?.mono ?? 'monospace',
            },
            isXl && styles.valueXl,
            isLg && styles.valueLg,
            isSm && styles.valueSm,
          ]}>
          {formattedValue}
        </Text>
      </Animated.View>
      <Text
        style={[
          styles.labelText,
          { color: theme.textMuted },
          isXl && styles.labelLg,
          isLg && styles.labelLg,
          isSm && styles.labelSm,
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  card: {
    minWidth: 54,
    height: 52,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardXl: {
    minWidth: 72,
    height: 68,
    borderRadius: BorderRadius.lg,
  },
  cardLg: {
    minWidth: 64,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  cardSm: {
    minWidth: 42,
    height: 40,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.one,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  valueXl: {
    fontSize: 34,
    fontWeight: '800',
  },
  valueLg: {
    fontSize: 28,
    fontWeight: '800',
  },
  valueSm: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelLg: {
    fontSize: 11,
  },
  labelSm: {
    fontSize: 9,
  },
  liveTickDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.7,
  },
});

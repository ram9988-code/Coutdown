import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
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
  const rotateX = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const prevValueRef = useRef(value);

  const formattedValue = padZero ? String(value).padStart(2, '0') : String(value);

  useEffect(() => {
    // Only animate if value actually changed
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;

      // 3D Split-Flap Flip Motion: flips down and bounces into place
      rotateX.value = -35;
      translateY.value = -4;
      scale.value = 1.05;

      rotateX.value = withSpring(0, { damping: 14, stiffness: 220 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 220 });
      scale.value = withSequence(
        withTiming(1.05, { duration: 80 }),
        withSpring(1, { damping: 16, stiffness: 240 })
      );

      // Pulse dot expansion
      if (showLiveDot) {
        pulseScale.value = 1.8;
        pulseScale.value = withTiming(1, { duration: 350 });
      }
    }
  }, [value, scale, translateY, rotateX, pulseScale, showLiveDot]);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 400 },
        { translateY: translateY.value },
        { rotateX: `${rotateX.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
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
          animatedCardStyle,
        ]}>
        {/* Mechanical Split-Flap Center Groove */}
        <View style={styles.splitFlapSeam} />

        {/* Side Mechanical Hinge Notches */}
        <View style={[styles.hingeNotch, styles.hingeLeft, { backgroundColor: theme.card }]} />
        <View style={[styles.hingeNotch, styles.hingeRight, { backgroundColor: theme.card }]} />

        {/* Live Active Second Pulse Dot */}
        {showLiveDot && (
          <Animated.View
            style={[
              styles.liveTickDot,
              { backgroundColor: theme.accent },
              animatedDotStyle,
            ]}
          />
        )}

        {/* Display Number */}
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

      {/* Label */}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
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
  splitFlapSeam: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.18)',
    zIndex: 1,
  },
  hingeNotch: {
    position: 'absolute',
    top: '50%',
    width: 3,
    height: 6,
    marginTop: -3,
    borderRadius: 1.5,
    zIndex: 2,
  },
  hingeLeft: {
    left: 0,
  },
  hingeRight: {
    right: 0,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    zIndex: 3,
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
    top: 5,
    right: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    zIndex: 4,
  },
});

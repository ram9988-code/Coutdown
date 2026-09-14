import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { calculateTimeRemaining } from '@/services/storage';
import { CountdownItem } from '@/types/countdown';
import { AnimatedDigit } from './animated-digit';

interface CountdownCardProps {
  item: CountdownItem;
  index: number;
  nowTick?: number;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function CountdownCard({
  item,
  index,
  nowTick,
  onDelete,
  onTogglePin,
}: CountdownCardProps) {
  const theme = useTheme();
  const remaining = calculateTimeRemaining(item.targetDate, nowTick);

  const formattedDate = new Date(item.targetDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Countdown',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 60).duration(400)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: item.isPinned ? theme.borderStrong : theme.border,
        },
      ]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.badgeBackground },
              ]}>
              <Text style={[styles.categoryText, { color: theme.badgeText }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>

            {item.isPinned && (
              <View
                style={[
                  styles.pinnedBadge,
                  { backgroundColor: theme.backgroundElement },
                ]}>
                <Ionicons name="pin" size={10} color={theme.text} />
                <Text style={[styles.pinnedText, { color: theme.text }]}>
                  PINNED
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => onTogglePin(item.id)}
            hitSlop={6}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: item.isPinned
                  ? theme.backgroundSelected
                  : theme.backgroundElement,
                borderColor: theme.borderSubtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons
              name={item.isPinned ? 'pin' : 'pin-outline'}
              size={14}
              color={item.isPinned ? theme.text : theme.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={handleDeletePress}
            hitSlop={6}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.borderSubtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons name="trash-outline" size={14} color={theme.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Note if present */}
      {Boolean(item.note) && (
        <Text style={[styles.noteText, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.note}
        </Text>
      )}

      {/* Animated Digits */}
      {remaining.isPast ? (
        <View
          style={[
            styles.completedBanner,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
            },
          ]}>
          <Ionicons name="checkmark-circle-outline" size={18} color={theme.text} />
          <Text style={[styles.completedText, { color: theme.text }]}>
            TARGET TIME REACHED
          </Text>
        </View>
      ) : (
        <View style={styles.digitsContainer}>
          <AnimatedDigit
            value={remaining.days}
            label="Days"
            padZero={false}
            size="md"
            highlight={remaining.days <= 3}
          />
          <AnimatedDigit value={remaining.hours} label="Hours" size="md" />
          <AnimatedDigit value={remaining.minutes} label="Mins" size="md" />
          <AnimatedDigit value={remaining.seconds} label="Secs" size="md" showLiveDot />
        </View>
      )}

      {/* Footer Date info */}
      <View style={styles.footerRow}>
        <Text style={[styles.dateText, { color: theme.textMuted }]}>
          {formattedDate}
        </Text>
        {!remaining.isPast && (
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            Continuous Live Tick
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.one,
    paddingRight: Spacing.two,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  pinnedText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 12,
    lineHeight: 16,
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

import { BorderRadius, Fonts, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { UserProfileAge } from "@/types/countdown";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { AnimatedDigit } from "./animated-digit";

interface AgeCountdownCardProps {
  ageProfile: UserProfileAge;
  ageRemaining: {
    remaining: {
      years?: number;
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      totalSeconds: number;
      isPast: boolean;
    };
    yearsLived: number;
    percentageLived: number;
    totalLifeDays: number;
    remainingDays: number;
  };
  onEditPress: () => void;
}

export function AgeCountdownCard({
  ageProfile,
  ageRemaining,
  onEditPress,
}: AgeCountdownCardProps) {
  const theme = useTheme();
  const { remaining, yearsLived, percentageLived, remainingDays } =
    ageRemaining;

  const percentageRemaining = Math.max(
    0,
    Number((100 - percentageLived).toFixed(2)),
  );

  return (
    <Animated.View
      entering={FadeInUp.duration(600).springify()}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: theme.badgeBackground,
              },
            ]}
          >
            <View style={[styles.pulseDot, { backgroundColor: theme.text }]} />
            <Text style={[styles.categoryText, { color: theme.badgeText }]}>
              REMAINING AGE
            </Text>
          </View>
          <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
            Born {ageProfile.birthDate} · Goal{" "}
            {ageProfile.expectedLifespanYears}y
          </Text>
        </View>

        <Pressable
          onPress={onEditPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.borderSubtle,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="options-outline" size={16} color={theme.text} />
        </Pressable>
      </View>

      {/* Main Animated Digits Display */}
      <View style={styles.digitsContainer}>
        <AnimatedDigit
          value={remaining.years ?? 0}
          label="Years"
          size="lg"
          highlight
        />
        <AnimatedDigit value={remaining.days} label="Days" size="lg" />
        <AnimatedDigit value={remaining.hours} label="Hours" size="lg" />
        <AnimatedDigit value={remaining.minutes} label="Mins" size="lg" />
        <AnimatedDigit
          value={remaining.seconds}
          label="Secs"
          size="lg"
          showLiveDot
        />
      </View>

      {/* Sleek Monochromatic Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text
            style={[styles.progressStatLabel, { color: theme.textSecondary }]}
          >
            Lived:{" "}
            <Text style={{ color: theme.text, fontWeight: "700" }}>
              {yearsLived} yrs
            </Text>{" "}
            ({percentageLived}%)
          </Text>
          <Text
            style={[styles.progressStatLabel, { color: theme.textSecondary }]}
          >
            Left:{" "}
            <Text style={{ color: theme.text, fontWeight: "700" }}>
              {percentageRemaining}%
            </Text>
          </Text>
        </View>

        <View
          style={[
            styles.progressBarTrack,
            { backgroundColor: theme.progressTrack },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, Math.max(0, percentageLived))}%`,
                backgroundColor: theme.progressFill,
              },
            ]}
          />
        </View>
      </View>

      {/* Footer Info */}
      <View
        style={[
          styles.footerBanner,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <Ionicons
          name="hourglass-outline"
          size={14}
          color={theme.textSecondary}
        />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          <Text style={{ color: theme.text, fontWeight: "700" }}>
            {remainingDays.toLocaleString()} days
          </Text>{" "}
          remain. Every single second is unrepeatable.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    gap: Spacing.one,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  digitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressSection: {
    gap: Spacing.two,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStatLabel: {
    fontSize: 12,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  footerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  footerText: {
    fontSize: 12,
    flex: 1,
    fontFamily: Fonts?.sans,
  },
});

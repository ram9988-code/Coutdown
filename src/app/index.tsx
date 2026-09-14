import { AddCountdownModal } from "@/components/add-countdown-modal";
import { AgeCountdownCard } from "@/components/age-countdown-card";
import { CountdownCard } from "@/components/countdown-card";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { SuccessCountdownCard } from "@/components/success-countdown-card";
import { ThemedView } from "@/components/themed-view";
import {
  BorderRadius,
  BottomTabInset,
  Fonts,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import { useCountdowns } from "@/hooks/use-countdowns";
import { useTheme } from "@/hooks/use-theme";
import { CountdownCategory } from "@/types/countdown";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTER_CATEGORIES: CountdownCategory[] = [
  "All",
  "Milestone",
  "Project",
  "Event",
  "Habit",
  "Personal",
];

export default function HomeScreen() {
  const theme = useTheme();
  const {
    isLoaded,
    nowTick,
    ageProfile,
    successGoal,
    countdowns,
    ageRemaining,
    successRemaining,
    successProgress,
    updateAge,
    updateSuccess,
    addCountdown,
    deleteCountdown,
    togglePinCountdown,
  } = useCountdowns();

  const [activeFilter, setActiveFilter] = useState<CountdownCategory>("All");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTab, setEditTab] = useState<"age" | "success">("age");

  // Filter countdowns
  const filteredCountdowns = countdowns.filter((item) => {
    if (activeFilter === "All") return true;
    return item.category === activeFilter;
  });

  const handleOpenEdit = (tab: "age" | "success") => {
    setEditTab(tab);
    setEditModalVisible(true);
  };

  return (
    <ThemedView style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Top App Bar */}
        <View style={styles.topAppBar}>
          <View style={styles.brandingRow}>
            <View
              style={[
                styles.brandLogoCircle,
                {
                  backgroundColor: theme.accent,
                },
              ]}
            >
              <Ionicons
                name="hourglass"
                size={16}
                color={theme.accentInverted}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.brandTitle,
                  {
                    color: theme.text,
                    fontFamily: Fonts?.mono ?? "monospace",
                  },
                ]}
              >
                CHRONOS
              </Text>
              <View style={styles.liveIndicatorRow}>
                <View
                  style={[styles.liveDot, { backgroundColor: theme.text }]}
                />
                <Text style={[styles.liveText, { color: theme.textSecondary }]}>
                  RUNS CONTINUOUSLY
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.topActionsRow}>
            <Pressable
              onPress={() => handleOpenEdit("age")}
              hitSlop={8}
              style={({ pressed }) => [
                styles.topIconButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderSubtle,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="settings-outline" size={17} color={theme.text} />
            </Pressable>

            <Pressable
              onPress={() => setAddModalVisible(true)}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="add" size={18} color={theme.accentInverted} />
              <Text
                style={[styles.addButtonText, { color: theme.accentInverted }]}
              >
                New
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section 1: Remaining Age Countdown */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textSecondary }]}
              >
                PRIMARY LIFE CLOCK
              </Text>
              <Pressable onPress={() => handleOpenEdit("age")} hitSlop={6}>
                <Text style={[styles.sectionActionText, { color: theme.text }]}>
                  Edit DOB
                </Text>
              </Pressable>
            </View>

            <AgeCountdownCard
              ageProfile={ageProfile}
              ageRemaining={ageRemaining}
              onEditPress={() => handleOpenEdit("age")}
            />
          </View>

          {/* Hero Section 2: Success Countdown */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textSecondary }]}
              >
                SUCCESS MILESTONE
              </Text>
              <Pressable onPress={() => handleOpenEdit("success")} hitSlop={6}>
                <Text style={[styles.sectionActionText, { color: theme.text }]}>
                  Edit Goal
                </Text>
              </Pressable>
            </View>

            <SuccessCountdownCard
              successGoal={successGoal}
              remaining={successRemaining}
              progressPercent={successProgress}
              onEditPress={() => handleOpenEdit("success")}
            />
          </View>

          {/* Section 3: Custom Countdowns List */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.countBadgeRow}>
                <Text
                  style={[styles.sectionTitle, { color: theme.textSecondary }]}
                >
                  CUSTOM COUNTDOWNS
                </Text>
                <View
                  style={[
                    styles.countPill,
                    { backgroundColor: theme.badgeBackground },
                  ]}
                >
                  <Text
                    style={[styles.countPillText, { color: theme.badgeText }]}
                  >
                    {countdowns.length}
                  </Text>
                </View>
              </View>

              <Pressable onPress={() => setAddModalVisible(true)} hitSlop={6}>
                <Text style={[styles.sectionActionText, { color: theme.text }]}>
                  + Add Item
                </Text>
              </Pressable>
            </View>

            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContent}
            >
              {FILTER_CATEGORIES.map((cat) => {
                const isSelected = activeFilter === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setActiveFilter(cat)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected
                          ? theme.accent
                          : theme.backgroundElement,
                        borderColor: isSelected
                          ? theme.accent
                          : theme.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: isSelected
                            ? theme.accentInverted
                            : theme.textSecondary,
                          fontWeight: isSelected ? "700" : "500",
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Countdowns List */}
            {filteredCountdowns.length === 0 ? (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={36}
                  color={theme.textMuted}
                />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No Countdowns Found
                </Text>
                <Text
                  style={[styles.emptySubtitle, { color: theme.textSecondary }]}
                >
                  {activeFilter === "All"
                    ? "Create your first custom countdown to track important moments."
                    : `No items categorized under "${activeFilter}".`}
                </Text>
                <Pressable
                  onPress={() => setAddModalVisible(true)}
                  style={[
                    styles.emptyButton,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.emptyButtonText,
                      { color: theme.accentInverted },
                    ]}
                  >
                    Create Countdown
                  </Text>
                </Pressable>
              </Animated.View>
            ) : (
              <View style={styles.countdownsList}>
                {filteredCountdowns.map((item, index) => (
                  <CountdownCard
                    key={item.id}
                    item={item}
                    index={index}
                    nowTick={nowTick}
                    onDelete={deleteCountdown}
                    onTogglePin={togglePinCountdown}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Countdown Modal */}
      <AddCountdownModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={addCountdown}
      />

      {/* Edit Profile Modal (Age & Success Target) */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        ageProfile={ageProfile}
        successGoal={successGoal}
        onSaveAge={updateAge}
        onSaveSuccess={updateSuccess}
        initialTab={editTab}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  topAppBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.12)",
  },
  brandingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  brandLogoCircle: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  liveIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  liveText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  topIconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
    height: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.five,
  },
  sectionWrap: {
    gap: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  countBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  countPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  countPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  filtersScrollContent: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  countdownsList: {
    gap: Spacing.three,
  },
  emptyCard: {
    padding: Spacing.six,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 18,
  },
  emptyButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

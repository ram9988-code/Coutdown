import { BorderRadius, Fonts, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AlertButton, AlertType } from "./alert-types";

export interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  itemName?: string;
  isDelete?: boolean;
  confirmText?: string;
  cancelText?: string;
  buttons?: AlertButton[];
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onClose: () => void;
}

export function CustomAlertModal({
  visible,
  title,
  message,
  type = "info",
  icon,
  itemName,
  isDelete = false,
  confirmText,
  cancelText,
  buttons,
  onConfirm,
  onCancel,
  onClose,
}: CustomAlertModalProps) {
  const theme = useTheme();

  if (!visible) return null;

  // Icon and accent resolution
  const resolvedType = isDelete ? "danger" : type;

  let badgeBg: string = theme.backgroundElement;
  let badgeBorder: string = theme.borderSubtle;
  let iconColor: string = theme.text;
  let defaultIcon: keyof typeof Ionicons.glyphMap =
    "information-circle-outline";

  if (resolvedType === "danger" || isDelete) {
    badgeBg = "rgba(255, 59, 48, 0.12)";
    badgeBorder = "rgba(255, 59, 48, 0.28)";
    iconColor = "#FF3B30";
    defaultIcon = "trash-outline";
  } else if (resolvedType === "warning") {
    badgeBg = "rgba(255, 149, 0, 0.12)";
    badgeBorder = "rgba(255, 149, 0, 0.28)";
    iconColor = "#FF9500";
    defaultIcon = "alert-circle-outline";
  } else if (resolvedType === "success") {
    badgeBg = "rgba(52, 199, 89, 0.12)";
    badgeBorder = "rgba(52, 199, 89, 0.28)";
    iconColor = "#34C759";
    defaultIcon = "checkmark-circle-outline";
  }

  const resolvedIcon = icon ?? defaultIcon;

  const handleConfirm = async () => {
    onClose();
    if (onConfirm) {
      await onConfirm();
    }
  };

  const handleCancel = async () => {
    onClose();
    if (onCancel) {
      await onCancel();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropTouch} onPress={onClose} />

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: isDelete ? "rgba(255, 59, 48, 0.35)" : theme.border,
            },
          ]}
        >
          {/* Status Badge Icon */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: badgeBg,
                borderColor: badgeBorder,
              },
            ]}
          >
            <Ionicons name={resolvedIcon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          {/* Highlighted Item Badge (Especially for Delete Alerts) */}
          {itemName ? (
            <View
              style={[
                styles.itemChip,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name={isDelete ? "warning-outline" : "bookmark-outline"}
                size={14}
                color={isDelete ? "#FF3B30" : theme.textSecondary}
              />
              <Text
                style={[
                  styles.itemChipText,
                  {
                    color: theme.text,
                    fontFamily: Fonts?.mono ?? "monospace",
                  },
                ]}
                numberOfLines={2}
              >
                {itemName}
              </Text>
            </View>
          ) : null}

          {/* Message Content */}
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {message}
          </Text>

          {/* Caution text for delete action */}
          {isDelete ? (
            <View style={styles.cautionWrap}>
              <Text style={styles.cautionText}>
                ⚠️ This action cannot be reversed.
              </Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {buttons && buttons.length > 0 ? (
              // Custom Button List
              <View style={styles.customButtonsCol}>
                {buttons.map((btn, idx) => {
                  const isDestructive = btn.style === "destructive";
                  const isCancel = btn.style === "cancel";
                  return (
                    <Pressable
                      key={idx}
                      onPress={async () => {
                        onClose();
                        if (btn.onPress) await btn.onPress();
                      }}
                      style={({ pressed }) => [
                        styles.standardBtn,
                        {
                          backgroundColor: isDestructive
                            ? "#FF3B30"
                            : isCancel
                              ? theme.backgroundElement
                              : theme.accent,
                          borderColor: isCancel ? theme.border : "transparent",
                          borderWidth: isCancel ? 1 : 0,
                          opacity: pressed ? 0.75 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.standardBtnText,
                          {
                            color: isCancel ? theme.text : "#FFFFFF",
                          },
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : isDelete || onCancel ? (
              // Dual Button Layout (Cancel + Confirm/Delete)
              <View style={styles.dualButtonsRow}>
                <Pressable
                  onPress={handleCancel}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>
                    {cancelText ?? "Cancel"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirm}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    {
                      backgroundColor: isDelete ? "#FF3B30" : theme.accent,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  {isDelete ? (
                    <Ionicons name="trash" size={15} color="#FFFFFF" />
                  ) : null}
                  <Text
                    style={[
                      styles.confirmBtnText,
                      { color: isDelete ? "#FFFFFF" : theme.accentInverted },
                    ]}
                  >
                    {confirmText ?? (isDelete ? "Delete" : "Confirm")}
                  </Text>
                </Pressable>
              </View>
            ) : (
              // Single Confirmation Button
              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [
                  styles.singleBtn,
                  {
                    backgroundColor: theme.accent,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.singleBtnText,
                    { color: theme.accentInverted },
                  ]}
                >
                  {confirmText ?? "Understood"}
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.six,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 20,
    gap: Spacing.three,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  itemChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxWidth: "100%",
  },
  itemChipText: {
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: Spacing.two,
  },
  cautionWrap: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  cautionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF453A",
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: "100%",
    marginTop: Spacing.two,
  },
  dualButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  singleBtn: {
    width: "100%",
    height: 46,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  singleBtnText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  customButtonsCol: {
    width: "100%",
    gap: Spacing.two,
  },
  standardBtn: {
    width: "100%",
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  standardBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

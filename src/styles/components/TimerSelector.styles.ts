import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const timerSelectorStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: 15,
    backgroundColor: colors.surfaceLight,
  },
  activeButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  activeText: {
    color: colors.text.primary,
  },
});

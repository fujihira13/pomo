import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const controlsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    marginHorizontal: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  secondaryButton: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
});

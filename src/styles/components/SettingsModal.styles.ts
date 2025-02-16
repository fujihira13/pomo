import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const settingsModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: "90%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
  },
  closeButton: {
    padding: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  checkboxLabel: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: colors.surfaceLight,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
});

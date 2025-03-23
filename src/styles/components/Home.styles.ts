import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  helpButton: {
    backgroundColor: "#FFC107",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statsButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  statsButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  newTaskButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  newTaskButtonText: {
    color: colors.text.primary,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: colors.surfaceLight,
  },
});

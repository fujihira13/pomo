import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const timerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  taskName: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    gap: spacing.xs,
  },
  levelText: {
    color: colors.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  timer: {
    color: colors.text.primary,
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.md,
  },
  startButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  startButtonText: {
    color: colors.background,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  resetButtonText: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
  experienceContainer: {
    marginBottom: spacing.lg,
  },
  experienceLabel: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.sm,
  },
  experienceBarContainer: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  experienceBar: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  experienceText: {
    color: colors.text.primary,
    fontSize: typography.caption.fontSize,
    textAlign: "right",
  },
  statsButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  statsButtonText: {
    color: colors.background,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
});

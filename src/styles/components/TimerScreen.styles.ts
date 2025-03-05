import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const timerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    flex: 1,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    minHeight: 48,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginLeft: spacing.sm,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
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
  timerMode: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.sm,
  },
  timer: {
    color: colors.text.primary,
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  sessionCount: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.md,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  levelUpModal: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  levelUpTitle: {
    ...typography.h2,
    color: colors.primary,
    marginVertical: spacing.md,
  },
  levelUpMessage: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
});

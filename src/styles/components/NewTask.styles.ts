import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const newTaskStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  iconButton: {
    backgroundColor: colors.surfaceLight,
    width: "30%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.sm,
  },
  selectedIcon: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconLabel: {
    color: colors.text.primary,
    marginTop: spacing.sm,
    fontSize: typography.caption.fontSize,
  },
  jobList: {
    gap: spacing.sm,
  },
  jobCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
  },
  selectedJob: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    ...typography.h2,
  },
  jobBonus: {
    color: colors.primary,
    fontSize: typography.body.fontSize,
  },
  jobDescription: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.sm,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
  },
  tagText: {
    color: colors.primary,
    fontSize: typography.caption.fontSize,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: typography.body.fontSize,
  },
});

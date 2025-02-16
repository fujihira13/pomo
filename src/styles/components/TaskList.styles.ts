import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const taskListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  taskName: {
    ...typography.h2,
  },
  levelContainer: {
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  levelText: {
    color: colors.primary,
    marginLeft: spacing.xs,
    fontSize: typography.caption.fontSize,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: typography.caption.fontSize,
  },
  experienceContainer: {
    marginBottom: spacing.sm,
  },
  experienceLabel: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
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
  skillsContainer: {
    marginTop: spacing.sm,
  },
  skillsLabel: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  skillText: {
    color: colors.text.primary,
    fontSize: typography.caption.fontSize,
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 4,
  },
});

import { StyleSheet, Platform, StatusBar } from "react-native";
import { colors, spacing, typography } from "../theme";

export const statsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingTop: Platform.OS === "ios" ? spacing.md : 0,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginLeft: spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.h1.fontSize,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xs,
  },
  levelJobContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.md,
    width: "100%",
  },
  levelContainer: {
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.sm,
    marginRight: spacing.md,
    minWidth: 100,
  },
  jobContainer: {
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.sm,
    minWidth: 100,
  },
  levelLabel: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  levelValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
  },
  jobLabel: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  jobValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.xl,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: "bold",
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
  },
  skillsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  skillItem: {
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  skillName: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
  skillLevel: {
    color: colors.primary,
    fontSize: typography.caption.fontSize,
  },
  skillDescription: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    marginTop: spacing.md,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  progressText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "bold",
  },
  progressBarWrapper: {
    position: "relative",
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 14,
    backgroundColor: "#21263B",
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2F45",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 7,
    position: "relative",
    overflow: "hidden",
  },
  progressShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  progressPercentage: {
    color: colors.primary,
    fontSize: 12,
    textAlign: "center",
  },
  currentExpText: {
    color: colors.accent,
    fontWeight: "bold",
  },
  totalExpText: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  questsSection: {
    marginBottom: spacing.xl,
  },
  questItem: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  questHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  questTitle: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
  },
  questBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  questBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  questDescription: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.sm,
  },
  questReward: {
    color: colors.primary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.sm,
  },
});

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const statsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
  },
  periodTabs: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: spacing.xs,
    marginHorizontal: spacing.lg,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
  },
  selectedPeriodTab: {
    backgroundColor: colors.secondary,
  },
  periodTabText: {
    color: colors.text.primary,
    textAlign: "center",
    fontSize: typography.body.fontSize,
  },
  selectedPeriodTabText: {
    color: colors.background,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "column",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  statBox: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: 10,
  },
  statTitle: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.h1.fontSize,
    fontWeight: "bold",
    marginVertical: spacing.xs,
  },
  statDiff: {
    color: colors.accent,
    fontSize: typography.caption.fontSize,
  },
  chartContainer: {
    marginVertical: spacing.lg,
  },
  chartTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: 16,
  },
});

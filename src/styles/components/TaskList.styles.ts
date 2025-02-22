import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { spacing } from "../theme";

type TaskListStyles = {
  container: ViewStyle;
  taskCard: ViewStyle;
  editButton: ViewStyle;
  taskContent: ViewStyle;
  header: ViewStyle;
  iconContainer: ViewStyle;
  titleContainer: ViewStyle;
  taskName: TextStyle;
  jobLevelContainer: ViewStyle;
  jobBadge: ViewStyle;
  jobLevelText: TextStyle;
  experienceSection: ViewStyle;
  nextLevelText: TextStyle;
  experienceBar: ViewStyle;
  experienceProgress: ViewStyle;
  experienceText: TextStyle;
  skillsSection: ViewStyle;
  skillsTitle: TextStyle;
  skillsList: ViewStyle;
  skillBadge: ViewStyle;
  skillText: TextStyle;
};

export const taskListStyles = StyleSheet.create<TaskListStyles>({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  taskCard: {
    backgroundColor: "#1A202C",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#2D3748",
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
    backgroundColor: "#2D3748",
    borderRadius: 8,
  },
  taskContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#2D3748",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  jobLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  jobLevelText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: spacing.xs,
  },
  experienceSection: {
    marginBottom: spacing.md,
  },
  nextLevelText: {
    color: "#A0AEC0",
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  experienceBar: {
    height: 8,
    backgroundColor: "#2D3748",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  experienceProgress: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  experienceText: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "right",
  },
  skillsSection: {
    marginTop: spacing.md,
  },
  skillsTitle: {
    color: "#A0AEC0",
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  skillBadge: {
    backgroundColor: "#2D3748",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  skillText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "500",
  },
});

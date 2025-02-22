import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type TaskListStyles = {
  container: ViewStyle;
  taskCard: ViewStyle;
  taskContent: ViewStyle;
  taskHeader: ViewStyle;
  iconContainer: ViewStyle;
  titleContainer: ViewStyle;
  taskName: TextStyle;
  jobLevelContainer: ViewStyle;
  jobBadge: ViewStyle;
  jobLevelText: TextStyle;
  optionsButton: ViewStyle;
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
  noSkillText: TextStyle;
  modalOverlay: ViewStyle;
  optionsMenu: ViewStyle;
  optionItem: ViewStyle;
  optionText: TextStyle;
  deleteText: TextStyle;
};

export const taskListStyles = StyleSheet.create<TaskListStyles>({
  container: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#2A2F45",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  taskContent: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#171923",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  jobLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171923",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  jobLevelText: {
    color: "#8F95B2",
    fontSize: 12,
  },
  optionsButton: {
    padding: 8,
  },
  experienceSection: {
    marginTop: 12,
  },
  nextLevelText: {
    color: "#8F95B2",
    fontSize: 12,
    marginBottom: 4,
  },
  experienceBar: {
    height: 4,
    backgroundColor: "#171923",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  experienceProgress: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 2,
  },
  experienceText: {
    color: "#8F95B2",
    fontSize: 12,
    textAlign: "right",
  },
  skillsSection: {
    marginTop: 12,
  },
  skillsTitle: {
    color: "#8F95B2",
    fontSize: 12,
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#171923",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  skillText: {
    color: "#FFD700",
    fontSize: 12,
  },
  noSkillText: {
    color: "#8F95B2",
    fontSize: 12,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    backgroundColor: "#2A2F45",
    borderRadius: 12,
    padding: 8,
    width: "80%",
    maxWidth: 300,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteText: {
    color: "#FF4444",
  },
});

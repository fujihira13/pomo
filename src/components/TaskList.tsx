import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Skill {
  name: string;
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  level: number;
  experience: {
    current: number;
    max: number;
  };
  skills: Skill[];
  job?: {
    type: string;
    bonus: string;
  };
}

interface TaskListProps {
  onTaskSelect: (task: Task) => void;
}

const mockTasks: Task[] = [
  {
    id: "1",
    name: "エンジニアの勉強",
    icon: "code",
    level: 5,
    experience: {
      current: 450,
      max: 500,
    },
    skills: [{ name: "デバッグの極意" }, { name: "集中力上昇" }],
  },
  {
    id: "2",
    name: "筋トレ",
    icon: "barbell",
    level: 5,
    experience: {
      current: 280,
      max: 300,
    },
    skills: [{ name: "スタミナ増強" }, { name: "回復力上昇" }],
  },
  {
    id: "3",
    name: "読書",
    icon: "book",
    level: 5,
    experience: {
      current: 340,
      max: 400,
    },
    skills: [{ name: "記憶力強化" }, { name: "知識吸収" }],
  },
];

export const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  return (
    <ScrollView style={styles.container}>
      {mockTasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskCard}
          onPress={() => onTaskSelect(task)}
        >
          <View style={styles.taskHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={task.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color="#FFA500"
              />
            </View>
            <Text style={styles.taskName}>{task.name}</Text>
          </View>

          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <Ionicons name="flash" size={16} color="#FFD700" />
              <Text style={styles.levelText}>Lv.{task.level} 魔法使い</Text>
            </View>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>加護の魔法 Lv.2</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>記憶強化 Lv.1</Text>
              </View>
            </View>
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceLabel}>経験値</Text>
            <View style={styles.experienceBarContainer}>
              <View
                style={[
                  styles.experienceBar,
                  {
                    width: `${
                      (task.experience.current / task.experience.max) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.experienceText}>
              {task.experience.current} / {task.experience.max}
            </Text>
          </View>

          <View style={styles.skillsContainer}>
            <Text style={styles.skillsLabel}>習得スキル:</Text>
            <View style={styles.skillsList}>
              {task.skills.map((skill, index) => (
                <Text key={index} style={styles.skillText}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#1E2132",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#2A2F45",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  levelContainer: {
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2F45",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  levelText: {
    color: "#FFD700",
    marginLeft: 4,
    fontSize: 12,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    backgroundColor: "#3A3F55",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFA500",
    fontSize: 10,
  },
  experienceContainer: {
    marginBottom: 12,
  },
  experienceLabel: {
    color: "#8F95B2",
    fontSize: 12,
    marginBottom: 4,
  },
  experienceBarContainer: {
    height: 8,
    backgroundColor: "#2A2F45",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  experienceBar: {
    height: "100%",
    backgroundColor: "#FFA500",
    borderRadius: 4,
  },
  experienceText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "right",
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillsLabel: {
    color: "#8F95B2",
    fontSize: 12,
    marginBottom: 4,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillText: {
    color: "#FFFFFF",
    fontSize: 12,
    backgroundColor: "#2A2F45",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});

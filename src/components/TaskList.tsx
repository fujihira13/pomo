import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TaskListProps } from "../types/components/TaskList.types";
import type { Task } from "../types/models/Task";
import { taskListStyles } from "../styles/components/TaskList.styles";

const mockTasks: Task[] = [
  {
    id: "1",
    name: "エンジニアの勉強",
    icon: "code-outline",
    level: 5,
    experience: {
      current: 450,
      max: 500,
    },
    skills: [{ name: "デバッグの極意" }, { name: "集中力上昇" }],
    job: {
      type: "魔法使い",
      bonus: "知恵の加護",
    },
  },
  {
    id: "2",
    name: "筋トレ",
    icon: "barbell-outline",
    level: 5,
    experience: {
      current: 280,
      max: 300,
    },
    skills: [{ name: "スタミナ増強" }, { name: "回復力上昇" }],
    job: {
      type: "戦士",
      bonus: "体力の加護",
    },
  },
  {
    id: "3",
    name: "読書",
    icon: "book-outline",
    level: 5,
    experience: {
      current: 340,
      max: 400,
    },
    skills: [{ name: "記憶力強化" }, { name: "知識吸収" }],
    job: {
      type: "賢者",
      bonus: "知識の加護",
    },
  },
];

export const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  return (
    <ScrollView style={taskListStyles.container}>
      {mockTasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={taskListStyles.taskCard}
          onPress={() => onTaskSelect(task)}
        >
          <View style={taskListStyles.taskHeader}>
            <View style={taskListStyles.iconContainer}>
              <Ionicons name={task.icon} size={24} color="#FFA500" />
            </View>
            <Text style={taskListStyles.taskName}>{task.name}</Text>
          </View>

          <View style={taskListStyles.levelContainer}>
            <View style={taskListStyles.levelBadge}>
              <Ionicons name="flash" size={16} color="#FFD700" />
              <Text style={taskListStyles.levelText}>
                Lv.{task.level} {task.job.type}
              </Text>
            </View>
            <View style={taskListStyles.badges}>
              <View style={taskListStyles.badge}>
                <Text style={taskListStyles.badgeText}>{task.job.bonus}</Text>
              </View>
            </View>
          </View>

          <View style={taskListStyles.experienceContainer}>
            <Text style={taskListStyles.experienceLabel}>経験値</Text>
            <View style={taskListStyles.experienceBarContainer}>
              <View
                style={[
                  taskListStyles.experienceBar,
                  {
                    width: `${
                      (task.experience.current / task.experience.max) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={taskListStyles.experienceText}>
              {task.experience.current} / {task.experience.max}
            </Text>
          </View>

          {task.skills.length > 0 && (
            <View style={taskListStyles.skillsContainer}>
              <Text style={taskListStyles.skillsLabel}>習得スキル</Text>
              <View style={taskListStyles.skillsList}>
                {task.skills.map((skill, index) => (
                  <Text key={index} style={taskListStyles.skillText}>
                    {skill.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

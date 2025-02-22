import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TaskListProps } from "../types/components/TaskList.types";
import { taskListStyles as styles } from "../styles/components/TaskList.styles";

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskSelect,
  onEditTask,
}) => {
  return (
    <ScrollView style={styles.container}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskCard}>
          <TouchableOpacity
            style={styles.taskContent}
            onPress={() => onTaskSelect(task)}
            onLongPress={() => onEditTask(task)}
            delayLongPress={500}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name={task.icon} size={32} color="#FFD700" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.taskName}>{task.name}</Text>
                <View style={styles.jobLevelContainer}>
                  <View style={styles.jobBadge}>
                    <Ionicons name={task.job.icon} size={20} color="#FFD700" />
                    <Text style={styles.jobLevelText}>
                      Lv.{task.level} {task.job.type}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.experienceSection}>
              <Text style={styles.nextLevelText}>
                次のレベルまで: {task.experience.max - task.experience.current}
                exp
              </Text>
              <View style={styles.experienceBar}>
                <View
                  style={[
                    styles.experienceProgress,
                    {
                      width: `${
                        (task.experience.current / task.experience.max) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.experienceText}>
                経験値 {task.experience.current} / {task.experience.max}
              </Text>
            </View>

            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>習得スキル:</Text>
              <View style={styles.skillsList}>
                {task.skills.map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

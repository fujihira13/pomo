import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TaskListProps } from "../types/components/TaskList.types";
import { taskListStyles as styles } from "../styles/components/TaskList.styles";

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskSelect,
  onEditTask,
  onDeleteTask,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsPress = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowOptions(true);
  };

  const handleEdit = () => {
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        onEditTask(task);
      }
    }
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        Alert.alert(
          "タスクの削除",
          `「${task.name}」を削除してもよろしいですか？`,
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            {
              text: "削除",
              onPress: () => {
                onDeleteTask(selectedTaskId);
                setShowOptions(false);
              },
              style: "destructive",
            },
          ],
          { cancelable: true }
        );
      }
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskContent}
              onPress={() => onTaskSelect(task)}
            >
              <View style={styles.taskHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={task.icon} size={32} color="#FFD700" />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <View style={styles.jobLevelContainer}>
                    <View style={styles.jobBadge}>
                      <Ionicons
                        name={task.job.icon}
                        size={20}
                        color="#FFD700"
                      />
                      <Text style={styles.jobLevelText}>
                        Lv.{task.level} {task.job.type}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.optionsButton}
                  onPress={() => handleOptionsPress(task.id)}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#8F95B2"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.experienceSection}>
                <Text style={styles.nextLevelText}>
                  次のレベルまで:{" "}
                  {task.experience.max - task.experience.current}exp
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

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <TouchableOpacity style={styles.optionItem} onPress={handleEdit}>
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
              <Text style={styles.optionText}>編集</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={handleDelete}>
              <Ionicons name="trash" size={20} color="#FF4444" />
              <Text style={[styles.optionText, styles.deleteText]}>削除</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

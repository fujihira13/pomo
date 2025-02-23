import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskList } from "./TaskList";
import type { HomeProps } from "../types/components/Home.types";
import { homeStyles as styles } from "../styles/components/Home.styles";
import { StatsService } from "../services/StatsService";

export const Home: React.FC<HomeProps> = ({
  tasks,
  onTaskSelect,
  onEditTask,
  onDeleteTask,
  onNewTask,
  onShowStats,
}) => {
  const isTaskLimitReached = tasks.length >= 5;

  const handleDeleteTask = async (taskId: string) => {
    try {
      // 統計データからタスクのセッションを削除
      await StatsService.deleteTaskSessions(taskId);
      // タスクを削除
      onDeleteTask(taskId);
    } catch (error) {
      console.error("タスクの削除に失敗しました:", error);
    }
  };

  const handleShowStats = () => {
    onShowStats(tasks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>タスク一覧</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={handleShowStats}
          >
            <Text style={styles.statsButtonText}>統計</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.newTaskButton,
              isTaskLimitReached && styles.disabledButton,
            ]}
            onPress={onNewTask}
            disabled={isTaskLimitReached}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.newTaskButtonText}>
              {isTaskLimitReached ? "タスク上限（5件）" : "新規タスク"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TaskList
        tasks={tasks}
        onTaskSelect={onTaskSelect}
        onEditTask={onEditTask}
        onDeleteTask={handleDeleteTask}
      />
    </View>
  );
};

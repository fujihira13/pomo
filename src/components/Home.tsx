import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskList } from "./TaskList";
import type { HomeProps } from "../types/components/Home.types";
import { homeStyles as styles } from "../styles/components/Home.styles";

export const Home: React.FC<HomeProps> = ({
  tasks,
  onTaskSelect,
  onEditTask,
  onDeleteTask,
  onNewTask,
  onShowStats,
}) => {
  const isTaskLimitReached = tasks.length >= 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>タスク一覧</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.statsButton} onPress={onShowStats}>
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
        onDeleteTask={onDeleteTask}
      />
    </View>
  );
};

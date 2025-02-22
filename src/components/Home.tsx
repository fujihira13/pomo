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
  onNewTask,
  onShowStats,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>タスク一覧</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.statsButton} onPress={onShowStats}>
            <Text style={styles.statsButtonText}>統計</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newTaskButton} onPress={onNewTask}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.newTaskButtonText}>新規タスク</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TaskList
        tasks={tasks}
        onTaskSelect={onTaskSelect}
        onEditTask={onEditTask}
      />
    </View>
  );
};

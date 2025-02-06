import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskList } from "./TaskList";
import type { Task } from "./TaskList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface HomeProps {
  onTaskSelect: (task: Task) => void;
  navigation: NavigationProp;
}

export const Home: React.FC<HomeProps> = ({ onTaskSelect, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>タスクを選択</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.statsButton}>
            <Text style={styles.statsButtonText}>統計</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newTaskButton}
            onPress={() => navigation.navigate("CreateTask")}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.newTaskButtonText}>新規タスク</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TaskList onTaskSelect={onTaskSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  statsButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  statsButtonText: {
    color: "#171923",
    fontWeight: "bold",
  },
  newTaskButton: {
    backgroundColor: "#2A2F45",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  newTaskButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

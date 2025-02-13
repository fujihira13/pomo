import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Task } from "./TaskList";
import { useNavigation } from "@react-navigation/native";
import { TaskContext } from "../contexts/TaskContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

interface TimerScreenProps {
  task: Task;
  onBack: () => void;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ task, onBack }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setSelectedTask } = useContext(TaskContext);

  const handleBack = () => {
    // 画面遷移を先に行う
    navigation.navigate("Home");
    // その後で状態をクリア
    setTimeout(() => {
      setSelectedTask(null);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.taskName}>{task.name}</Text>
        <View style={styles.levelBadge}>
          <Ionicons name="trophy" size={16} color="#FFD700" />
          <Text style={styles.levelText}>レベル {task.level}</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>25:00</Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.startButton}>
            <Ionicons name="play" size={24} color="#171923" />
            <Text style={styles.startButtonText}>開始</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetButtonText}>リセット</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.experienceContainer}>
        <Text style={styles.experienceLabel}>経験値</Text>
        <View style={styles.experienceBarContainer}>
          <View style={[styles.experienceBar, { width: "0%" }]} />
        </View>
        <Text style={styles.experienceText}>0 / 100</Text>
      </View>

      <TouchableOpacity style={styles.statsButton}>
        <Text style={styles.statsButtonText}>ステータスを見る</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#8F95B2" />
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 32,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2F45",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  levelText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 24,
  },
  controls: {
    flexDirection: "row",
    gap: 16,
  },
  startButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  startButtonText: {
    color: "#171923",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#2A2F45",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  experienceContainer: {
    marginBottom: 24,
  },
  experienceLabel: {
    color: "#8F95B2",
    fontSize: 14,
    marginBottom: 8,
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
  statsButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  statsButtonText: {
    color: "#171923",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#8F95B2",
    fontSize: 16,
  },
});

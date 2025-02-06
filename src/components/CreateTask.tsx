import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
  Timer: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateTask"
>;

interface CreateTaskProps {
  navigation: NavigationProp;
}

type IconName =
  | "code-slash-outline"
  | "book-outline"
  | "barbell-outline"
  | "musical-note-outline"
  | "brush-outline"
  | "school-outline"
  | "shield-outline"
  | "flame-outline"
  | "heart-outline";

const icons = [
  {
    id: "code",
    name: "code-slash-outline" as IconName,
    label: "プログラミング",
  },
  { id: "book", name: "book-outline" as IconName, label: "読書" },
  { id: "barbell", name: "barbell-outline" as IconName, label: "運動" },
  {
    id: "musical-note",
    name: "musical-note-outline" as IconName,
    label: "音楽",
  },
  { id: "brush", name: "brush-outline" as IconName, label: "アート" },
  { id: "school", name: "school-outline" as IconName, label: "学習" },
];

const jobs = [
  {
    id: "warrior",
    title: "戦士",
    description: "基本的な戦闘能力+20%",
    stats: ["根性一番", "集中力高度"],
    icon: "shield-outline" as IconName,
  },
  {
    id: "mage",
    title: "魔法使い",
    description: "魔法経験値+40%",
    stats: ["知恵の極み", "記憶強化"],
    icon: "flame-outline" as IconName,
  },
  {
    id: "healer",
    title: "僧侶",
    description: "回復力+40%",
    stats: ["癒しの心", "精神統一"],
    icon: "heart-outline" as IconName,
  },
  {
    id: "scholar",
    title: "賢者",
    description: "スキル習得速度+25%",
    stats: ["全知全能", "習得加速"],
    icon: "book-outline" as IconName,
  },
];

export const CreateTask: React.FC<CreateTaskProps> = ({ navigation }) => {
  const [taskName, setTaskName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleCreateTask = () => {
    if (!taskName.trim()) {
      Alert.alert("エラー", "タスク名を入力してください");
      return;
    }
    if (!selectedIcon) {
      Alert.alert("エラー", "アイコンを選択してください");
      return;
    }
    if (!selectedJob) {
      Alert.alert("エラー", "職業を選択してください");
      return;
    }

    // TODO: タスクの作成処理
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タスク名</Text>
          <TextInput
            style={styles.input}
            placeholder="タスクの名前を入力"
            placeholderTextColor="#A0AEC0"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アイコン</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon.id}
                style={[
                  styles.iconButton,
                  selectedIcon === icon.id && styles.selectedIconButton,
                ]}
                onPress={() => setSelectedIcon(icon.id)}
              >
                <Ionicons
                  name={icon.name}
                  size={24}
                  color={selectedIcon === icon.id ? "#FFD700" : "#FFFFFF"}
                />
                <Text
                  style={[
                    styles.iconLabel,
                    selectedIcon === icon.id && styles.selectedIconLabel,
                  ]}
                >
                  {icon.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>職業を選択</Text>
        <View style={styles.jobList}>
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[
                styles.jobCard,
                selectedJob === job.id && styles.selectedJobCard,
              ]}
              onPress={() => setSelectedJob(job.id)}
            >
              <View style={styles.jobHeader}>
                <Ionicons name={job.icon} size={24} color="#FFD700" />
                <Text style={styles.jobTitle}>{job.title}</Text>
              </View>
              <Text style={styles.jobDescription}>{job.description}</Text>
              <View style={styles.statsContainer}>
                {job.stats.map((stat, index) => (
                  <Text key={index} style={styles.statText}>
                    {stat}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTask}
        >
          <Text style={styles.createButtonText}>タスクを作成</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#2A2F45",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconButton: {
    backgroundColor: "#2A2F45",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  selectedIconButton: {
    backgroundColor: "#1A202C",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  iconLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  selectedIconLabel: {
    color: "#FFD700",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2F45",
    marginVertical: 24,
  },
  jobList: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: "#2A2F45",
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  selectedJobCard: {
    backgroundColor: "#1A202C",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  jobDescription: {
    color: "#FFD700",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statText: {
    color: "#A0AEC0",
    fontSize: 12,
    backgroundColor: "#1A202C",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  createButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  createButtonText: {
    color: "#171923",
    fontSize: 16,
    fontWeight: "bold",
  },
});

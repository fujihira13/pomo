import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Task } from "../types/models/Task";
import type { IconName } from "../types/models/IconName";

type JobIconName =
  | "shield-outline"
  | "flash-outline"
  | "heart-outline"
  | "school-outline";

interface TaskType {
  id: string;
  icon: IconName;
  label: string;
}

interface JobType {
  id: string;
  icon: JobIconName;
  name: string;
  bonus: string;
  description: string;
  tags: string[];
}

interface NewTaskProps {
  onClose: () => void;
  onSave: (taskName: string, taskType: string, jobType: string) => void;
  editingTask?: Task | null;
}

export const NewTask: React.FC<NewTaskProps> = ({
  onClose,
  onSave,
  editingTask,
}) => {
  // 既存タスクが「賢者」だった場合は、一時的に「魔法使い」に設定
  // （次回リリースで「賢者」を実装するため）
  const initialJobType =
    editingTask?.jobType === "sage" ? "mage" : editingTask?.jobType || "";

  const [taskName, setTaskName] = useState(editingTask?.name || "");
  const [selectedType, setSelectedType] = useState(editingTask?.taskType || "");
  const [selectedJob, setSelectedJob] = useState(initialJobType);

  const taskTypes: TaskType[] = [
    { id: "programming", icon: "code-outline", label: "プログラミング" },
    { id: "reading", icon: "book-outline", label: "読書" },
    { id: "game", icon: "game-controller-outline", label: "運動" },
    { id: "music", icon: "musical-notes-outline", label: "音楽" },
    { id: "art", icon: "color-palette-outline", label: "アート" },
    { id: "study", icon: "time-outline", label: "学習" },
  ];

  const jobTypes: JobType[] = [
    {
      id: "warrior",
      icon: "shield-outline",
      name: "戦士",
      bonus: "集中力持続時間+20%",
      description: "長時間の学習に強い、集中力の高さが魅力。",
      tags: ["根性の一撃", "集中力の極"],
    },
    {
      id: "mage",
      icon: "flash-outline",
      name: "魔法使い",
      bonus: "集中経験値+30%",
      description: "知識の吸収力が高い、より多くの経験値を獲得。",
      tags: ["知恵の魔法", "記憶強化"],
    },
    {
      id: "priest",
      icon: "heart-outline",
      name: "僧侶",
      bonus: "回復力+40%",
      description: "体感効果が高い、集中学習でも疲れにくい。",
      tags: ["癒しの力", "精神統一"],
    },
    /* 賢者は次回リリースで実装予定
    {
      id: "sage",
      icon: "school-outline",
      name: "賢者",
      bonus: "スキル習得速度+25%",
      description: "新しい技術の習得が早い、複数の分野に強い。",
      tags: ["全知の眼", "習得加速"],
    },
    */
  ];

  const handleSave = () => {
    // 編集モードの場合は元の職業タイプを使用
    if (editingTask) {
      if (taskName && selectedType) {
        onSave(taskName, selectedType, selectedJob); // selectedJobはinitialJobTypeから初期化されているので保持される
        onClose();
      }
    } else {
      // 新規作成モードの場合
      if (taskName && selectedType && selectedJob) {
        onSave(taskName, selectedType, selectedJob);
        onClose();
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingTask ? "タスクを編集" : "新規タスク"}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="タスクの名前を入力"
        placeholderTextColor="#666"
        value={taskName}
        onChangeText={setTaskName}
      />

      <Text style={styles.subtitle}>アイコン</Text>
      <View style={styles.iconGrid}>
        {taskTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.iconButton,
              selectedType === type.id && styles.selectedIcon,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons name={type.icon} size={24} color="#FFFFFF" />
            <Text style={styles.iconLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 新規タスク作成時のみ職業選択を表示 */}
      {!editingTask && (
        <>
          <Text style={styles.subtitle}>職業を選択</Text>
          <View style={styles.jobGrid}>
            {jobTypes.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.jobCard,
                  selectedJob === job.id && styles.selectedJob,
                ]}
                onPress={() => setSelectedJob(job.id)}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobIconContainer}>
                    <Ionicons name={job.icon} size={24} color="#FFD700" />
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobName}>{job.name}</Text>
                    <Text style={styles.jobBonus}>{job.bonus}</Text>
                  </View>
                </View>
                <Text style={styles.jobDescription}>{job.description}</Text>
                <View style={styles.tagContainer}>
                  {job.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.comingSoonText}>
            ※ 賢者職業は次回アップデートで実装予定です
          </Text>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          editingTask
            ? !taskName || !selectedType
              ? styles.disabledButton
              : null
            : !taskName || !selectedType || !selectedJob
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleSave}
        disabled={
          editingTask
            ? !taskName || !selectedType
            : !taskName || !selectedType || !selectedJob
        }
      >
        <Text style={styles.saveButtonText}>
          {editingTask ? "更新" : "作成"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#2A2F45",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#2A2F45",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
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
    padding: 12,
  },
  selectedIcon: {
    backgroundColor: "#4A5568",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  iconLabel: {
    color: "#FFFFFF",
    marginTop: 8,
    fontSize: 12,
  },
  jobGrid: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: "#2A2F45",
    borderRadius: 8,
    padding: 16,
  },
  selectedJob: {
    backgroundColor: "#4A5568",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#171923",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  jobBonus: {
    color: "#FFD700",
    fontSize: 14,
  },
  jobDescription: {
    color: "#8F95B2",
    fontSize: 14,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#171923",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagText: {
    color: "#FFD700",
    fontSize: 12,
  },
  comingSoonText: {
    color: "#8F95B2",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#171923",
    fontWeight: "bold",
    fontSize: 16,
  },
});

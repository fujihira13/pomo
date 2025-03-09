import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { newTaskStyles } from "../styles/components/NewTask.styles";
import {
  getTaskTypes,
  getJobTypes,
  getInitialJobType,
} from "../utils/taskUtils";
import { NewTaskProps } from "../types/components/NewTask.types";

export const NewTask: React.FC<NewTaskProps> = ({
  onClose,
  onSave,
  editingTask,
}) => {
  // 初期値の設定
  const initialJobType = getInitialJobType(editingTask?.jobType);
  const [taskName, setTaskName] = useState(editingTask?.name || "");
  const [selectedType, setSelectedType] = useState(editingTask?.taskType || "");
  const [selectedJob, setSelectedJob] = useState(initialJobType);

  // タスクタイプと職業タイプの取得
  const taskTypes = getTaskTypes();
  const jobTypes = getJobTypes();

  /**
   * タスクを保存する処理
   */
  const handleSave = () => {
    // 編集モードの場合は元の職業タイプを使用
    if (editingTask) {
      if (taskName && selectedType) {
        onSave(taskName, selectedType, selectedJob);
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

  // 保存ボタンが無効かどうかを判定
  const isSaveButtonDisabled = editingTask
    ? !taskName || !selectedType // 編集モードの場合はタスク名とアイコンが必須
    : !taskName || !selectedType || !selectedJob; // 新規作成モードの場合はタスク名、アイコン、職業が必須

  return (
    <ScrollView style={newTaskStyles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={newTaskStyles.title}>
          {editingTask ? "タスクを編集" : "新規タスク"}
        </Text>
        <TouchableOpacity
          style={{ padding: 8, borderRadius: 8, backgroundColor: "#2A2F45" }}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={newTaskStyles.input}
        placeholder="タスクの名前を入力"
        placeholderTextColor="#666"
        value={taskName}
        onChangeText={setTaskName}
      />

      <Text style={newTaskStyles.subtitle}>アイコン</Text>
      <View style={newTaskStyles.iconGrid}>
        {taskTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              newTaskStyles.iconButton,
              selectedType === type.id && newTaskStyles.selectedIcon,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons name={type.icon} size={28} color="#FFFFFF" />
            <Text style={newTaskStyles.iconLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 編集モードでない場合のみ職業選択部分を表示 */}
      {!editingTask && (
        <>
          <Text style={newTaskStyles.subtitle}>職業</Text>
          <View style={newTaskStyles.jobList}>
            {jobTypes.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  newTaskStyles.jobCard,
                  selectedJob === job.id && newTaskStyles.selectedJob,
                ]}
                onPress={() => setSelectedJob(job.id)}
              >
                <View style={newTaskStyles.jobHeader}>
                  <View style={newTaskStyles.jobIconContainer}>
                    <Ionicons name={job.icon} size={24} color="#FFD700" />
                  </View>
                  <View style={newTaskStyles.jobInfo}>
                    <Text style={newTaskStyles.jobName}>{job.name}</Text>
                    {/* 次回リリースで表示予定
                    <Text style={newTaskStyles.jobBonus}>{job.bonus}</Text>
                    */}
                  </View>
                </View>
                {/* 次回リリースで表示予定
                {job.description && (
                  <Text style={newTaskStyles.jobDescription}>
                    {job.description}
                  </Text>
                )}
                {job.tags && job.tags.length > 0 && (
                  <View style={newTaskStyles.tagContainer}>
                    {job.tags.map((tag, index) => (
                      <View key={index} style={newTaskStyles.tag}>
                        <Text style={newTaskStyles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                */}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* 編集モードでは現在選択されている職業を表示 */}
      {editingTask && (
        <View style={newTaskStyles.currentJobContainer}>
          <Text style={newTaskStyles.subtitle}>現在の職業</Text>
          <Text style={newTaskStyles.currentJobText}>
            この項目は編集できません。タスクの職業は作成時のみ選択できます。
          </Text>
          <View style={newTaskStyles.currentJobCard}>
            <Text style={newTaskStyles.currentJobName}>
              {jobTypes.find((job) => job.id === selectedJob)?.name ||
                "不明な職業"}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          newTaskStyles.saveButton,
          isSaveButtonDisabled && newTaskStyles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={isSaveButtonDisabled}
      >
        <Text style={newTaskStyles.saveButtonText}>
          {editingTask ? "更新" : "作成"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

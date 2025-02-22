import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { settingsModalStyles as styles } from "../styles/components/SettingsModal.styles";
import { TimerSettings, DEFAULT_SETTINGS } from "../types/models/Settings";

interface SettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
  task: { name: string };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onClose,
  onSave,
  task,
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleNumberInput = (value: string, key: keyof TimerSettings) => {
    if (value === "") {
      setLocalSettings((prev) => ({
        ...prev,
        [key]: "",
      }));
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return;
    }

    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateSettings = (newSettings: TimerSettings): boolean => {
    if (
      newSettings.workTime === "" ||
      newSettings.shortBreakTime === "" ||
      newSettings.longBreakTime === "" ||
      newSettings.sessionsUntilLongBreak === ""
    ) {
      Alert.alert("エラー", "すべての項目を入力してください");
      return false;
    }

    const workTime = parseInt(newSettings.workTime);
    const shortBreakTime = parseInt(newSettings.shortBreakTime);
    const longBreakTime = parseInt(newSettings.longBreakTime);
    const sessionsUntilLongBreak = parseInt(newSettings.sessionsUntilLongBreak);

    if (workTime < 1 || workTime > 120) {
      Alert.alert("エラー", "集中時間は1分から120分の間で設定してください");
      return false;
    }
    if (shortBreakTime < 1 || shortBreakTime > 30) {
      Alert.alert("エラー", "小休憩時間は1分から30分の間で設定してください");
      return false;
    }
    if (longBreakTime < 1 || longBreakTime > 60) {
      Alert.alert("エラー", "長休憩時間は1分から60分の間で設定してください");
      return false;
    }
    if (sessionsUntilLongBreak < 1 || sessionsUntilLongBreak > 10) {
      Alert.alert("エラー", "セッション数は1から10の間で設定してください");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateSettings(localSettings)) {
      onSave(localSettings);
      onClose();
    }
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>設定</Text>
            <Text style={styles.subtitle}>「{task.name}」の設定</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8F95B2" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>集中時間 (分) [1-120]</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.workTime)}
              onChangeText={(value) => handleNumberInput(value, "workTime")}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>小休憩時間 (分) [1-30]</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.shortBreakTime)}
              onChangeText={(value) =>
                handleNumberInput(value, "shortBreakTime")
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>長休憩時間 (分) [1-60]</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.longBreakTime)}
              onChangeText={(value) =>
                handleNumberInput(value, "longBreakTime")
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>長休憩までのセッション数 [1-10]</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.sessionsUntilLongBreak)}
              onChangeText={(value) =>
                handleNumberInput(value, "sessionsUntilLongBreak")
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={localSettings.autoStartBreaks}
              onValueChange={(value) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  autoStartBreaks: value,
                }))
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>休憩を自動的に開始する</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={localSettings.autoStartPomodoros}
              onValueChange={(value) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  autoStartPomodoros: value,
                }))
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>作業を自動的に開始する</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>リセット</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

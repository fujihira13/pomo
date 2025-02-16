import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { settingsModalStyles as styles } from "../styles/components/SettingsModal.styles";
import { TimerSettings, DEFAULT_SETTINGS } from "../types/models/Settings";

interface SettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onClose,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8F95B2" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>集中時間 (分)</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.workTime)}
              onChangeText={(value) =>
                setLocalSettings({
                  ...localSettings,
                  workTime: parseInt(value) || DEFAULT_SETTINGS.workTime,
                })
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>小休憩時間 (分)</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.shortBreakTime)}
              onChangeText={(value) =>
                setLocalSettings({
                  ...localSettings,
                  shortBreakTime:
                    parseInt(value) || DEFAULT_SETTINGS.shortBreakTime,
                })
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>長休憩時間 (分)</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.longBreakTime)}
              onChangeText={(value) =>
                setLocalSettings({
                  ...localSettings,
                  longBreakTime:
                    parseInt(value) || DEFAULT_SETTINGS.longBreakTime,
                })
              }
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>長休憩までのセッション数</Text>
            <TextInput
              style={styles.input}
              value={String(localSettings.sessionsUntilLongBreak)}
              onChangeText={(value) =>
                setLocalSettings({
                  ...localSettings,
                  sessionsUntilLongBreak:
                    parseInt(value) || DEFAULT_SETTINGS.sessionsUntilLongBreak,
                })
              }
              keyboardType="number-pad"
              maxLength={1}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={localSettings.autoStartBreaks}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  autoStartBreaks: value,
                })
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>休憩を自動的に開始する</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={localSettings.autoStartPomodoros}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  autoStartPomodoros: value,
                })
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

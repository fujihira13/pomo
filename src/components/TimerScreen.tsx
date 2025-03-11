import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { TimerScreenProps } from "../types/components/TimerScreen.types";
import { timerScreenStyles as styles } from "../styles/components/TimerScreen.styles";
import {
  TimerSettings,
  DEFAULT_SETTINGS,
  AppSettings,
} from "../types/models/Settings";
import { SettingsModal } from "./SettingsModal";
import { loadSettings, saveSettings, updateTask } from "../utils/storage";
import { StatsService } from "../services/StatsService";
import { updateExperienceAndLevel } from "../utils/levelUtils";
import { Task } from "../types/models/Task";

export const TimerScreen: React.FC<TimerScreenProps> = ({
  task,
  onBack,
  onShowStats,
  onTaskUpdate,
}) => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    globalSettings: DEFAULT_SETTINGS,
    taskSettings: [],
  });
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timeLeft, setTimeLeft] = useState(
    Number(DEFAULT_SETTINGS.workTime) * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "work" | "shortBreak" | "longBreak"
  >("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(task);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");

  // アプリ設定の読み込み
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        if (savedSettings) {
          setAppSettings(savedSettings);
          // タスク固有の設定を取得
          const taskSettings = savedSettings.taskSettings.find(
            (settings) => settings.taskId === task.id
          );

          // タスク固有の設定が存在しない場合はデフォルト設定を使用
          const settingsToUse = taskSettings
            ? taskSettings.settings
            : DEFAULT_SETTINGS;
          setSettings(settingsToUse);

          // 現在のモードに応じて適切な時間を設定
          let newTime = Number(settingsToUse.workTime);
          if (currentMode === "shortBreak") {
            newTime = Number(settingsToUse.shortBreakTime);
          } else if (currentMode === "longBreak") {
            newTime = Number(settingsToUse.longBreakTime);
          }
          setTimeLeft(newTime * 60);
        } else {
          // 無効な設定の場合はデフォルト値を使用
          setAppSettings({
            globalSettings: DEFAULT_SETTINGS,
            taskSettings: [],
          });
          setSettings(DEFAULT_SETTINGS);
          setTimeLeft(Number(DEFAULT_SETTINGS.workTime) * 60);
        }
      } catch (error) {
        console.error("設定の読み込みに失敗しました:", error);
        // エラー時はデフォルト値を使用
        setAppSettings({
          globalSettings: DEFAULT_SETTINGS,
          taskSettings: [],
        });
        setSettings(DEFAULT_SETTINGS);
        setTimeLeft(Number(DEFAULT_SETTINGS.workTime) * 60);
      }
    };
    loadAppSettings();
  }, [task.id, currentMode]);

  // 設定が変更されたときにタイマーを更新
  useEffect(() => {
    let newTime = Number(settings.workTime);
    if (currentMode === "shortBreak") {
      newTime = Number(settings.shortBreakTime);
    } else if (currentMode === "longBreak") {
      newTime = Number(settings.longBreakTime);
    }
    setTimeLeft(newTime * 60);
  }, [settings, currentMode]);

  // タスク更新後にApp.tsxのタスクリストも更新するための関数
  const updateTaskAndNotify = async (updatedTask: Task) => {
    try {
      // タスクを更新
      const success = await updateTask(updatedTask);
      if (success) {
        console.log("タスクが正常に更新されました:", updatedTask);
        // 現在のタスク状態を更新
        setCurrentTask(updatedTask);

        // 親コンポーネントに通知（存在する場合のみ）
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
      } else {
        console.error("タスクの更新に失敗しました");
      }
    } catch (error) {
      console.error("タスク更新中にエラーが発生しました:", error);
    }
  };

  // レベルアップモーダルを表示する関数
  const showLevelUpNotification = (taskName: string, level: number) => {
    // メッセージを設定
    setLevelUpMessage(`「${taskName}」のレベルが${level}に上がりました！`);
    // モーダルを表示
    setShowLevelUpModal(true);

    // 2秒後に自動的にモーダルを閉じる
    setTimeout(() => {
      setShowLevelUpModal(false);
    }, 2000);
  };

  const handleSessionComplete = useCallback(async () => {
    // 一時的にタイマーを停止
    setIsRunning(false);

    try {
      // 音声を再生
      await playSound();

      if (currentMode === "work") {
        const newSessions = completedSessions + 1;
        console.log(
          `セッション完了: ${newSessions}回目, モード: ${currentMode}`
        );

        // 【修正】すべての職業で同一の経験値（100ポイント）を獲得するように変更
        // 職業によるボーナスを削除
        const baseExpPoints = 100;

        console.log(
          `付与する経験値: ${baseExpPoints}ポイント（職業に関わらず固定）`
        );

        // セッションデータを保存
        await StatsService.addSession({
          taskId: currentTask.id,
          taskType: currentTask.name,
          timestamp: Date.now(),
          duration: Number(settings.workTime) * 60,
          experiencePoints: baseExpPoints, // 職業に関わらず常に100
        });

        console.log(
          "セッション完了前のタスク:",
          JSON.stringify(currentTask, null, 2)
        );

        // タスクの経験値を更新してレベルアップ判定
        const { currentExp, maxExp, level, didLevelUp } =
          updateExperienceAndLevel(
            currentTask.experience.current,
            currentTask.experience.max,
            currentTask.level,
            baseExpPoints
          );

        console.log("更新後の値:", { currentExp, maxExp, level, didLevelUp });

        // タスクを更新
        const updatedTask = {
          ...currentTask,
          level,
          experience: {
            current: currentExp,
            max: maxExp,
          },
        };

        console.log("更新後のタスク:", JSON.stringify(updatedTask, null, 2));

        // タスクを更新して保存
        await updateTaskAndNotify(updatedTask);

        // レベルアップした場合
        if (didLevelUp) {
          // レベルアップ通知（1秒後に自動的に閉じる）
          showLevelUpNotification(currentTask.name, level);
        }

        // セッション数を更新
        setCompletedSessions(newSessions);

        // 次のモードを設定
        if (newSessions % Number(settings.sessionsUntilLongBreak) === 0) {
          const newTime = Number(settings.longBreakTime) * 60;
          setCurrentMode("longBreak");
          setTimeLeft(newTime);
          // 自動開始設定が有効な場合は次のセッションを開始
          if (settings.autoStartBreaks) {
            setIsRunning(true);
          }
        } else {
          const newTime = Number(settings.shortBreakTime) * 60;
          setCurrentMode("shortBreak");
          setTimeLeft(newTime);
          // 自動開始設定が有効な場合は次のセッションを開始
          if (settings.autoStartBreaks) {
            setIsRunning(true);
          }
        }
      } else {
        // 休憩が終了したら作業モードに戻る
        const newTime = Number(settings.workTime) * 60;
        setCurrentMode("work");
        setTimeLeft(newTime);
        // 自動開始設定が有効な場合は次のセッションを開始
        if (settings.autoStartPomodoros) {
          setIsRunning(true);
        }
      }
    } catch (error) {
      console.error("セッション完了処理でエラーが発生しました:", error);
    }
  }, [currentMode, completedSessions, settings, currentTask, playSound]);

  // タイマーのカウントダウン処理
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let isCompleting = false;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1 && !isCompleting) {
            isCompleting = true;
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, handleSessionComplete]);

  // 音声を再生する関数
  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
        },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("音声の再生に失敗しました:", error);
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (currentMode === "work") {
      setTimeLeft(Number(settings.workTime) * 60);
    } else if (currentMode === "shortBreak") {
      setTimeLeft(Number(settings.shortBreakTime) * 60);
    } else {
      setTimeLeft(Number(settings.longBreakTime) * 60);
    }
  };

  const handleSaveSettings = async (newSettings: TimerSettings) => {
    // タイマーを停止
    setIsRunning(false);

    // タスク固有の設定を更新
    const updatedTaskSettings = appSettings.taskSettings.filter(
      (settings) => settings.taskId !== task.id
    );
    updatedTaskSettings.push({
      taskId: task.id,
      settings: newSettings,
    });

    const newAppSettings: AppSettings = {
      ...appSettings,
      taskSettings: updatedTaskSettings,
    };

    // 設定を更新
    setAppSettings(newAppSettings);
    setSettings(newSettings);

    // 現在のモードに応じてタイマーをリセット
    let newTime = Number(newSettings.workTime);
    if (currentMode === "shortBreak") {
      newTime = Number(newSettings.shortBreakTime);
    } else if (currentMode === "longBreak") {
      newTime = Number(newSettings.longBreakTime);
    }
    setTimeLeft(newTime * 60);

    // 設定を永続化
    try {
      await saveSettings(newAppSettings);
    } catch (error) {
      console.error("設定の保存に失敗しました:", error);
      Alert.alert("エラー", "設定の保存に失敗しました");
    }
  };

  // 残り時間を分と秒に変換
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // タスクIDを使わずにStatsScreenを表示するハンドラー
  const handleShowStats = () => {
    // 最新のタスク情報でステータス画面を表示
    if (onTaskUpdate) {
      // 最新のタスク情報を親コンポーネントに再通知
      onTaskUpdate(currentTask);
    }

    // 少し遅延させてからステータス画面を表示（状態更新を確実にするため）
    setTimeout(() => {
      onShowStats();
    }, 50);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.mainContainer,
          Platform.OS === "android" && { paddingTop: StatusBar.currentHeight },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#8F95B2" />
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.settingsButtonText}>時間の設定</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskName}>{currentTask.name}</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.levelText}>レベル {currentTask.level}</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerMode}>
              {currentMode === "work"
                ? "作業中"
                : currentMode === "shortBreak"
                ? "小休憩"
                : "長休憩"}
            </Text>
            <Text style={styles.timer}>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Text>
            <Text style={styles.sessionCount}>
              完了したセッション: {completedSessions} /{" "}
              {settings.sessionsUntilLongBreak}
            </Text>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={toggleTimer}
              >
                <Ionicons
                  name={isRunning ? "pause" : "play"}
                  size={24}
                  color="#171923"
                />
                <Text style={styles.startButtonText}>
                  {isRunning ? "一時停止" : "開始"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <Text style={styles.resetButtonText}>リセット</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceLabel}>経験値</Text>
            <View style={styles.experienceBarContainer}>
              <View
                style={[
                  styles.experienceBar,
                  {
                    width: `${
                      (currentTask.experience.current /
                        currentTask.experience.max) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.experienceText}>
              {currentTask.experience.current} / {currentTask.experience.max}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.statsButton}
            onPress={handleShowStats}
          >
            <Text style={styles.statsButtonText}>ステータスを見る</Text>
          </TouchableOpacity>

          {/* デバッグ用ボタン - 本番環境では非表示
          <TouchableOpacity
            style={[styles.statsButton, { marginTop: 10 }]}
            onPress={() => {
              // 100経験値を追加
              const { currentExp, maxExp, level, didLevelUp } =
                updateExperienceAndLevel(
                  currentTask.experience.current,
                  currentTask.experience.max,
                  currentTask.level,
                  100
                );

              // タスクを更新
              const updatedTask = {
                ...currentTask,
                level,
                experience: {
                  current: currentExp,
                  max: maxExp,
                },
              };

              // 更新を通知
              updateTaskAndNotify(updatedTask);

              // レベルアップした場合
              if (didLevelUp) {
                // 新しいレベルアップ通知を使用
                showLevelUpNotification(currentTask.name, level);
              }
            }}
          >
            <Text style={styles.statsButtonText}>+100経験値（デバッグ用）</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>

      <SettingsModal
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        task={task}
      />

      {/* レベルアップモーダル */}
      <Modal
        transparent={true}
        visible={showLevelUpModal}
        animationType="fade"
        onRequestClose={() => setShowLevelUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.levelUpModal}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
            <Text style={styles.levelUpTitle}>レベルアップ！</Text>
            <Text style={styles.levelUpMessage}>{levelUpMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

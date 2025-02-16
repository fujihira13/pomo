import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { TimerScreenProps } from "../types/components/TimerScreen.types";
import { timerScreenStyles as styles } from "../styles/components/TimerScreen.styles";
import { TimerSettings, DEFAULT_SETTINGS } from "../types/models/Settings";
import { SettingsModal } from "./SettingsModal";

export const TimerScreen: React.FC<TimerScreenProps> = ({
  task,
  onBack,
  onShowStats,
}) => {
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

  // 設定が変更されたときにタイマーを更新
  useEffect(() => {
    // 現在のモードに応じて適切な時間を設定
    let newTime = Number(settings.workTime);
    if (currentMode === "shortBreak") {
      newTime = Number(settings.shortBreakTime);
    } else if (currentMode === "longBreak") {
      newTime = Number(settings.longBreakTime);
    }
    setTimeLeft(newTime * 60);
  }, [settings, currentMode]);

  // タイマーのカウントダウン処理
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
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
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    playSound();

    if (currentMode === "work") {
      const newSessions = completedSessions + 1;
      setCompletedSessions(newSessions);

      if (newSessions % Number(settings.sessionsUntilLongBreak) === 0) {
        setCurrentMode("longBreak");
        setTimeLeft(Number(settings.longBreakTime) * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      } else {
        setCurrentMode("shortBreak");
        setTimeLeft(Number(settings.shortBreakTime) * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      }
    } else {
      setCurrentMode("work");
      setTimeLeft(Number(settings.workTime) * 60);
      if (settings.autoStartPomodoros) setIsRunning(true);
    }
  };

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

  const handleSaveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    // 現在のモードに応じて適切な時間を設定
    if (currentMode === "work") {
      setTimeLeft(Number(newSettings.workTime) * 60);
    } else if (currentMode === "shortBreak") {
      setTimeLeft(Number(newSettings.shortBreakTime) * 60);
    } else {
      setTimeLeft(Number(newSettings.longBreakTime) * 60);
    }
    setIsRunning(false); // 設定変更時にタイマーを停止
  };

  // 残り時間を分と秒に変換
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#8F95B2" />
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={24} color="#8F95B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.taskName}>{task.name}</Text>
          <View style={styles.levelBadge}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.levelText}>レベル {task.level}</Text>
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
            セッション: {completedSessions} / {settings.sessionsUntilLongBreak}
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.startButton} onPress={toggleTimer}>
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
            <View style={[styles.experienceBar, { width: "0%" }]} />
          </View>
          <Text style={styles.experienceText}>0 / 100</Text>
        </View>

        <TouchableOpacity style={styles.statsButton} onPress={onShowStats}>
          <Text style={styles.statsButtonText}>ステータスを見る</Text>
        </TouchableOpacity>
      </View>

      <SettingsModal
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
      />
    </SafeAreaView>
  );
};

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { TimerScreenProps } from "../types/components/TimerScreen.types";
import { timerScreenStyles as styles } from "../styles/components/TimerScreen.styles";

export const TimerScreen: React.FC<TimerScreenProps> = ({
  task,
  onBack,
  onShowStats,
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // タイマーのカウントダウン処理
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            playSound();
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

  // 音声を再生する関数
  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
        },
        { shouldPlay: true }
      );

      // 音声再生が終わったらリソースを解放
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("音声の再生に失敗しました:", error);
    }
  }

  // タイマーの開始/一時停止
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // タイマーのリセット
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  // 残り時間を分と秒に変換
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#8F95B2" />
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.taskName}>{task.name}</Text>
          <View style={styles.levelBadge}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.levelText}>レベル {task.level}</Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timer}>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
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
    </SafeAreaView>
  );
};

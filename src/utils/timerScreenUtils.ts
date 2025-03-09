import { Audio } from "expo-av";
import { Alert } from "react-native";
import { Task } from "../types/models/Task";
import { TimerSettings, AppSettings } from "../types/models/Settings";
import { loadSettings, saveSettings, updateTask } from "./storage";
import { StatsService } from "../services/StatsService";
import { updateExperienceAndLevel } from "./levelUtils";

export type TimerMode = "work" | "shortBreak" | "longBreak";

/**
 * アプリ設定を読み込む関数
 * @returns アプリ設定
 */
export const loadAppSettings = async (): Promise<AppSettings> => {
  try {
    const settings = await loadSettings();
    if (settings === null) {
      return {
        globalSettings: {
          workTime: "25",
          shortBreakTime: "5",
          longBreakTime: "15",
          sessionsUntilLongBreak: "4",
          autoStartBreaks: false,
          autoStartPomodoros: false,
        },
        taskSettings: [],
      };
    }
    return settings;
  } catch (error) {
    console.error("設定の読み込みに失敗しました:", error);
    return {
      globalSettings: {
        workTime: "25",
        shortBreakTime: "5",
        longBreakTime: "15",
        sessionsUntilLongBreak: "4",
        autoStartBreaks: false,
        autoStartPomodoros: false,
      },
      taskSettings: [],
    };
  }
};

/**
 * タスクを更新し、レベルアップを通知する関数
 * @param task 更新するタスク
 * @param onTaskUpdate タスク更新コールバック
 * @returns 更新されたタスク
 */
export const updateTaskAndNotify = async (
  task: Task,
  onTaskUpdate: (task: Task) => void
): Promise<{
  task: Task;
  leveledUp: boolean;
  newLevel: number;
}> => {
  try {
    // 経験値を追加してレベルアップを確認
    const result = updateExperienceAndLevel(
      task.experience.current,
      task.experience.max,
      task.level,
      10
    );

    // 更新後のタスクを作成
    const updatedTask: Task = {
      ...task,
      level: result.level,
      experience: {
        current: result.currentExp,
        max: result.maxExp,
      },
    };

    // タスクデータを保存
    await updateTask(updatedTask);

    // 親コンポーネントに更新を通知
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }

    return {
      task: updatedTask,
      leveledUp: result.didLevelUp,
      newLevel: result.level,
    };
  } catch (error) {
    console.error("タスク更新中にエラーが発生しました:", error);
    return {
      task,
      leveledUp: false,
      newLevel: task.level,
    };
  }
};

/**
 * レベルアップの通知を表示する関数
 * @param taskName タスク名
 * @param level 新しいレベル
 * @returns レベルアップメッセージ
 */
export const showLevelUpNotification = (
  taskName: string,
  level: number
): string => {
  const messages = [
    `おめでとう！「${taskName}」がレベル${level}に到達しました！`,
    `レベルアップ！「${taskName}」がレベル${level}になりました！`,
    `素晴らしい進歩！「${taskName}」がレベル${level}に成長しました！`,
    `新たな高みへ！「${taskName}」がレベル${level}に達しました！`,
  ];

  // ランダムなメッセージを選択
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

/**
 * 音を再生する関数
 * @returns 音声オブジェクト
 */
export const playSound = async (): Promise<Audio.Sound | null> => {
  try {
    // 静的なURIを使用（実際のプロジェクトでは環境に応じて変更が必要）
    const soundObject = new Audio.Sound();

    // 注意: 実際のアプリでは、この部分をプロジェクトに合わせて修正する必要があります
    // ここではデモとして簡略化したURIを使用
    await soundObject.loadAsync({ uri: "https://example.com/sounds/bell.mp3" });

    await soundObject.playAsync();
    return soundObject;
  } catch (error) {
    console.error("音の再生に失敗しました:", error);
    return null;
  }
};

/**
 * セッション完了時の処理
 * @param task 現在のタスク
 * @param currentMode 現在のモード
 * @param onTaskUpdate タスク更新コールバック
 */
export const handleSessionComplete = async (
  task: Task,
  currentMode: TimerMode,
  onTaskUpdate: (task: Task) => void
): Promise<{
  leveledUp: boolean;
  newLevel: number;
  message: string;
}> => {
  if (currentMode !== "work") {
    return { leveledUp: false, newLevel: task.level, message: "" };
  }

  try {
    // セッションを記録
    await StatsService.addSession({
      taskId: task.id,
      taskType: task.taskType || "",
      timestamp: Date.now(),
      duration: 25, // 標準のポモドーロ時間
      experiencePoints: 10, // 獲得経験値
    });

    // タスクを更新
    const result = await updateTaskAndNotify(task, onTaskUpdate);

    if (result.leveledUp) {
      const message = showLevelUpNotification(task.name, result.newLevel);
      return {
        leveledUp: true,
        newLevel: result.newLevel,
        message,
      };
    }

    return {
      leveledUp: false,
      newLevel: task.level,
      message: "",
    };
  } catch (error) {
    console.error("セッション完了の処理に失敗しました:", error);
    return {
      leveledUp: false,
      newLevel: task.level,
      message: "",
    };
  }
};

/**
 * タイマー設定を保存する関数
 * @param settings 新しい設定
 * @param taskId タスクID
 * @param isGlobal グローバル設定かどうか
 */
export const saveTimerSettings = async (
  settings: TimerSettings,
  taskId?: string,
  isGlobal: boolean = true
): Promise<void> => {
  try {
    const appSettings = await loadAppSettings();

    if (isGlobal) {
      // グローバル設定を更新
      appSettings.globalSettings = settings;
    } else if (taskId) {
      // タスク固有の設定を更新
      const taskSettingIndex = appSettings.taskSettings.findIndex(
        (s) => s.taskId === taskId
      );

      if (taskSettingIndex >= 0) {
        // 既存のタスク設定を更新
        appSettings.taskSettings[taskSettingIndex].settings = settings;
      } else {
        // 新しいタスク設定を追加
        appSettings.taskSettings.push({
          taskId,
          settings,
        });
      }
    }

    // 設定を保存
    await saveSettings(appSettings);
  } catch (error) {
    console.error("設定の保存に失敗しました:", error);
    Alert.alert("エラー", "設定の保存に失敗しました");
  }
};

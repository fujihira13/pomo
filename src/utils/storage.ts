import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "../types/models/Task";
import type { AppSettings, TimerSettings } from "../types/models/Settings";
import { DEFAULT_SETTINGS } from "../types/models/Settings";

const TASKS_STORAGE_KEY = "@pomo_tasks";
const SETTINGS_STORAGE_KEY = "@pomo_settings";

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("タスクの保存に失敗しました:", error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("タスクの読み込みに失敗しました:", error);
    return [];
  }
};

// 設定の保存
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("設定の保存に失敗しました:", error);
    throw error; // エラーを上位に伝播
  }
};

// 設定の読み込み
export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (jsonValue != null) {
      const parsedSettings = JSON.parse(jsonValue);
      // 読み込んだデータが正しい構造を持っているか確認
      if (
        parsedSettings &&
        typeof parsedSettings === "object" &&
        "globalSettings" in parsedSettings &&
        "taskSettings" in parsedSettings &&
        Array.isArray(parsedSettings.taskSettings)
      ) {
        return parsedSettings as AppSettings;
      }
    }
    // 設定が存在しない場合や無効な形式の場合はデフォルト設定を返す
    return {
      globalSettings: DEFAULT_SETTINGS,
      taskSettings: [],
    };
  } catch (error) {
    console.error("設定の読み込みに失敗しました:", error);
    // エラー時はデフォルト設定を返す
    return {
      globalSettings: DEFAULT_SETTINGS,
      taskSettings: [],
    };
  }
};

// タスク固有の設定を取得
export const getTaskSettings = (
  appSettings: AppSettings,
  taskId: string
): TimerSettings => {
  if (
    !appSettings ||
    !appSettings.taskSettings ||
    !Array.isArray(appSettings.taskSettings)
  ) {
    return DEFAULT_SETTINGS;
  }

  const taskSettings = appSettings.taskSettings.find(
    (settings) => settings.taskId === taskId
  );
  return taskSettings ? taskSettings.settings : appSettings.globalSettings;
};

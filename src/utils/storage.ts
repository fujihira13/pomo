import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "../types/models/Task";
import type { AppSettings, TimerSettings } from "../types/models/Settings";
import { DEFAULT_SETTINGS } from "../types/models/Settings";

const TASKS_STORAGE_KEY = "@pomo_tasks";
const SETTINGS_STORAGE_KEY = "@pomo_settings";

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("タスクの保存に失敗しました:", error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("タスクの読み込みに失敗しました:", error);
    return [];
  }
};

// 特定のタスクを更新する
export const updateTask = async (updatedTask: Task): Promise<boolean> => {
  try {
    const tasks = await loadTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(updatedTasks);
    return true;
  } catch (error) {
    console.error("タスクの更新に失敗しました:", error);
    return false;
  }
};

// 設定の保存
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("設定の保存に失敗しました:", error);
  }
};

// 設定の読み込み
export const loadSettings = async (): Promise<AppSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("設定の読み込みに失敗しました:", error);
    return null;
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

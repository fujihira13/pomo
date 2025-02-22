import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "../types/models/Task";

const TASKS_STORAGE_KEY = "@pomo_tasks";

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

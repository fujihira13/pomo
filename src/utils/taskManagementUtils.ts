import { Alert } from "react-native";
import { Task } from "../types/models/Task";
import { StatsService } from "../services/StatsService";

/**
 * タスクの削除処理を行う関数
 * @param taskId 削除するタスクのID
 * @param onDeleteTask タスク削除コールバック
 */
export const deleteTask = async (
  taskId: string,
  onDeleteTask: (taskId: string) => void
): Promise<void> => {
  try {
    // 統計データからタスクのセッションを削除
    await StatsService.deleteTaskSessions(taskId);
    // タスクを削除
    onDeleteTask(taskId);
  } catch (error) {
    console.error("タスクの削除に失敗しました:", error);
    Alert.alert(
      "エラー",
      "タスクの削除に失敗しました。もう一度お試しください。"
    );
  }
};

/**
 * タスク削除の確認ダイアログを表示する関数
 * @param task 削除するタスク
 * @param onConfirm 確認時のコールバック
 */
export const showDeleteConfirmation = (
  task: Task,
  onConfirm: () => void
): void => {
  Alert.alert("タスクの削除", `「${task.name}」を削除してもよろしいですか？`, [
    {
      text: "キャンセル",
      style: "cancel",
    },
    {
      text: "削除",
      onPress: onConfirm,
      style: "destructive",
    },
  ]);
};

/**
 * タスクの上限に達したかどうかを確認する関数
 * @param tasks タスクの配列
 * @param limit 上限数
 * @returns 上限に達したかどうか
 */
export const isTaskLimitReached = (
  tasks: Task[],
  limit: number = 3
): boolean => {
  return tasks.length >= limit;
};

/**
 * タスクの編集を行う関数
 * @param taskId 編集するタスクのID
 * @param tasks タスクの配列
 * @param onEditTask タスク編集コールバック
 * @returns 処理が成功したかどうか
 */
export const editTask = (
  taskId: string,
  tasks: Task[],
  onEditTask: (task: Task) => void
): boolean => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    onEditTask(task);
    return true;
  }
  return false;
};

/**
 * タスクのフィルタリングとソートを行う関数
 * @param tasks タスクの配列
 * @param filterOptions フィルタオプション
 * @param sortOptions ソートオプション
 * @returns フィルタリング・ソートされたタスク配列
 */
export const filterAndSortTasks = (
  tasks: Task[],
  filterOptions?: {
    searchText?: string;
    taskType?: string;
    jobType?: string;
  },
  sortOptions?: {
    sortBy: "name" | "level" | "createdAt";
    sortOrder: "asc" | "desc";
  }
): Task[] => {
  let filteredTasks = [...tasks];

  // フィルタリング
  if (filterOptions) {
    if (filterOptions.searchText) {
      const searchText = filterOptions.searchText.toLowerCase();
      filteredTasks = filteredTasks.filter((task) =>
        task.name.toLowerCase().includes(searchText)
      );
    }

    if (filterOptions.taskType) {
      filteredTasks = filteredTasks.filter(
        (task) => task.taskType === filterOptions.taskType
      );
    }

    if (filterOptions.jobType) {
      filteredTasks = filteredTasks.filter(
        (task) => task.jobType === filterOptions.jobType
      );
    }
  }

  // ソート
  if (sortOptions) {
    filteredTasks.sort((a, b) => {
      let valueA, valueB;

      switch (sortOptions.sortBy) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "level":
          valueA = a.level;
          valueB = b.level;
          break;
        case "createdAt":
          valueA = a.id; // IDはタイムスタンプに基づいていると仮定
          valueB = b.id;
          break;
        default:
          return 0;
      }

      // 昇順・降順の適用
      const sortFactor = sortOptions.sortOrder === "asc" ? 1 : -1;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortFactor * valueA.localeCompare(valueB);
      } else {
        return sortFactor * ((valueA as number) - (valueB as number));
      }
    });
  }

  return filteredTasks;
};

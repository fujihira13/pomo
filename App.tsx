import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Home } from "./src/components/Home";
import { TimerScreen } from "./src/components/TimerScreen";
import { NewTask } from "./src/components/NewTask";
import { Stats } from "./src/components/Stats";
import { StatsScreen } from "./src/components/StatsScreen";
import type { Task } from "./src/types/models/Task";
import type { IconName } from "./src/types/models/IconName";
import { saveTasks, loadTasks } from "./src/utils/storage";
import { StatsService } from "./src/services/StatsService";
import { calculateExpForNextLevel } from "./src/utils/levelUtils";

const JOB_NAMES: Record<string, string> = {
  warrior: "戦士",
  mage: "魔法使い",
  priest: "僧侶",
  sage: "賢者",
};

const JOB_BONUSES: Record<string, string> = {
  warrior: "集中力持続時間+20%",
  mage: "集中経験値+30%",
  priest: "回復力+40%",
  sage: "スキル習得速度+25%",
};

const JOB_ICONS: Record<string, IconName> = {
  warrior: "shield-outline",
  mage: "flash-outline",
  priest: "heart-outline",
  sage: "school-outline",
};

const TASK_ICONS: Record<string, IconName> = {
  programming: "code-outline",
  reading: "book-outline",
  game: "game-controller-outline",
  music: "musical-notes-outline",
  art: "color-palette-outline",
  study: "time-outline",
};

// アイコンからタスクタイプを取得する関数
const getTaskTypeFromIcon = (icon: IconName): string => {
  const entry = Object.entries(TASK_ICONS).find(([, value]) => value === icon);
  return entry ? entry[0] : "";
};

// 日本語の職業名から英語のジョブタイプを取得する関数
const getJobTypeFromName = (japaneseName: string): string => {
  const entry = Object.entries(JOB_NAMES).find(
    ([, value]) => value === japaneseName
  );
  return entry ? entry[0] : "";
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "tasks" | "timer" | "stats" | "newTask"
  >("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTimerStats, setShowTimerStats] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // アプリ起動時にタスクを読み込む
  useEffect(() => {
    const loadSavedTasks = async () => {
      const savedTasks = await loadTasks();
      setTasks(savedTasks);
    };
    loadSavedTasks();
  }, []);

  // タスクが更新されたら保存する
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // タスクを更新する関数（レベルアップ時などに使用）
  const updateTaskData = (updatedTask: Task) => {
    console.log("App.tsxでタスクを更新します:", updatedTask);
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);

    // selectedTaskも更新（タスクIDが一致する場合）
    if (selectedTask && selectedTask.id === updatedTask.id) {
      console.log("App.tsx: selectedTaskも更新します");
      setSelectedTask(updatedTask);
    }
  };

  const handleSaveTask = (
    taskName: string,
    taskType: string,
    jobType: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      icon: TASK_ICONS[taskType],
      level: 1,
      experience: {
        current: 0,
        max: calculateExpForNextLevel(1), // レベル1の必要経験値を計算
      },
      skills: [],
      job: {
        type: JOB_NAMES[jobType],
        bonus: JOB_BONUSES[jobType],
        icon: JOB_ICONS[jobType],
      },
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (task: Task) => {
    // 編集用のタスクデータを準備
    const editTask = {
      ...task,
      taskType: getTaskTypeFromIcon(task.icon),
      jobType: getJobTypeFromName(task.job.type),
    };
    setEditingTask(editTask);
    setCurrentScreen("newTask");
  };

  const handleUpdateTask = async (
    taskName: string,
    taskType: string,
    jobType: string
  ) => {
    if (editingTask) {
      try {
        // タスク名が変更された場合は統計データも更新
        if (editingTask.name !== taskName) {
          await StatsService.updateTaskName(editingTask.id, taskName);
        }

        // タスクリストを更新
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                name: taskName,
                icon: TASK_ICONS[taskType],
                job: {
                  type: JOB_NAMES[jobType],
                  bonus: JOB_BONUSES[jobType],
                  icon: JOB_ICONS[jobType],
                },
              }
            : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
      } catch (error) {
        console.error("タスク更新中にエラーが発生しました:", error);
        // エラー通知を表示するなどの追加処理
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // ホーム画面から統計画面に移動する関数
  const handleShowGlobalStats = () => {
    setCurrentScreen("stats");
  };

  // タイマー画面からタスク固有の統計画面に移動する関数
  const handleShowTaskStats = () => {
    setShowTimerStats(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ホーム画面 */}
      {currentScreen === "tasks" && (
        <Home
          tasks={tasks}
          onTaskSelect={(task) => {
            setSelectedTask(task);
            setCurrentScreen("timer");
          }}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onNewTask={() => setCurrentScreen("newTask")}
          onShowStats={handleShowGlobalStats}
        />
      )}

      {/* タイマー画面またはタスク固有の統計画面 */}
      {currentScreen === "timer" &&
        selectedTask &&
        (showTimerStats ? (
          <StatsScreen
            onBack={() => {
              setShowTimerStats(false);
            }}
            taskId={selectedTask.id}
            task={selectedTask}
          />
        ) : (
          <TimerScreen
            task={selectedTask}
            onBack={() => setCurrentScreen("tasks")}
            onShowStats={handleShowTaskStats}
            onTaskUpdate={updateTaskData}
          />
        ))}

      {/* 全体の統計画面 */}
      {currentScreen === "stats" && (
        <Stats onBack={() => setCurrentScreen("tasks")} tasks={tasks} />
      )}

      {/* 新規タスク作成/編集画面 - モーダルからフル画面に変更 */}
      {currentScreen === "newTask" && (
        <NewTask
          onClose={() => {
            setCurrentScreen("tasks");
            setEditingTask(null);
          }}
          onSave={(taskName, taskType, jobType) => {
            if (editingTask) {
              handleUpdateTask(taskName, taskType, jobType);
            } else {
              handleSaveTask(taskName, taskType, jobType);
            }
            setCurrentScreen("tasks");
          }}
          editingTask={editingTask}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
  },
});

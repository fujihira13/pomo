import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Home } from "./src/components/Home";
import { TimerScreen } from "./src/components/TimerScreen";
import { NewTask } from "./src/components/NewTask";
import { Stats } from "./src/components/Stats";
import { StatsScreen } from "./src/components/StatsScreen";
import type { Task } from "./src/types/models/Task";
import type { IconName } from "./src/types/models/IconName";
import { saveTasks, loadTasks } from "./src/utils/storage";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showStats, setShowStats] = useState(false);
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
        max: 100,
      },
      skills: [],
      job: {
        type: JOB_NAMES[jobType],
        bonus: JOB_BONUSES[jobType],
        icon: JOB_ICONS[jobType],
      },
    };
    setTasks([...tasks, newTask]);
    setShowNewTask(false);
  };

  const handleEditTask = (task: Task) => {
    // 編集用のタスクデータを準備
    const editTask = {
      ...task,
      taskType: getTaskTypeFromIcon(task.icon),
      jobType: getJobTypeFromName(task.job.type),
    };
    setEditingTask(editTask);
    setShowNewTask(true);
  };

  const handleUpdateTask = (
    taskName: string,
    taskType: string,
    jobType: string
  ) => {
    if (editingTask) {
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
      setShowNewTask(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedTask ? (
        showTimerStats ? (
          <StatsScreen onBack={() => setShowTimerStats(false)} />
        ) : (
          <TimerScreen
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onShowStats={() => setShowTimerStats(true)}
          />
        )
      ) : showNewTask ? (
        <NewTask
          onClose={() => {
            setShowNewTask(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleSaveTask}
          editingTask={editingTask}
        />
      ) : showStats ? (
        <Stats onBack={() => setShowStats(false)} />
      ) : (
        <Home
          tasks={tasks}
          onTaskSelect={setSelectedTask}
          onEditTask={handleEditTask}
          onNewTask={() => setShowNewTask(true)}
          onShowStats={() => setShowStats(true)}
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

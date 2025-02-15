import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Home } from "./src/components/Home";
import { TimerScreen } from "./src/components/TimerScreen";
import { NewTask } from "./src/components/NewTask";
import Stats from "./src/components/Stats";
import type { Task } from "./src/components/TaskList";

const JOB_BONUSES: Record<string, string> = {
  warrior: "集中力持続時間+20%",
  mage: "集中経験値+30%",
  priest: "回復力+40%",
  sage: "スキル習得速度+25%",
};

const TASK_ICONS: Record<string, string> = {
  programming: "code-outline",
  reading: "book-outline",
  game: "game-controller-outline",
  music: "musical-notes-outline",
  art: "color-palette-outline",
  study: "time-outline",
};

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

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
        type: jobType,
        bonus: JOB_BONUSES[jobType],
      },
    };
    setTasks([...tasks, newTask]);
    setShowNewTask(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedTask ? (
        <TimerScreen task={selectedTask} onBack={() => setSelectedTask(null)} />
      ) : showNewTask ? (
        <NewTask
          onClose={() => setShowNewTask(false)}
          onSave={handleSaveTask}
        />
      ) : showStats ? (
        <Stats onBack={() => setShowStats(false)} />
      ) : (
        <Home
          onTaskSelect={setSelectedTask}
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

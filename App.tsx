import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Home } from "./src/components/Home";
import { TimerScreen } from "./src/components/TimerScreen";
import type { Task } from "./src/components/TaskList";

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {selectedTask ? (
        <TimerScreen task={selectedTask} onBack={() => setSelectedTask(null)} />
      ) : (
        <Home onTaskSelect={setSelectedTask} />
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

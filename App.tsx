import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Timer } from "./src/components/Timer";
import { Controls } from "./src/components/Controls";
import { TimerSelector, TimerType } from "./src/components/TimerSelector";

const TIMER_DURATIONS = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

const App = (): React.JSX.Element => {
  const [timerType, setTimerType] = useState<TimerType>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS[timerType]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
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

  const handleTimerTypeChange = (type: TimerType) => {
    setTimerType(type);
    setTimeLeft(TIMER_DURATIONS[type]);
    setIsRunning(false);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(TIMER_DURATIONS[timerType]);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TimerSelector
        currentType={timerType}
        onSelectTimer={handleTimerTypeChange}
      />
      <Timer minutes={minutes} seconds={seconds} />
      <Controls
        isRunning={isRunning}
        onStartPause={handleStartPause}
        onReset={handleReset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default App;

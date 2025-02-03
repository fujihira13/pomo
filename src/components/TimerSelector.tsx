import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

interface TimerSelectorProps {
  currentType: TimerType;
  onSelectTimer: (type: TimerType) => void;
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  currentType,
  onSelectTimer,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          currentType === "pomodoro" && styles.activeButton,
        ]}
        onPress={() => onSelectTimer("pomodoro")}
      >
        <Text
          style={[
            styles.buttonText,
            currentType === "pomodoro" && styles.activeText,
          ]}
        >
          Pomodoro
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          currentType === "shortBreak" && styles.activeButton,
        ]}
        onPress={() => onSelectTimer("shortBreak")}
      >
        <Text
          style={[
            styles.buttonText,
            currentType === "shortBreak" && styles.activeText,
          ]}
        >
          Short Break
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          currentType === "longBreak" && styles.activeButton,
        ]}
        onPress={() => onSelectTimer("longBreak")}
      >
        <Text
          style={[
            styles.buttonText,
            currentType === "longBreak" && styles.activeText,
          ]}
        >
          Long Break
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "white",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimerProps {
  minutes: number;
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ minutes, seconds }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
  },
});

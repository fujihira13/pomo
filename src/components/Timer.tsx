import React from "react";
import { Text, View } from "react-native";
import { timerStyles } from "../styles/components/Timer.styles";
import { TimerProps } from "../types/components/Timer.types";

export const Timer: React.FC<TimerProps> = ({ minutes, seconds }) => {
  return (
    <View style={timerStyles.container}>
      <Text style={timerStyles.time}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Text>
    </View>
  );
};

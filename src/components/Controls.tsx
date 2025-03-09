import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { controlsStyles } from "../styles/components/Controls.styles";

interface ControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStartPause,
  onReset,
}) => {
  return (
    <View style={controlsStyles.container}>
      <TouchableOpacity
        style={[controlsStyles.button, controlsStyles.primaryButton]}
        onPress={onStartPause}
      >
        <Text style={controlsStyles.buttonText}>
          {isRunning ? "Pause" : "Start"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[controlsStyles.button, controlsStyles.secondaryButton]}
        onPress={onReset}
      >
        <Text style={controlsStyles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

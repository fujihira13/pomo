import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { timerSelectorStyles } from "../styles/components/TimerSelector.styles";
import { TimerType, getTimerLabel } from "../utils/timerUtils";

interface TimerSelectorProps {
  currentType: TimerType;
  onSelectTimer: (type: TimerType) => void;
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  currentType,
  onSelectTimer,
}) => {
  // タイマーボタンをレンダリングする関数
  const renderTimerButton = (type: TimerType) => {
    const isActive = currentType === type;
    const label = getTimerLabel(type);

    return (
      <TouchableOpacity
        style={[
          timerSelectorStyles.button,
          isActive && timerSelectorStyles.activeButton,
        ]}
        onPress={() => onSelectTimer(type)}
      >
        <Text
          style={[
            timerSelectorStyles.buttonText,
            isActive && timerSelectorStyles.activeText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={timerSelectorStyles.container}>
      {renderTimerButton("pomodoro")}
      {renderTimerButton("shortBreak")}
      {renderTimerButton("longBreak")}
    </View>
  );
};

export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

export interface TimerSelectorProps {
  currentType: TimerType;
  onSelectTimer: (type: TimerType) => void;
}

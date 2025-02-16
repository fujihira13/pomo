export interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true,
};

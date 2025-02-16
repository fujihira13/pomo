export interface TimerSettings {
  workTime: number | string;
  shortBreakTime: number | string;
  longBreakTime: number | string;
  sessionsUntilLongBreak: number | string;
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

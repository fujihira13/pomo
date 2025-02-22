export interface TimerSettings {
  workTime: string;
  shortBreakTime: string;
  longBreakTime: string;
  sessionsUntilLongBreak: string;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workTime: "25",
  shortBreakTime: "5",
  longBreakTime: "15",
  sessionsUntilLongBreak: "4",
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

// タスクごとの設定を保存するための型
export interface TaskSettings {
  taskId: string;
  settings: TimerSettings;
}

// グローバル設定とタスク固有の設定を管理するための型
export interface AppSettings {
  globalSettings: TimerSettings;
  taskSettings: TaskSettings[];
}

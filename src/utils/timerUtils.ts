export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

/**
 * タイマータイプに応じたラベルを取得する
 * @param type タイマータイプ
 * @returns タイマーラベル
 */
export const getTimerLabel = (type: TimerType): string => {
  const labels: Record<TimerType, string> = {
    pomodoro: "Pomodoro",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return labels[type];
};

/**
 * タイマータイプに応じたデフォルト時間（分）を取得する
 * @param type タイマータイプ
 * @returns タイマー時間（分）
 */
export const getDefaultTimerMinutes = (type: TimerType): number => {
  const minutes: Record<TimerType, number> = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  return minutes[type];
};

import { TimerSettings } from "../types/models/Settings";

/**
 * 設定の数値入力を処理する関数
 * @param value 入力値
 * @param key 設定のキー
 * @param settings 現在の設定
 * @returns 更新された設定
 */
export const handleNumberInput = (
  value: string,
  key: keyof TimerSettings,
  settings: TimerSettings
): TimerSettings => {
  if (value === "") {
    return {
      ...settings,
      [key]: "",
    };
  }

  const numValue = parseInt(value);
  if (isNaN(numValue)) {
    return settings;
  }

  return {
    ...settings,
    [key]: value,
  };
};

/**
 * 設定のスイッチ入力を処理する関数
 * @param value スイッチの値
 * @param key 設定のキー
 * @param settings 現在の設定
 * @returns 更新された設定
 */
export const handleSwitchInput = (
  value: boolean,
  key: keyof TimerSettings,
  settings: TimerSettings
): TimerSettings => {
  return {
    ...settings,
    [key]: value,
  };
};

/**
 * 設定をデフォルト値にリセットする関数
 * @param defaultSettings デフォルト設定
 * @returns リセットされた設定
 */
export const resetSettings = (
  defaultSettings: TimerSettings
): TimerSettings => {
  return { ...defaultSettings };
};

/**
 * 設定のバリデーションを行う関数
 * @param settings 検証する設定
 * @returns 検証結果（成功かどうかとエラーメッセージ）
 */
export const validateSettings = (
  settings: TimerSettings
): { isValid: boolean; errorMessage: string } => {
  // 数値として取得
  const workTime = parseInt(settings.workTime);
  const shortBreakTime = parseInt(settings.shortBreakTime);
  const longBreakTime = parseInt(settings.longBreakTime);
  const sessionsUntilLongBreak = parseInt(settings.sessionsUntilLongBreak);

  // 各値が数値かどうかをチェック
  if (
    isNaN(workTime) ||
    isNaN(shortBreakTime) ||
    isNaN(longBreakTime) ||
    isNaN(sessionsUntilLongBreak)
  ) {
    return {
      isValid: false,
      errorMessage: "すべての時間は数値で入力してください",
    };
  }

  // 各値が正の数かどうかをチェック
  if (
    workTime <= 0 ||
    shortBreakTime <= 0 ||
    longBreakTime <= 0 ||
    sessionsUntilLongBreak <= 0
  ) {
    return {
      isValid: false,
      errorMessage: "すべての時間は0より大きい値を入力してください",
    };
  }

  // 作業時間が長すぎないかチェック
  if (workTime > 120) {
    return {
      isValid: false,
      errorMessage: "作業時間は120分以下にしてください",
    };
  }

  // 休憩時間が長すぎないかチェック
  if (shortBreakTime > 30 || longBreakTime > 60) {
    return {
      isValid: false,
      errorMessage: "休憩時間が長すぎます",
    };
  }

  // セット数が多すぎないかチェック
  if (sessionsUntilLongBreak > 10) {
    return {
      isValid: false,
      errorMessage: "セット数は10以下にしてください",
    };
  }

  return { isValid: true, errorMessage: "" };
};

/**
 * 文字列から数値を安全に取得する関数
 * @param value 文字列値
 * @param defaultValue デフォルト値
 * @returns 数値
 */
export const safeParseInt = (value: string, defaultValue: number): number => {
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
};

/**
 * 設定から作業時間（分）を取得する関数
 * @param settings 設定
 * @returns 作業時間（分）
 */
export const getWorkTimeMinutes = (settings: TimerSettings): number => {
  return safeParseInt(settings.workTime, 25);
};

/**
 * 設定から短い休憩時間（分）を取得する関数
 * @param settings 設定
 * @returns 短い休憩時間（分）
 */
export const getShortBreakMinutes = (settings: TimerSettings): number => {
  return safeParseInt(settings.shortBreakTime, 5);
};

/**
 * 設定から長い休憩時間（分）を取得する関数
 * @param settings 設定
 * @returns 長い休憩時間（分）
 */
export const getLongBreakMinutes = (settings: TimerSettings): number => {
  return safeParseInt(settings.longBreakTime, 15);
};

/**
 * 設定からポモドーロのセット数を取得する関数
 * @param settings 設定
 * @returns ポモドーロのセット数
 */
export const getPomodoroSets = (settings: TimerSettings): number => {
  return safeParseInt(settings.sessionsUntilLongBreak, 4);
};

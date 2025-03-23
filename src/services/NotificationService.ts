import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// タイマーと状態を管理するための拡張ストレージ
let timerEndTimeStorage: {
  endTime: number | null;
  mode: string;
  notificationSent: boolean;
  completedSessions: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  sessionsUntilLongBreak: number;
  shouldTransitionToNextMode: boolean;
  nextMode: string | null;
} = {
  endTime: null,
  mode: "work",
  notificationSent: false,
  completedSessions: 0,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  workTime: 25 * 60,
  shortBreakTime: 5 * 60,
  longBreakTime: 15 * 60,
  sessionsUntilLongBreak: 4,
  shouldTransitionToNextMode: false,
  nextMode: null,
};

// 通知の権限を取得する関数
export const registerForPushNotificationsAsync = async () => {
  let token;

  // デバイスが実機かどうか確認（シミュレータでは通知機能が使えない場合がある）
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // すでに権限がない場合は、リクエストする
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // まだ許可されていない場合は早期リターン
  if (finalStatus !== "granted") {
    console.log("通知の権限が許可されていません！");
    return;
  }

  // Androidの場合は通知チャンネルを設定
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "デフォルト",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

// タイマーの設定を保存
export const saveTimerSettings = (
  workTime: number,
  shortBreakTime: number,
  longBreakTime: number,
  sessionsUntilLongBreak: number,
  autoStartBreaks: boolean,
  autoStartPomodoros: boolean
) => {
  timerEndTimeStorage.workTime = workTime;
  timerEndTimeStorage.shortBreakTime = shortBreakTime;
  timerEndTimeStorage.longBreakTime = longBreakTime;
  timerEndTimeStorage.sessionsUntilLongBreak = sessionsUntilLongBreak;
  timerEndTimeStorage.autoStartBreaks = autoStartBreaks;
  timerEndTimeStorage.autoStartPomodoros = autoStartPomodoros;
  console.log("タイマー設定を保存しました");
};

// 完了したセッション数を保存
export const saveCompletedSessions = (sessions: number) => {
  timerEndTimeStorage.completedSessions = sessions;
  console.log(`完了したセッション数を保存: ${sessions}`);
};

// タイマーの終了時刻を保存
export const saveTimerEndTime = (endTime: number, mode: string) => {
  timerEndTimeStorage = {
    ...timerEndTimeStorage,
    endTime,
    mode,
    notificationSent: false,
    shouldTransitionToNextMode: false,
    nextMode: null,
  };
  console.log(
    `タイマー終了時刻を保存: ${new Date(
      endTime
    ).toLocaleTimeString()}, モード: ${mode}`
  );
};

// タイマーの終了時刻をクリア
export const clearTimerEndTime = () => {
  timerEndTimeStorage.endTime = null;
  timerEndTimeStorage.notificationSent = false;
  console.log("タイマー終了時刻をクリアしました");
};

// 全ての通知をキャンセル
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("すべての通知をキャンセルしました");
};

// セッション終了時の通知をスケジュール
export const scheduleSessionEndNotification = async (
  mode: string,
  duration: number
) => {
  // まず既存の通知をキャンセル
  await cancelAllNotifications();

  // 通知を送信せず、タイマー終了時刻の保存のみを行う
  // 実際の通知はcheckTimerEndTimeが処理し、タイマーが終了した時のみ送信される
  console.log(
    `${mode}モードのタイマーを${duration}秒後に終了するようにスケジュールします。` +
      `タイマー終了時にのみ通知が表示されます。`
  );

  // バックグラウンド通知のためのタイマー情報は既に保存済み（saveTimerEndTimeで）
  // ここでは追加の処理は不要
};

// タイマーの終了時刻をチェックし、必要に応じて通知を送信
export const checkTimerEndTime = async (): Promise<boolean> => {
  const now = Date.now();

  if (timerEndTimeStorage.endTime && !timerEndTimeStorage.notificationSent) {
    if (now >= timerEndTimeStorage.endTime) {
      console.log("タイマーが終了しました。通知を送信します。");
      await sendSessionCompleteNotification(timerEndTimeStorage.mode);
      timerEndTimeStorage.notificationSent = true;

      // 次のモードを計算
      const nextModeInfo = calculateNextMode(
        timerEndTimeStorage.mode,
        timerEndTimeStorage.completedSessions,
        timerEndTimeStorage.sessionsUntilLongBreak,
        timerEndTimeStorage.autoStartBreaks,
        timerEndTimeStorage.autoStartPomodoros
      );

      // 次のモードへの移行フラグをセット
      timerEndTimeStorage.shouldTransitionToNextMode = true;
      timerEndTimeStorage.nextMode = nextModeInfo.nextMode;

      // 作業モードでセッション完了の場合はカウントを増やす
      if (timerEndTimeStorage.mode === "work") {
        timerEndTimeStorage.completedSessions += 1;
        console.log(
          `セッションを完了し、カウントを増加: ${timerEndTimeStorage.completedSessions}`
        );
      }

      // 次のモードを自動的に開始する（バックグラウンドでも自動開始するよう修正）
      // shouldAutoStartの条件に関わらず、バックグラウンドではすべてのモード遷移で自動開始する
      const nextDuration = getModeDuration(nextModeInfo.nextMode);
      const newEndTime = Date.now() + nextDuration * 1000;

      console.log(
        `バックグラウンドで自動開始する新しいモード: ${
          nextModeInfo.nextMode
        }, 継続時間: ${nextDuration}秒, 終了時刻: ${new Date(
          newEndTime
        ).toLocaleTimeString()}`
      );

      // モードと終了時間を更新
      timerEndTimeStorage.mode = nextModeInfo.nextMode;
      timerEndTimeStorage.endTime = newEndTime;
      timerEndTimeStorage.notificationSent = false;
      // 移行フラグをtrueのままにして、アプリがフォアグラウンドに戻ったときに検出できるようにする
      timerEndTimeStorage.shouldTransitionToNextMode = true;

      // 実際に新しいタイマーが開始されたことを確認するログ
      console.log(
        `バックグラウンドで次のモードに自動移行: ${
          nextModeInfo.nextMode
        }, 終了時刻: ${new Date(newEndTime).toLocaleTimeString()}`
      );

      // 現在のモードとタイマー状態のログ出力
      console.log("バックグラウンドのタイマー状態:", {
        モード: timerEndTimeStorage.mode,
        終了時刻: new Date(timerEndTimeStorage.endTime).toLocaleTimeString(),
        通知済み: timerEndTimeStorage.notificationSent,
        完了セッション: timerEndTimeStorage.completedSessions,
      });

      // 次のモードのタイマーが開始されたことを示す値を返す
      return true;
    }
  }

  return false;
};

// 次のモード移行情報を取得
export const getNextModeTransition = () => {
  if (timerEndTimeStorage.shouldTransitionToNextMode) {
    const result = {
      shouldTransition: timerEndTimeStorage.shouldTransitionToNextMode,
      nextMode: timerEndTimeStorage.nextMode,
      completedSessions: timerEndTimeStorage.completedSessions,
    };
    // 情報を取得したらリセット
    timerEndTimeStorage.shouldTransitionToNextMode = false;
    return result;
  }
  return {
    shouldTransition: false,
    nextMode: null,
    completedSessions: timerEndTimeStorage.completedSessions,
  };
};

// セッション完了時の通知を送信
export const sendSessionCompleteNotification = async (mode: string) => {
  let title = "";
  let body = "";

  if (mode === "work") {
    title = "作業セッション完了！";
    body = "休憩の時間です。次に何をしますか？";
  } else if (mode === "shortBreak") {
    title = "短い休憩が終了しました";
    body = "次の作業セッションを始めましょう。";
  } else if (mode === "longBreak") {
    title = "長い休憩が終了しました";
    body = "次の作業セッションを始めましょう。";
  }

  await sendNotification(title, body);
};

// 通知を送信する関数
export const sendNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // 即時通知
  });
  console.log(`通知を送信しました: ${title}`);
};

// モードの継続時間を取得する関数
export const getModeDuration = (mode: string): number => {
  switch (mode) {
    case "work":
      return timerEndTimeStorage.workTime;
    case "shortBreak":
      return timerEndTimeStorage.shortBreakTime;
    case "longBreak":
      return timerEndTimeStorage.longBreakTime;
    default:
      return timerEndTimeStorage.workTime;
  }
};

// 次のモードを計算する関数
export const calculateNextMode = (
  currentMode: string,
  completedSessions: number,
  sessionsUntilLongBreak: number,
  autoStartBreaks: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoStartPomodoros: boolean
): { nextMode: string; shouldAutoStart: boolean } => {
  let nextMode = "work";
  let shouldAutoStart = false;

  if (currentMode === "work") {
    // 作業モードの後は休憩
    const isLongBreakDue =
      completedSessions > 0 && completedSessions % sessionsUntilLongBreak === 0;

    nextMode = isLongBreakDue ? "longBreak" : "shortBreak";
    shouldAutoStart = autoStartBreaks;
  } else {
    // 休憩モードの後は作業
    nextMode = "work";
    // 休憩後の作業モードは常に自動開始する（設定に関わらず）
    shouldAutoStart = true;
  }

  console.log(
    `次のモード計算: 現在=${currentMode}, 次=${nextMode}, 自動開始=${shouldAutoStart}`
  );
  return { nextMode, shouldAutoStart };
};

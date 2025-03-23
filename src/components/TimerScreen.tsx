import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Modal,
  AppState,
  AppStateStatus,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { TimerScreenProps } from "../types/components/TimerScreen.types";
import { timerScreenStyles as styles } from "../styles/components/TimerScreen.styles";
import {
  TimerSettings,
  DEFAULT_SETTINGS,
  AppSettings,
} from "../types/models/Settings";
import { SettingsModal } from "./SettingsModal";
import { loadSettings, saveSettings, updateTask } from "../utils/storage";
import { StatsService } from "../services/StatsService";
import { updateExperienceAndLevel } from "../utils/levelUtils";
import { Task } from "../types/models/Task";
import {
  registerForPushNotificationsAsync,
  scheduleSessionEndNotification,
  sendSessionCompleteNotification,
  cancelAllNotifications,
  saveTimerEndTime,
  checkTimerEndTime,
  clearTimerEndTime,
  saveTimerSettings,
  saveCompletedSessions,
  getNextModeTransition,
} from "../services/NotificationService";

const BACKGROUND_TIMER_TASK = "background-timer-task";

// アプリの状態が変わったときに通知を受け取るための設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// バックグラウンドタスクの登録（アプリが閉じられていても実行される）
TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
  try {
    // バックグラウンドでの処理 - タイマー終了時刻をチェック
    console.log("バックグラウンドタスクが実行されました");
    const isCompleted = await checkTimerEndTime();

    if (isCompleted === true) {
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("バックグラウンドタスクでエラーが発生しました:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// バックグラウンドタスクを登録する関数
async function registerBackgroundTask() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
      minimumInterval: 15, // 最小間隔（秒）- 60秒から15秒に短縮
      stopOnTerminate: false, // アプリが終了しても実行を継続
      startOnBoot: true, // デバイス起動時に開始
    });
    console.log("バックグラウンドタスクが登録されました");
  } catch (err) {
    console.log("バックグラウンドタスクの登録に失敗しました:", err);
  }
}

export const TimerScreen: React.FC<TimerScreenProps> = ({
  task,
  onBack,
  onShowStats,
  onTaskUpdate,
}) => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    globalSettings: DEFAULT_SETTINGS,
    taskSettings: [],
  });
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timeLeft, setTimeLeft] = useState(
    Number(DEFAULT_SETTINGS.workTime) * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "work" | "shortBreak" | "longBreak"
  >("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(task);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");

  // タイマーの終了時刻を記録するための状態
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);

  // AppStateの変更を監視するためのref
  const appStateRef = useRef(AppState.currentState);

  // 音声を再生する関数
  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
        },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("音声の再生に失敗しました:", error);
    }
  }

  // タスク更新後にApp.tsxのタスクリストも更新するための関数
  const updateTaskAndNotify = async (updatedTask: Task) => {
    try {
      // タスクを更新
      const success = await updateTask(updatedTask);
      if (success) {
        console.log("タスクが正常に更新されました:", updatedTask);
        // 現在のタスク状態を更新
        setCurrentTask(updatedTask);

        // 親コンポーネントに通知（存在する場合のみ）
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
      } else {
        console.error("タスクの更新に失敗しました");
      }
    } catch (error) {
      console.error("タスク更新中にエラーが発生しました:", error);
    }
  };

  // レベルアップモーダルを表示する関数
  const showLevelUpNotification = (taskName: string, level: number) => {
    // メッセージを設定
    setLevelUpMessage(`「${taskName}」のレベルが${level}に上がりました！`);
    // モーダルを表示
    setShowLevelUpModal(true);

    // 2秒後に自動的にモーダルを閉じる
    setTimeout(() => {
      setShowLevelUpModal(false);
    }, 2000);
  };

  // セッション完了時の処理
  const handleSessionComplete = useCallback(async () => {
    // 一時的にタイマーを停止
    setIsRunning(false);
    // タイマー終了時刻をクリア
    setTimerEndTime(null);
    clearTimerEndTime();

    try {
      // 音声を再生
      await playSound();

      // バックグラウンドでの通知
      await sendSessionCompleteNotification(currentMode);

      if (currentMode === "work") {
        const newSessions = completedSessions + 1;
        console.log(
          `セッション完了: ${newSessions}回目, モード: ${currentMode}`
        );

        // 【修正】すべての職業で同一の経験値（100ポイント）を獲得するように変更
        // 職業によるボーナスを削除
        const baseExpPoints = 100;

        console.log(
          `付与する経験値: ${baseExpPoints}ポイント（職業に関わらず固定）`
        );

        // セッションデータを保存
        await StatsService.addSession({
          taskId: currentTask.id,
          taskType: currentTask.name,
          timestamp: Date.now(),
          duration: Number(settings.workTime) * 60,
          experiencePoints: baseExpPoints, // 職業に関わらず常に100
        });

        console.log(
          "セッション完了前のタスク:",
          JSON.stringify(currentTask, null, 2)
        );

        // タスクの経験値を更新してレベルアップ判定
        const { currentExp, maxExp, level, didLevelUp } =
          updateExperienceAndLevel(
            currentTask.experience.current,
            currentTask.experience.max,
            currentTask.level,
            baseExpPoints
          );

        console.log("更新後の値:", { currentExp, maxExp, level, didLevelUp });

        // タスクを更新
        const updatedTask = {
          ...currentTask,
          level,
          experience: {
            current: currentExp,
            max: maxExp,
          },
        };

        console.log("更新後のタスク:", JSON.stringify(updatedTask, null, 2));

        // タスクを更新して保存
        await updateTaskAndNotify(updatedTask);

        // レベルアップした場合
        if (didLevelUp) {
          // レベルアップ通知（1秒後に自動的に閉じる）
          showLevelUpNotification(currentTask.name, level);
        }

        // セッション数を更新
        setCompletedSessions(newSessions);

        // 完了したセッション数を保存
        saveCompletedSessions(newSessions);

        // 次のモードを設定
        if (newSessions % Number(settings.sessionsUntilLongBreak) === 0) {
          const newTime = Number(settings.longBreakTime) * 60;
          setCurrentMode("longBreak");
          setTimeLeft(newTime);
          // 作業セッション完了後は、設定に関わらず必ず次の休憩を自動開始する
          console.log(`長い休憩モードに切り替え、自動的にタイマーを開始します`);
          setIsRunning(true);
          // 終了時刻を設定
          const endTime = Date.now() + newTime * 1000;
          setTimerEndTime(endTime);
          saveTimerEndTime(endTime, "longBreak");

          // 通知もスケジュールする
          await scheduleSessionEndNotification("longBreak", newTime);
        } else {
          const newTime = Number(settings.shortBreakTime) * 60;
          setCurrentMode("shortBreak");
          setTimeLeft(newTime);
          // 作業セッション完了後は、設定に関わらず必ず次の休憩を自動開始する
          console.log(`短い休憩モードに切り替え、自動的にタイマーを開始します`);
          setIsRunning(true);
          // 終了時刻を設定
          const endTime = Date.now() + newTime * 1000;
          setTimerEndTime(endTime);
          saveTimerEndTime(endTime, "shortBreak");

          // 通知もスケジュールする
          await scheduleSessionEndNotification("shortBreak", newTime);
        }
      } else {
        // 休憩が終了したら作業モードに戻る
        const newTime = Number(settings.workTime) * 60;
        console.log(
          `休憩モード「${currentMode}」が終了したため、作業モードに切り替えます`
        );
        setCurrentMode("work");
        setTimeLeft(newTime);

        // 自動開始設定が有効な場合は次のセッションを開始
        // ここは必ず自動的に開始する
        setIsRunning(true);
        // 終了時刻を設定
        const endTime = Date.now() + newTime * 1000;
        setTimerEndTime(endTime);
        saveTimerEndTime(endTime, "work");
        console.log(
          `作業モードを自動開始しました。終了時刻: ${new Date(
            endTime
          ).toLocaleTimeString()}`
        );

        // 通知もスケジュールする
        await scheduleSessionEndNotification("work", newTime);
      }

      // タイマー設定も更新
      saveTimerSettings(
        Number(settings.workTime) * 60,
        Number(settings.shortBreakTime) * 60,
        Number(settings.longBreakTime) * 60,
        Number(settings.sessionsUntilLongBreak),
        settings.autoStartBreaks,
        settings.autoStartPomodoros
      );
    } catch (error) {
      console.error("セッション完了処理でエラーが発生しました:", error);
    }
  }, [currentMode, completedSessions, settings, currentTask]);

  // アプリの状態変更を処理する関数
  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("アプリがバックグラウンドからフォアグラウンドに戻りました");

        try {
          // タイマーの状態を確認
          const isTimerComplete = await checkTimerEndTime();
          console.log(`タイマー終了状態確認結果: ${isTimerComplete}`);

          // バックグラウンドから戻ってきた時にモード移行が必要かチェック
          const transition = getNextModeTransition();

          if (transition.shouldTransition && transition.nextMode) {
            console.log(`次のモードに移行します: ${transition.nextMode}`);
            setCurrentMode(
              transition.nextMode as "work" | "shortBreak" | "longBreak"
            );

            // 完了したセッション数も更新
            if (transition.completedSessions !== undefined) {
              setCompletedSessions(transition.completedSessions);
            }

            // 移行先に応じてタイマーを設定
            let newTime = 0;
            if (transition.nextMode === "work") {
              newTime = Number(settings.workTime) * 60;
            } else if (transition.nextMode === "shortBreak") {
              newTime = Number(settings.shortBreakTime) * 60;
            } else if (transition.nextMode === "longBreak") {
              newTime = Number(settings.longBreakTime) * 60;
            }

            setTimeLeft(newTime);

            // 自動開始設定に基づいてタイマーを開始
            const shouldAutoStart =
              transition.nextMode === "work"
                ? settings.autoStartPomodoros
                : settings.autoStartBreaks;

            if (shouldAutoStart) {
              console.log(`次のモード ${transition.nextMode} を自動開始します`);
              setIsRunning(true);
              const endTime = Date.now() + newTime * 1000;
              setTimerEndTime(endTime);
              saveTimerEndTime(endTime, transition.nextMode);
            } else {
              // 自動開始しない場合は明示的にタイマー状態をリセット
              setIsRunning(false);
              setTimerEndTime(null);
              clearTimerEndTime();
            }
          } else if (isTimerComplete) {
            // タイマーが終了していたらセッション完了処理を実行
            console.log(
              "タイマーが終了しているため、セッション完了処理を実行します"
            );
            await handleSessionComplete();
          } else if (isRunning) {
            // タイマーが実行中の場合
            if (timerEndTime) {
              // 終了時刻が設定されている場合、残り時間を再計算
              const now = Date.now();
              if (now < timerEndTime) {
                const newTimeLeft = Math.ceil((timerEndTime - now) / 1000);
                console.log(`残り時間を再計算: ${newTimeLeft}秒`);
                setTimeLeft(newTimeLeft);
              } else {
                // 終了時刻を過ぎている場合は完了処理を実行
                console.log(
                  "タイマー終了時刻を過ぎているため、セッション完了処理を実行します"
                );
                await handleSessionComplete();
              }
            } else {
              // 実行中だが終了時刻が設定されていない場合（通常起きないはず）
              console.log(
                "タイマーは実行中だが終了時刻が設定されていません。状態を修正します"
              );
              // 現在の残り時間で新しい終了時刻を設定
              const endTime = Date.now() + timeLeft * 1000;
              setTimerEndTime(endTime);
              saveTimerEndTime(endTime, currentMode);
            }
          }
        } catch (error) {
          console.error(
            "フォアグラウンド復帰時のタイマー処理でエラーが発生しました:",
            error
          );
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log(
          "アプリがフォアグラウンドからバックグラウンドに移動しました"
        );

        // バックグラウンドに移行する際に現在のタイマー状態を保存
        if (isRunning) {
          // 新しい終了時刻を計算して保存
          const endTime = Date.now() + timeLeft * 1000;
          setTimerEndTime(endTime);
          console.log(
            `タイマー状態を保存: モード=${currentMode}, 残り時間=${timeLeft}秒, 終了時刻=${new Date(
              endTime
            ).toLocaleTimeString()}`
          );

          // タイマー設定を保存
          saveTimerSettings(
            Number(settings.workTime) * 60,
            Number(settings.shortBreakTime) * 60,
            Number(settings.longBreakTime) * 60,
            Number(settings.sessionsUntilLongBreak),
            settings.autoStartBreaks,
            settings.autoStartPomodoros
          );

          // 完了したセッション数を保存
          saveCompletedSessions(completedSessions);

          // タイマー終了時刻を保存
          saveTimerEndTime(endTime, currentMode);

          // 通知をスケジュール
          if (currentMode === "work") {
            await scheduleSessionEndNotification("work", timeLeft);
          } else if (currentMode === "shortBreak") {
            await scheduleSessionEndNotification("shortBreak", timeLeft);
          } else if (currentMode === "longBreak") {
            await scheduleSessionEndNotification("longBreak", timeLeft);
          }
        }
      }

      appStateRef.current = nextAppState;
    },
    [
      isRunning,
      timeLeft,
      currentMode,
      settings,
      completedSessions,
      timerEndTime,
      handleSessionComplete,
    ]
  );

  // タイマーの制御関数
  const toggleTimer = () => {
    if (!isRunning) {
      // タイマーを開始するとき、終了時刻を計算
      const endTime = Date.now() + timeLeft * 1000;
      console.log(
        `タイマーを開始: 終了時刻=${new Date(
          endTime
        ).toLocaleTimeString()}, 残り時間=${timeLeft}秒`
      );
      setTimerEndTime(endTime);
      saveTimerEndTime(endTime, currentMode);

      // タイマー設定を保存
      saveTimerSettings(
        Number(settings.workTime) * 60,
        Number(settings.shortBreakTime) * 60,
        Number(settings.longBreakTime) * 60,
        Number(settings.sessionsUntilLongBreak),
        settings.autoStartBreaks,
        settings.autoStartPomodoros
      );

      // 完了したセッション数を保存
      saveCompletedSessions(completedSessions);
    } else {
      // タイマーを一時停止するとき
      console.log(`タイマーを一時停止: 残り時間=${timeLeft}秒`);

      // 通知をキャンセル
      cancelAllNotifications();

      // 終了時刻をクリア（一時停止状態を示す）
      setTimerEndTime(null);
      clearTimerEndTime();
    }
    // タイマーの実行状態を切り替え
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    console.log("タイマーをリセット");
    setIsRunning(false);
    setTimerEndTime(null);
    clearTimerEndTime();
    cancelAllNotifications();

    // 現在のモードに応じた初期時間を設定
    let newTime = 0;
    if (currentMode === "work") {
      newTime = Number(settings.workTime) * 60;
    } else if (currentMode === "shortBreak") {
      newTime = Number(settings.shortBreakTime) * 60;
    } else if (currentMode === "longBreak") {
      newTime = Number(settings.longBreakTime) * 60;
    }
    console.log(`新しい時間を設定: ${newTime}秒`);
    setTimeLeft(newTime);
  };

  const handleSaveSettings = async (newSettings: TimerSettings) => {
    // タイマーを停止
    setIsRunning(false);

    // タスク固有の設定を更新
    const updatedTaskSettings = appSettings.taskSettings.filter(
      (settings) => settings.taskId !== task.id
    );
    updatedTaskSettings.push({
      taskId: task.id,
      settings: newSettings,
    });

    const newAppSettings: AppSettings = {
      ...appSettings,
      taskSettings: updatedTaskSettings,
    };

    // 設定を更新
    setAppSettings(newAppSettings);
    setSettings(newSettings);

    // 現在のモードに応じてタイマーをリセット
    let newTime = Number(newSettings.workTime);
    if (currentMode === "shortBreak") {
      newTime = Number(newSettings.shortBreakTime);
    } else if (currentMode === "longBreak") {
      newTime = Number(newSettings.longBreakTime);
    }
    setTimeLeft(newTime * 60);

    // 設定を永続化
    try {
      await saveSettings(newAppSettings);
    } catch (error) {
      console.error("設定の保存に失敗しました:", error);
      Alert.alert("エラー", "設定の保存に失敗しました");
    }
  };

  // タスクIDを使わずにStatsScreenを表示するハンドラー
  const handleShowStats = () => {
    // 最新のタスク情報でステータス画面を表示
    if (onTaskUpdate) {
      // 最新のタスク情報を親コンポーネントに再通知
      onTaskUpdate(currentTask);
    }

    // 少し遅延させてからステータス画面を表示（状態更新を確実にするため）
    setTimeout(() => {
      onShowStats();
    }, 50);
  };

  // useEffectフックで初期化と後始末を行う
  useEffect(() => {
    // 通知の設定を初期化
    registerForPushNotificationsAsync();

    // バックグラウンドタスクを登録
    registerBackgroundTask();

    // AppStateの変更リスナーを設定
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // アプリ起動時にバックグラウンドでタイマーが終了していたかチェック
    const checkTimerOnStartup = async () => {
      try {
        const isTimerComplete = await checkTimerEndTime();
        console.log(`起動時のタイマー終了状態: ${isTimerComplete}`);

        const transition = getNextModeTransition();

        if (transition.shouldTransition && transition.nextMode) {
          console.log(`モード移行を検出: ${transition.nextMode}`);
          setCurrentMode(
            transition.nextMode as "work" | "shortBreak" | "longBreak"
          );

          // 完了したセッション数も更新
          if (transition.completedSessions !== undefined) {
            setCompletedSessions(transition.completedSessions);
          }

          // 新しいモードに合わせてタイマーを設定
          let newTime = 0;
          if (transition.nextMode === "work") {
            newTime = Number(settings.workTime) * 60;
          } else if (transition.nextMode === "shortBreak") {
            newTime = Number(settings.shortBreakTime) * 60;
          } else if (transition.nextMode === "longBreak") {
            newTime = Number(settings.longBreakTime) * 60;
          }

          setTimeLeft(newTime);
        } else if (isTimerComplete === true) {
          // タイマーが終了していた場合は完了処理を実行
          console.log(
            "起動時にタイマー終了を検出したため、セッション完了処理を実行します"
          );
          await handleSessionComplete();
        } else if (timerEndTime) {
          // タイマーが実行中だった場合は残り時間を再計算
          const now = Date.now();
          if (now < timerEndTime) {
            const newTimeLeft = Math.ceil((timerEndTime - now) / 1000);
            console.log(`起動時の残り時間を再計算: ${newTimeLeft}秒`);
            setTimeLeft(newTimeLeft);
            setIsRunning(true);
          } else {
            // 終了時刻を過ぎていた場合もセッション完了処理を実行
            console.log(
              "起動時にタイマー終了時刻を過ぎていたため、セッション完了処理を実行します"
            );
            await handleSessionComplete();
          }
        }
      } catch (error) {
        console.error(
          "起動時のタイマー状態チェックでエラーが発生しました:",
          error
        );
      }
    };

    checkTimerOnStartup();

    // 設定を読み込む
    loadSettings().then((loadedSettings) => {
      if (loadedSettings) {
        setAppSettings(loadedSettings);
        // 現在のタスク用の設定があるか確認
        const taskSetting = loadedSettings.taskSettings.find(
          (s) => s.taskId === task.id
        );
        if (taskSetting) {
          setSettings(taskSetting.settings);
          // 初期モードを作業モードに設定
          setCurrentMode("work");
          setTimeLeft(Number(taskSetting.settings.workTime) * 60);
        } else {
          setSettings(loadedSettings.globalSettings);
          // 初期モードを作業モードに設定
          setCurrentMode("work");
          setTimeLeft(Number(loadedSettings.globalSettings.workTime) * 60);
        }
      }
    });

    // クリーンアップ関数
    return () => {
      subscription.remove();
      // タイマーをクリア
      if (isRunning) {
        clearTimerEndTime();
      }
    };
  }, []);

  // タイマーのカウントダウン処理用のuseEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      // タイマー終了時刻を設定（バックグラウンドでの追跡用）
      if (!timerEndTime) {
        // 新しい終了時刻を計算 - 現在時刻 + 残り時間
        const endTime = Date.now() + timeLeft * 1000;
        console.log(
          `タイマー終了時刻を設定: ${new Date(
            endTime
          ).toLocaleTimeString()}, 残り時間=${timeLeft}秒`
        );
        setTimerEndTime(endTime);
        saveTimerEndTime(endTime, currentMode);
      }

      // 1秒ごとにカウントダウン
      interval = setInterval(async () => {
        if (timerEndTime) {
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((timerEndTime - now) / 1000));

          if (remaining <= 0) {
            // タイマーが終了した場合
            clearInterval(interval);
            console.log("タイマーが終了しました");
            await handleSessionComplete();
            setTimeLeft(0);
          } else {
            // まだ時間が残っている場合
            setTimeLeft(remaining);
          }
        } else {
          // timerEndTimeがない場合のフォールバック（通常は起きない）
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(interval);
              handleSessionComplete(); // ここではawaitが使えないので非同期で実行
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    }

    // クリーンアップ
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, currentMode, timerEndTime]);

  // 設定変更時にタイマーを更新するuseEffect
  useEffect(() => {
    // タイマーが実行中でなく、かつtimeLeftが設定されていない（またはtimeLeftが0）、かつtimerEndTimeもない場合のみ
    // 初期表示時や設定変更後などにタイマーをリセット
    if (!isRunning && !timerEndTime && timeLeft <= 0) {
      let newTime = 0;
      if (currentMode === "work") {
        newTime = Number(settings.workTime) * 60;
      } else if (currentMode === "shortBreak") {
        newTime = Number(settings.shortBreakTime) * 60;
      } else if (currentMode === "longBreak") {
        newTime = Number(settings.longBreakTime) * 60;
      }
      console.log(`設定変更によりタイマーをリセット: ${newTime}秒`);
      setTimeLeft(newTime);
    }
  }, [settings, currentMode, isRunning, timerEndTime]);

  // 残り時間を分と秒に変換
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.mainContainer,
          Platform.OS === "android" && { paddingTop: StatusBar.currentHeight },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#8F95B2" />
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.settingsButtonText}>時間の設定</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskName}>{currentTask.name}</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.levelText}>レベル {currentTask.level}</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerMode}>
              {currentMode === "work"
                ? "作業中"
                : currentMode === "shortBreak"
                ? "小休憩"
                : "長休憩"}
            </Text>
            <Text style={styles.timer}>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Text>
            <Text style={styles.sessionCount}>
              完了したセッション: {completedSessions} /{" "}
              {settings.sessionsUntilLongBreak}
            </Text>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={toggleTimer}
              >
                <Ionicons
                  name={isRunning ? "pause" : "play"}
                  size={24}
                  color="#171923"
                />
                <Text style={styles.startButtonText}>
                  {isRunning ? "一時停止" : "開始"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <Text style={styles.resetButtonText}>リセット</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceLabel}>経験値</Text>
            <View style={styles.experienceBarContainer}>
              <View
                style={[
                  styles.experienceBar,
                  {
                    width: `${
                      (currentTask.experience.current /
                        currentTask.experience.max) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.experienceText}>
              {currentTask.experience.current} / {currentTask.experience.max}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.statsButton}
            onPress={handleShowStats}
          >
            <Text style={styles.statsButtonText}>ステータスを見る</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SettingsModal
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        task={task}
      />

      {/* レベルアップモーダル */}
      <Modal
        transparent={true}
        visible={showLevelUpModal}
        animationType="fade"
        onRequestClose={() => setShowLevelUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.levelUpModal}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
            <Text style={styles.levelUpTitle}>レベルアップ！</Text>
            <Text style={styles.levelUpMessage}>{levelUpMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

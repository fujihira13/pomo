import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, Stats, DailyStats, TaskDistribution } from "../types/stats";
import {
  format,
  subDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

const STORAGE_KEY = "pomo_sessions";

export class StatsService {
  private static async getSessions(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("セッションの取得に失敗しました:", error);
      return [];
    }
  }

  private static async saveSessions(sessions: Session[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("セッションの保存に失敗しました:", error);
    }
  }

  static async addSession(session: Omit<Session, "id">): Promise<void> {
    const sessions = await this.getSessions();
    const newSession = {
      ...session,
      id: Date.now().toString(),
    };
    sessions.push(newSession);
    await this.saveSessions(sessions);
  }

  static async getStats(days: number = 7): Promise<Stats> {
    try {
      const sessions = await this.getSessions();
      const endDate = new Date();
      const startDate = subDays(endDate, days - 1);

      // 指定期間内のセッションのみを一度フィルタリング
      const filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.timestamp);
        return isWithinInterval(sessionDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      });

      // セッションを日付でグループ化
      const sessionsByDate = new Map<string, Session[]>();
      filteredSessions.forEach((session) => {
        const dateKey = format(new Date(session.timestamp), "yyyy-MM-dd");
        const existing = sessionsByDate.get(dateKey) || [];
        sessionsByDate.set(dateKey, [...existing, session]);
      });

      // 日次統計の計算
      const dailyStats: DailyStats[] = [];
      for (let i = 0; i < days; i++) {
        const currentDate = subDays(endDate, i);
        const dateKey = format(currentDate, "yyyy-MM-dd");
        const daySessions = sessionsByDate.get(dateKey) || [];

        dailyStats.unshift({
          date: dateKey,
          sessionCount: daySessions.length,
          totalDuration: daySessions.reduce(
            (sum, session) => sum + session.duration,
            0
          ),
          experiencePoints: daySessions.reduce(
            (sum, session) => sum + session.experiencePoints,
            0
          ),
        });
      }

      // タスク分布の計算
      const taskCounts = new Map<string, number>();
      filteredSessions.forEach((session) => {
        const count = taskCounts.get(session.taskType) || 0;
        taskCounts.set(session.taskType, count + 1);
      });

      const taskDistribution: TaskDistribution[] = Array.from(
        taskCounts.entries()
      ).map(([taskType, count]) => ({
        taskType,
        sessionCount: count,
      }));

      // 継続日数の計算（最大365日まで）
      let streakDays = 0;
      let currentDate = new Date();
      const maxDaysToCheck = 365;
      let daysChecked = 0;

      while (daysChecked < maxDaysToCheck) {
        const dateKey = format(currentDate, "yyyy-MM-dd");
        const daySessions = sessionsByDate.get(dateKey) || [];

        if (daySessions.length > 0) {
          streakDays++;
        } else {
          break;
        }

        currentDate = subDays(currentDate, 1);
        daysChecked++;
      }

      // 総経験値の計算
      const totalExperience = filteredSessions.reduce(
        (sum, session) => sum + session.experiencePoints,
        0
      );

      return {
        dailyStats,
        taskDistribution,
        streakDays,
        totalExperience,
      };
    } catch (error) {
      console.error("統計データの計算中にエラーが発生しました:", error);
      // エラー時はデフォルト値を返す
      return {
        dailyStats: [],
        taskDistribution: [],
        streakDays: 0,
        totalExperience: 0,
      };
    }
  }
}

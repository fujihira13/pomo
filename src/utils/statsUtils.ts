import type { Stats, TaskDistribution } from "../types/stats";
import type { Task } from "../types/models/Task";
import { StatsService } from "../services/StatsService";

export type Period = "週間" | "月間" | "年間";

/**
 * 選択された期間に応じた日数を取得する
 * @param period 期間
 * @returns 日数
 */
export const getDaysFromPeriod = (period: Period): number => {
  const days = {
    週間: 7,
    月間: 30,
    年間: 365,
  }[period];

  return days;
};

/**
 * 統計データを読み込む関数
 * @param period 期間
 * @param tasks タスクリスト
 * @param onUpdate 更新コールバック
 * @returns 統計データ読み込みの結果
 */
export const loadStats = async (
  period: Period,
  tasks?: Task[],
  onUpdate?: () => void
): Promise<{ stats: Stats | null; error: string | null }> => {
  try {
    const days = getDaysFromPeriod(period);
    const newStats = await StatsService.getStats(days);

    // タスク名を更新する
    if (
      tasks &&
      Array.isArray(tasks) &&
      tasks.length > 0 &&
      newStats.taskDistribution.length > 0
    ) {
      newStats.taskDistribution = updateTaskNames(
        newStats.taskDistribution,
        tasks
      );
    }

    if (onUpdate) {
      onUpdate();
    }

    return { stats: newStats, error: null };
  } catch (error) {
    console.error("統計データの取得に失敗しました:", error);
    return {
      stats: null,
      error: "統計データの読み込みに失敗しました。もう一度お試しください。",
    };
  }
};

/**
 * タスク分布データにタスク名を反映する
 * @param distribution タスク分布データ
 * @param tasks タスクリスト
 * @returns 更新されたタスク分布データ
 */
export const updateTaskNames = (
  distribution: TaskDistribution[],
  tasks: Task[]
): TaskDistribution[] => {
  return distribution.map((dist) => {
    const task = tasks.find((t) => t.id === dist.taskId);
    return {
      ...dist,
      taskType: task?.name || dist.taskType,
    };
  });
};

/**
 * チャート表示用のデータを生成する
 * @param stats 統計データ
 * @param period 期間
 * @returns チャート用データ
 */
export const getChartData = (stats: Stats | null, period: Period) => {
  if (!stats) return null;

  return {
    labels: stats.dailyStats.map((stat) => {
      const date = new Date(stat.date);
      return period === "週間"
        ? ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
        : `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: stats.dailyStats.map((stat) => stat.sessionCount),
      },
    ],
  };
};

/**
 * タスク分布チャート用のデータを生成する
 * @param stats 統計データ
 * @param tasks タスクリスト
 * @returns タスク分布チャート用データ
 */
export const getTaskDistributionData = (
  stats: Stats | null,
  tasks?: Task[]
) => {
  if (!stats) return null;

  // タスク分布データをソートして上位から表示
  const sortedDistribution = [...stats.taskDistribution].sort(
    (a, b) => b.sessionCount - a.sessionCount
  );

  return {
    labels: sortedDistribution.map((task) => {
      // tasks 配列が存在するか確認してから処理
      if (!tasks || tasks.length === 0) {
        return task.taskType; // タスクリストがない場合はそのまま表示
      }

      // タスク名の表示を強化
      const matchingTask = tasks.find((t) => t.id === task.taskId);
      const displayName = matchingTask ? matchingTask.name : task.taskType;
      // 長いタスク名を省略表示
      return displayName.length > 10
        ? displayName.substring(0, 8) + "..."
        : displayName;
    }),
    datasets: [
      {
        data: sortedDistribution.map((task) => task.sessionCount),
      },
    ],
  };
};

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { StatsService } from "../services/StatsService";
import { Stats as StatsType } from "../types/stats";
import type { Task } from "../types/models/Task";

interface StatsProps {
  onBack: () => void;
  onUpdate?: () => void;
  tasks: Task[];
}

type Period = "週間" | "月間" | "年間";

export const Stats: React.FC<StatsProps> = ({ onBack, onUpdate, tasks }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("週間");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const days = {
        週間: 7,
        月間: 30,
        年間: 365,
      }[selectedPeriod];

      const newStats = await StatsService.getStats(days);
      if (
        tasks &&
        Array.isArray(tasks) &&
        tasks.length > 0 &&
        newStats.taskDistribution.length > 0
      ) {
        newStats.taskDistribution = newStats.taskDistribution.map((dist) => {
          const task = tasks.find((t) => t.id === dist.taskId);
          return {
            ...dist,
            taskType: task?.name || dist.taskType,
          };
        });
      }
      setStats(newStats);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("統計データの取得に失敗しました:", error);
      setError("統計データの読み込みに失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, onUpdate, tasks]);

  const refreshStats = () => {
    if (stats && tasks && Array.isArray(tasks) && tasks.length > 0) {
      const updatedStats = { ...stats };
      updatedStats.taskDistribution = updatedStats.taskDistribution.map(
        (dist) => {
          const task = tasks.find((t) => t.id === dist.taskId);
          return {
            ...dist,
            taskType: task?.name || dist.taskType,
          };
        }
      );
      setStats(updatedStats);
      console.log("Stats refreshed with latest task names");
    }
  };

  useEffect(() => {
    if (tasks && Array.isArray(tasks) && !loading) {
      refreshStats();
    }
  }, [tasks]);

  useEffect(() => {
    loadStats();
  }, [selectedPeriod, loadStats]);

  useEffect(() => {
    // デバッグ用：tasksプロップの内容を確認
    console.log("Stats received tasks:", tasks);
  }, [tasks]);

  const getChartData = () => {
    if (!stats) return null;

    return {
      labels: stats.dailyStats.map((stat) => {
        const date = new Date(stat.date);
        return selectedPeriod === "週間"
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

  const getTaskDistributionData = () => {
    if (!stats) return null;

    // タスク分布データをソートして上位から表示
    const sortedDistribution = [...stats.taskDistribution].sort(
      (a, b) => b.sessionCount - a.sessionCount
    );

    // デバッグ用：マッチングの様子を確認
    console.log("Task distribution:", sortedDistribution);

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={styles.loadingText}>統計データを読み込んでいます...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
          <Text style={styles.retryButtonText}>再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>統計</Text>
        </View>

        {/* 期間選択タブ */}
        <View style={styles.periodTabs}>
          {(["週間", "月間", "年間"] as Period[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && styles.selectedPeriodTab,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodTabText,
                  selectedPeriod === period && styles.selectedPeriodTabText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {stats && (
            <>
              {/* 上部の統計情報 */}
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>
                    {selectedPeriod}のセッション
                  </Text>
                  <Text style={styles.statValue}>
                    {stats.dailyStats.reduce(
                      (sum, stat) => sum + stat.sessionCount,
                      0
                    )}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>累積経験値</Text>
                  <Text style={styles.statValue}>
                    {stats.totalExperience.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>継続日数</Text>
                  <Text style={styles.statValue}>{stats.streakDays}日</Text>
                </View>
              </View>

              {/* セッション数推移グラフ */}
              {selectedPeriod === "週間" && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>セッション数推移</Text>
                  <LineChart
                    data={
                      getChartData() || { labels: [], datasets: [{ data: [] }] }
                    }
                    width={Dimensions.get("window").width - 40}
                    height={220}
                    chartConfig={{
                      backgroundColor: "#1e1e1e",
                      backgroundGradientFrom: "#1e1e1e",
                      backgroundGradientTo: "#1e1e1e",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      propsForBackgroundLines: {
                        strokeDasharray: "",
                        stroke: "rgba(255, 255, 255, 0.1)",
                      },
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: "#ffa500",
                      },
                    }}
                    bezier
                    style={styles.chart}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    withDots={true}
                    withShadow={false}
                    segments={4}
                  />
                </View>
              )}

              {/* タスク分布グラフ */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>タスク分布</Text>
                {stats && stats.taskDistribution.length > 0 ? (
                  <BarChart
                    data={
                      getTaskDistributionData() || {
                        labels: [],
                        datasets: [{ data: [] }],
                      }
                    }
                    width={Dimensions.get("window").width - 40}
                    height={240}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero={true}
                    showValuesOnTopOfBars={true}
                    segments={1}
                    chartConfig={{
                      backgroundColor: "#1e1e1e",
                      backgroundGradientFrom: "#1e1e1e",
                      backgroundGradientTo: "#1e1e1e",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      propsForBackgroundLines: {
                        strokeDasharray: "",
                        stroke: "rgba(255, 255, 255, 0.1)",
                      },
                      formatYLabel: (value) => Number(value).toString(),
                      barPercentage: 0.7,
                    }}
                    style={styles.chart}
                    withHorizontalLabels={false}
                    flatColor={true}
                  />
                ) : (
                  <Text style={styles.noDataText}>データがありません</Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 16 : 0,
    paddingBottom: 20,
    backgroundColor: "#1e1e1e",
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  periodTabs: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 20,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectedPeriodTab: {
    backgroundColor: "#ffa500",
  },
  periodTabText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  selectedPeriodTabText: {
    color: "#1e1e1e",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "column",
    gap: 20,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 10,
  },
  statTitle: {
    color: "#888",
    fontSize: 14,
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  chartContainer: {
    marginVertical: 20,
  },
  chartTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 20,
  },
  errorText: {
    color: "#fff",
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#ffa500",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#1e1e1e",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 100,
  },
});

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-chart-kit";
import type { Task } from "../types/models/Task";
import type { Stats as StatsType } from "../types/stats";
import { statsStyles } from "../styles/components/Stats.styles";
import {
  Period,
  loadStats as fetchStats,
  updateTaskNames,
  getChartData,
  getTaskDistributionData,
} from "../utils/statsUtils";

interface StatsProps {
  onBack: () => void;
  onUpdate?: () => void;
  tasks: Task[];
}

export const Stats: React.FC<StatsProps> = ({ onBack, onUpdate, tasks }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("週間");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 統計データを読み込む関数
  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStats(selectedPeriod, tasks, onUpdate);
      if (result.error) {
        setError(result.error);
      } else {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("統計データの取得に失敗しました:", error);
      setError("統計データの読み込みに失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, tasks, onUpdate]);

  // タスク名を更新する関数
  const refreshStats = () => {
    if (stats && tasks && Array.isArray(tasks) && tasks.length > 0) {
      const updatedStats = { ...stats };
      updatedStats.taskDistribution = updateTaskNames(
        updatedStats.taskDistribution,
        tasks
      );
      setStats(updatedStats);
      console.log("Stats refreshed with latest task names");
    }
  };

  // タスクが変更されたときに統計を更新
  useEffect(() => {
    if (tasks && Array.isArray(tasks) && !loading) {
      refreshStats();
    }
  }, [tasks]);

  // 期間が変更されたときに統計をロード
  useEffect(() => {
    loadStats();
  }, [selectedPeriod, loadStats]);

  // ローディング表示
  if (loading) {
    return (
      <View
        style={[
          statsStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={{ color: "#fff", marginTop: 20 }}>
          統計データを読み込んでいます...
        </Text>
      </View>
    );
  }

  // エラー表示
  if (error) {
    return (
      <View
        style={[
          statsStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#fff", marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity
          style={{ padding: 12, backgroundColor: "#ffa500", borderRadius: 8 }}
          onPress={loadStats}
        >
          <Text style={{ color: "#1e1e1e", fontSize: 16, fontWeight: "bold" }}>
            再試行
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 統計画面本体
  return (
    <SafeAreaView style={statsStyles.safeArea}>
      <View style={statsStyles.container}>
        {/* ヘッダー */}
        <View style={statsStyles.header}>
          <TouchableOpacity style={statsStyles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#8F95B2" />
          </TouchableOpacity>
          <Text style={statsStyles.headerTitle}>統計</Text>
        </View>

        {/* 期間選択タブ */}
        <View style={statsStyles.periodTabs}>
          {["週間", "月間", "年間"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                statsStyles.periodTab,
                selectedPeriod === period && statsStyles.selectedPeriodTab,
              ]}
              onPress={() => setSelectedPeriod(period as Period)}
            >
              <Text
                style={[
                  statsStyles.periodTabText,
                  selectedPeriod === period &&
                    statsStyles.selectedPeriodTabText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 統計コンテンツ */}
        {stats ? (
          <ScrollView
            style={statsStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={statsStyles.scrollContent}
          >
            {/* 上部の統計情報 */}
            <View style={statsStyles.statsContainer}>
              <View style={statsStyles.statBox}>
                <Text style={statsStyles.statTitle}>
                  {selectedPeriod}のセッション
                </Text>
                <Text style={statsStyles.statValue}>
                  {stats.dailyStats.reduce(
                    (sum, stat) => sum + stat.sessionCount,
                    0
                  )}
                </Text>
              </View>

              <View style={statsStyles.statBox}>
                <Text style={statsStyles.statTitle}>累積経験値</Text>
                <Text style={statsStyles.statValue}>
                  {stats.totalExperience.toLocaleString()}
                </Text>
              </View>

              <View style={statsStyles.statBox}>
                <Text style={statsStyles.statTitle}>継続日数</Text>
                <Text style={statsStyles.statValue}>{stats.streakDays}日</Text>
              </View>
            </View>

            {/* セッション数推移グラフ */}
            {selectedPeriod === "週間" && (
              <View style={statsStyles.chartContainer}>
                <Text style={statsStyles.chartTitle}>セッション数推移</Text>
                <LineChart
                  data={
                    getChartData(stats, selectedPeriod) || {
                      labels: [],
                      datasets: [{ data: [] }],
                    }
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
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa500",
                    },
                  }}
                  bezier
                  style={statsStyles.chart}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                />
              </View>
            )}

            {/* タスク分布グラフ */}
            <View style={statsStyles.chartContainer}>
              <Text style={statsStyles.chartTitle}>タスク分布</Text>
              {stats && stats.taskDistribution.length > 0 ? (
                <BarChart
                  data={
                    getTaskDistributionData(stats, tasks) || {
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
                  chartConfig={{
                    backgroundColor: "#1e1e1e",
                    backgroundGradientFrom: "#1e1e1e",
                    backgroundGradientTo: "#1e1e1e",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.7,
                  }}
                  style={statsStyles.chart}
                  withHorizontalLabels={false}
                  flatColor={true}
                />
              ) : (
                <Text
                  style={{ color: "#fff", textAlign: "center", marginTop: 100 }}
                >
                  データがありません
                </Text>
              )}
            </View>
          </ScrollView>
        ) : (
          <Text
            style={{ color: "#FFFFFF", textAlign: "center", marginTop: 20 }}
          >
            データがありません
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

interface StatsProps {
  onBack: () => void;
}

type Period = "週間" | "月間" | "年間";

// モックデータ
const weeklyData = {
  labels: ["月", "火", "水", "木", "金", "土", "日"],
  datasets: [
    {
      data: [4, 6, 3, 5, 4, 8, 2],
    },
  ],
};

const taskDistribution = {
  labels: ["プログラミング", "資格勉強", "読書", "その他"],
  datasets: [
    {
      data: [15, 8, 6, 3],
    },
  ],
};

export const Stats: React.FC<StatsProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("週間");

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
          {/* 上部の統計情報 */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>今週のセッション</Text>
              <Text style={styles.statValue}>32</Text>
              <Text style={styles.statDiff}>+5 vs 先週</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statTitle}>累積経験値</Text>
              <Text style={styles.statValue}>1,920</Text>
              <Text style={styles.statDiff}>+320 vs 先週</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statTitle}>継続日数</Text>
              <Text style={styles.statValue}>14日</Text>
              <Text style={styles.statDiff}>最高記録 vs 先週</Text>
            </View>
          </View>

          {/* セッション数推移グラフ */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>セッション数推移</Text>
            <LineChart
              data={weeklyData}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#1e1e1e",
                backgroundGradientFrom: "#1e1e1e",
                backgroundGradientTo: "#1e1e1e",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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

          {/* タスク分布グラフ */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>タスク分布</Text>
            <BarChart
              data={taskDistribution}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#1e1e1e",
                backgroundGradientFrom: "#1e1e1e",
                backgroundGradientTo: "#1e1e1e",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "rgba(255, 255, 255, 0.1)",
                },
              }}
              style={styles.chart}
              withHorizontalLabels={true}
              segments={4}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e1e1e",
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
    paddingTop: 20,
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
  statDiff: {
    color: "#4CAF50",
    fontSize: 12,
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
});

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const Stats = () => {
  const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

  const sessionData = {
    labels: weekDays,
    datasets: [
      {
        data: [4, 3, 5, 4, 6, 8, 7],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const studyTimeData = {
    labels: weekDays,
    datasets: [
      {
        data: [2, 1.5, 2.5, 2, 3, 4, 3.5],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#1e1e1e",
    backgroundGradientFrom: "#1e1e1e",
    backgroundGradientTo: "#1e1e1e",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>完了セッション数</Text>
      <LineChart
        data={sessionData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.title}>学習時間の推移</Text>
      <LineChart
        data={studyTimeData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Stats;

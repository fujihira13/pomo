import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatsScreenProps {
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  // モックデータ
  const stats = {
    completedSessions: 142,
    totalTime: "59h",
    currentSkills: [
      { name: "集中の探求", level: 3, progress: 15 },
      { name: "時間操作", level: 2, progress: 10 },
    ],
    quests: [
      {
        title: "朝の修行",
        description: "朝9時までに1セッション完了",
        reward: "経験値 x1.5",
        progress: 0,
        type: "デイリー",
      },
      {
        title: "集中の試練",
        description: "1週間で20セッション達成",
        reward: "新スキル解放",
        progress: 65,
        type: "ウィークリー",
      },
      {
        title: "不屈の探究者",
        description: "3日連続で5セッション達成",
        reward: "称号獲得",
        progress: 33,
        type: "チャレンジ",
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#8F95B2" />
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>闇の魔術師</Text>
          <Text style={styles.subtitle}>称号: 時の探究者</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.completedSessions}</Text>
            <Text style={styles.statLabel}>完了セッション</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalTime}</Text>
            <Text style={styles.statLabel}>総学習時間</Text>
          </View>
        </View>

        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>習得中のスキル</Text>
          {stats.currentSkills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>Lv.{skill.level}</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${skill.progress}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.questsSection}>
          <Text style={styles.sectionTitle}>クエスト</Text>
          {stats.quests.map((quest, index) => (
            <View key={index} style={styles.questItem}>
              <View style={styles.questHeader}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <View style={styles.questBadge}>
                  <Text style={styles.questBadgeText}>{quest.type}</Text>
                </View>
              </View>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <Text style={styles.questReward}>報酬: {quest.reward}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${quest.progress}%` }]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButtonText: {
    color: "#8F95B2",
    fontSize: 16,
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8F95B2",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#8F95B2",
    fontSize: 14,
  },
  skillsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillName: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  skillLevel: {
    color: "#FFD700",
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2A2F45",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFA500",
    borderRadius: 4,
  },
  questsSection: {
    marginBottom: 32,
  },
  questItem: {
    backgroundColor: "#2A2F45",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  questHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  questBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questBadgeText: {
    color: "#171923",
    fontSize: 12,
    fontWeight: "bold",
  },
  questDescription: {
    color: "#8F95B2",
    fontSize: 14,
    marginBottom: 8,
  },
  questReward: {
    color: "#FFD700",
    fontSize: 14,
    marginBottom: 8,
  },
});

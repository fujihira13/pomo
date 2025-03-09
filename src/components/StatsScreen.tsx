import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatsService } from "../services/StatsService";
import { Session } from "../types/stats";
import {
  getAcquiredSkills,
  getNextSkill,
  SkillDefinition,
} from "../data/skills";
import { Task } from "../types/models/Task";
import {
  calculateProgressToSkillLevel,
  calculateTotalEarnedExp,
  calculateTotalExpToLevel,
} from "../utils/levelUtils";

// 日本語の職業名から英語のジョブタイプを取得するマッピング
const JOB_NAME_TO_ID: Record<string, string> = {
  戦士: "warrior",
  魔法使い: "mage",
  僧侶: "priest",
  賢者: "sage",
};

// 英語のジョブタイプから日本語の職業名を取得するマッピング
const JOB_ID_TO_NAME: Record<string, string> = {
  warrior: "戦士",
  mage: "魔法使い",
  priest: "僧侶",
  sage: "賢者",
};

interface StatsScreenProps {
  onBack: () => void;
  taskId?: string; // タスクIDを追加（オプショナル）
  task?: Task; // タスク情報を追加
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  onBack,
  taskId,
  task,
}) => {
  // 実際のデータを保存するための状態
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<string>("0h");
  const [acquiredSkills, setAcquiredSkills] = useState<SkillDefinition[]>([]);
  const [nextSkill, setNextSkill] = useState<SkillDefinition | null>(null);
  const [progressToNextSkill, setProgressToNextSkill] = useState<number>(0);
  const [remainingExp, setRemainingExp] = useState<number>(0);

  // コンポーネントがマウントされたときに統計データを取得
  useEffect(() => {
    // デバッグ情報を表示
    console.log("StatsScreen: タスク情報", task);
    console.log("StatsScreen: taskId", taskId);

    const fetchStats = async () => {
      try {
        // すべてのセッションを取得
        const allSessions = await StatsService.getAllSessions();

        // タスクIDが指定されている場合は、そのタスクのセッションのみをフィルタリング
        const sessions = taskId
          ? allSessions.filter((session) => session.taskId === taskId)
          : allSessions;

        // そのタスクの完了セッション数
        setCompletedSessions(sessions.length);

        // そのタスクの総学習時間を計算（秒単位）
        const totalSeconds = sessions.reduce(
          (total: number, session: Session) => {
            return total + session.duration;
          },
          0
        );

        // 時間に変換（小数点以下は切り捨て）
        const hours = Math.floor(totalSeconds / 3600);
        setTotalTime(`${hours}h`);
      } catch (error) {
        console.error("統計データの取得に失敗しました:", error);
      }
    };

    fetchStats();

    // タスクとレベルに基づいてスキル情報を取得
    if (task && task.job && task.job.type) {
      console.log("StatsScreen: 職業タイプ", task.job.type);
      console.log("StatsScreen: 現在のレベル", task.level);
      console.log("StatsScreen: 現在の経験値", task.experience.current);
      console.log("StatsScreen: 次のレベルまでの経験値", task.experience.max);

      // 日本語の職業名から英語のジョブIDを取得
      const jobId = JOB_NAME_TO_ID[task.job.type] || task.job.type;
      console.log("StatsScreen: 変換したジョブID", jobId);

      // 習得済みスキル
      const acquired = getAcquiredSkills(jobId, task.level);
      console.log("StatsScreen: 習得済みスキル", acquired);
      setAcquiredSkills(acquired);

      // 次に習得するスキル
      const next = getNextSkill(jobId, task.level);
      console.log("StatsScreen: 次のスキル", next);
      setNextSkill(next);

      // 次のスキルまでの進捗を計算（経験値ベース）
      if (next) {
        const currentLevel = task.level;
        const nextSkillLevel = next.level;

        // 現在のレベルから次のスキルレベルまでの進捗を計算
        const { progressPercentage, remainingExp: expRemaining } =
          calculateProgressToSkillLevel(
            currentLevel,
            task.experience.current,
            task.experience.max,
            nextSkillLevel
          );

        console.log("StatsScreen: 進捗率", progressPercentage);
        console.log("StatsScreen: 残り経験値", expRemaining);

        // 状態を更新
        setProgressToNextSkill(progressPercentage);
        setRemainingExp(expRemaining);
      }
    }
  }, [taskId, task]);

  // 次回リリースで実装予定のクエスト機能
  /*
  const quests = [
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
  ];
  */

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
          <Text style={styles.title}>
            {task?.job?.type
              ? task.job.type
              : JOB_ID_TO_NAME["warrior"] || "冒険者"}
          </Text>
          <Text style={styles.subtitle}>レベル: {task?.level || 1}</Text>
          {/* 次回リリースで実装予定の称号 */}
          {/* <Text style={styles.subtitle}>称号: 時の探究者</Text> */}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedSessions}</Text>
            <Text style={styles.statLabel}>完了セッション</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalTime}</Text>
            <Text style={styles.statLabel}>総学習時間</Text>
          </View>
        </View>

        {/* 習得済みスキルセクション */}
        {acquiredSkills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>習得済みスキル</Text>
            {acquiredSkills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>Lv.{skill.level}で習得</Text>
                </View>
                <Text style={styles.skillDescription}>{skill.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 次に習得するスキルセクション */}
        {nextSkill && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>習得中のスキル</Text>
            <View style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{nextSkill.name}</Text>
                <Text style={styles.skillLevel}>
                  Lv.{nextSkill.level}で習得
                </Text>
              </View>
              <Text style={styles.skillDescription}>
                {nextSkill.description}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>
                    習得まで: {Math.round(progressToNextSkill)}%
                  </Text>
                  <Text style={styles.progressText}>
                    残り経験値: {remainingExp.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progressToNextSkill}%`,
                          shadowColor: "#4CAF50",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.8,
                          shadowRadius: 4,
                          backgroundColor:
                            JOB_NAME_TO_ID[task?.job?.type || ""] === "mage"
                              ? "#8A2BE2"
                              : JOB_NAME_TO_ID[task?.job?.type || ""] ===
                                "warrior"
                              ? "#FF4500"
                              : JOB_NAME_TO_ID[task?.job?.type || ""] ===
                                "priest"
                              ? "#1E90FF"
                              : JOB_NAME_TO_ID[task?.job?.type || ""] === "sage"
                              ? "#FFD700"
                              : "#4CAF50",
                        },
                      ]}
                    >
                      <View style={styles.progressShine}></View>
                    </View>
                  </View>
                  <Text style={styles.progressPercentage}>
                    {task ? (
                      <>
                        <Text style={styles.currentExpText}>
                          {calculateTotalEarnedExp(
                            task.level,
                            task.experience.current
                          ).toLocaleString()}
                        </Text>
                        <Text> / </Text>
                        <Text style={styles.totalExpText}>
                          {calculateTotalExpToLevel(
                            nextSkill.level
                          ).toLocaleString()}
                        </Text>
                        <Text> 経験値</Text>
                      </>
                    ) : (
                      "0 / 0 経験値"
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 次回リリースで実装予定のクエスト機能 */}
        {/* 
        <View style={styles.questsSection}>
          <Text style={styles.sectionTitle}>クエスト</Text>
          {quests.map((quest, index) => (
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
        */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171923",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 16 : 0,
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
    marginBottom: 4,
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
    backgroundColor: "#2A2F45",
    borderRadius: 8,
    padding: 16,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  skillLevel: {
    color: "#FFD700",
    fontSize: 14,
  },
  skillDescription: {
    color: "#8F95B2",
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "#8F95B2",
    fontSize: 13,
    fontWeight: "bold",
  },
  progressBarWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  progressBar: {
    height: 14,
    backgroundColor: "#21263B",
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2F45",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 7,
    position: "relative",
    overflow: "hidden",
  },
  progressShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  progressPercentage: {
    color: "#FFD700",
    fontSize: 12,
    textAlign: "center",
  },
  currentExpText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  totalExpText: {
    color: "#FFA500",
    fontWeight: "bold",
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatsService } from "../services/StatsService";
import { Session } from "../types/stats";
import {
  getAcquiredSkills,
  getNextSkill,
  SkillDefinition,
} from "../data/skills";
import {
  calculateProgressToSkillLevel,
  calculateTotalEarnedExp,
  calculateTotalExpToLevel,
} from "../utils/levelUtils";
import { statsScreenStyles } from "../styles/components/StatsScreen.styles";
import { StatsScreenProps } from "../types/components/StatsScreen.types";

// 日本語の職業名から英語のジョブタイプを取得するマッピング
const JOB_NAME_TO_ID: Record<string, string> = {
  戦士: "warrior",
  魔法使い: "mage",
  僧侶: "priest",
  賢者: "sage",
};

// 英語のジョブタイプから日本語の職業名を取得するマッピング
// const JOB_ID_TO_NAME = {
//   warrior: "戦士",
//   mage: "魔法使い",
//   priest: "僧侶",
//   sage: "賢者",
// };

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
    <SafeAreaView style={statsScreenStyles.container}>
      <TouchableOpacity style={statsScreenStyles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#8F95B2" />
        <Text style={statsScreenStyles.backButtonText}>戻る</Text>
      </TouchableOpacity>

      <ScrollView
        style={statsScreenStyles.scrollContainer}
        contentContainerStyle={statsScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={statsScreenStyles.header}>
          <Text style={statsScreenStyles.title}>{task?.name || "タスク"}</Text>

          {/* レベルと職業の表示を改善 */}
          <View style={statsScreenStyles.levelJobContainer}>
            <View style={statsScreenStyles.levelContainer}>
              <Text style={statsScreenStyles.levelLabel}>レベル</Text>
              <Text style={statsScreenStyles.levelValue}>
                {task?.level || 1}
              </Text>
            </View>
            <View style={statsScreenStyles.jobContainer}>
              <Text style={statsScreenStyles.jobLabel}>職業</Text>
              <Text style={statsScreenStyles.jobValue}>
                {task?.job?.type || "冒険者"}
              </Text>
            </View>
          </View>

          {/* 次回リリースで実装予定の機能
          <Text style={statsScreenStyles.subtitle}>
            {task?.job?.bonus || ""}
          </Text>
          */}
        </View>

        <View style={statsScreenStyles.statsContainer}>
          <View style={statsScreenStyles.statBox}>
            <Text style={statsScreenStyles.statValue}>{completedSessions}</Text>
            <Text style={statsScreenStyles.statLabel}>完了セッション</Text>
          </View>
          <View style={statsScreenStyles.statBox}>
            <Text style={statsScreenStyles.statValue}>{totalTime}</Text>
            <Text style={statsScreenStyles.statLabel}>総学習時間</Text>
          </View>
        </View>

        {/* 習得済みスキルセクション */}
        {acquiredSkills.length > 0 && (
          <View style={statsScreenStyles.skillsSection}>
            <Text style={statsScreenStyles.sectionTitle}>習得済みスキル</Text>
            {acquiredSkills.map((skill, index) => (
              <View key={index} style={statsScreenStyles.skillItem}>
                <View style={statsScreenStyles.skillHeader}>
                  <Text style={statsScreenStyles.skillName}>{skill.name}</Text>
                  <Text style={statsScreenStyles.skillLevel}>
                    Lv.{skill.level}で習得
                  </Text>
                </View>
                <Text style={statsScreenStyles.skillDescription}>
                  {skill.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 次に習得するスキルセクション */}
        {nextSkill && (
          <View style={statsScreenStyles.skillsSection}>
            <Text style={statsScreenStyles.sectionTitle}>習得中のスキル</Text>
            <View style={statsScreenStyles.skillItem}>
              <View style={statsScreenStyles.skillHeader}>
                <Text style={statsScreenStyles.skillName}>
                  {nextSkill.name}
                </Text>
                <Text style={statsScreenStyles.skillLevel}>
                  Lv.{nextSkill.level}で習得
                </Text>
              </View>
              <Text style={statsScreenStyles.skillDescription}>
                {nextSkill.description}
              </Text>
              <View style={statsScreenStyles.progressBarContainer}>
                <View style={statsScreenStyles.progressTextContainer}>
                  <Text style={statsScreenStyles.progressText}>
                    習得まで: {Math.round(progressToNextSkill)}%
                  </Text>
                  <Text style={statsScreenStyles.progressText}>
                    残り経験値: {remainingExp.toLocaleString()}
                  </Text>
                </View>
                <View style={statsScreenStyles.progressBarWrapper}>
                  <View style={statsScreenStyles.progressBar}>
                    <View
                      style={[
                        statsScreenStyles.progressFill,
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
                      <View style={statsScreenStyles.progressShine}></View>
                    </View>
                  </View>
                  <Text style={statsScreenStyles.progressPercentage}>
                    {task ? (
                      <>
                        <Text style={statsScreenStyles.currentExpText}>
                          {calculateTotalEarnedExp(
                            task.level,
                            task.experience.current
                          ).toLocaleString()}
                        </Text>
                        <Text> / </Text>
                        <Text style={statsScreenStyles.totalExpText}>
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

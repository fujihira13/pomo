import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setFirstLaunchComplete } from "../utils/storage";

interface AppGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({
  visible,
  onClose,
}) => {
  const { height } = useWindowDimensions();

  const handleClose = async () => {
    // 初回起動フラグを保存
    await setFirstLaunchComplete();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { maxHeight: height * 0.8 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>アプリの使い方</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#8F95B2" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="time-outline" size={20} color="#ffa500" />{" "}
                ポモドーロテクニックについて
              </Text>
              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>1</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>集中して作業する</Text>
                  <Text style={styles.guideDescription}>
                    25分間の集中作業を行い、その後5分間の休憩を取ります。これを繰り返すことで効率的に作業を進められます。
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>2</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>短い休憩と長い休憩</Text>
                  <Text style={styles.guideDescription}>
                    4セットごとに、より長い休憩（15～30分）を取ります。これにより、継続的かつ持続可能な作業が可能になります。
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="star-outline" size={20} color="#ffa500" />{" "}
                RPG要素の活用方法
              </Text>
              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>1</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>タスクを作成</Text>
                  <Text style={styles.guideDescription}>
                    「プログラミング学習」や「英語学習」など、取り組みたい作業をタスクとして登録します。それぞれのタスクに職業（戦士、魔法使いなど）を設定できます。
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>2</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>経験値を獲得</Text>
                  <Text style={styles.guideDescription}>
                    セッションを完了するごとに経験値が獲得できます。経験値が一定量たまるとレベルアップします。
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>3</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>スキルを習得</Text>
                  <Text style={styles.guideDescription}>
                    レベルに応じて様々なスキルを習得できます。
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#ffa500"
                />{" "}
                アプリ使用時の注意点
              </Text>
              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>1</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>アプリは表示したまま</Text>
                  <Text style={styles.guideDescription}>
                    ポモドーロ実行中はアプリを画面に表示したまま画面は閉じないでください。他のアプリに切り替えるとタイマーが正確に動作しません。
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>2</Text>
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>注意散漫を避ける</Text>
                  <Text style={styles.guideDescription}>
                    セッション中は通知をオフにし、スマートフォンを触らないことをおすすめします。これにより、深い集中状態を維持できます。
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.warningBox}>
              <View style={styles.redLine}></View>
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>重要</Text>
                <Text style={styles.warningText}>
                  タイマー実行中に画面を閉じたり、他のアプリに切り替えたりするとタイマーが一時停止します。タイマー実行中は画面のスリープを防止する機能を搭載していますので、電池の消費にご注意ください。これは、最大限の集中を促すための仕様です。
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.startButton} onPress={handleClose}>
            <Text style={styles.startButtonText}>
              理解しました！始めましょう
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    padding: 0,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2D3748",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffa500",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2D3748",
  },
  guideItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  guideNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffa500",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  guideNumberText: {
    color: "#1E293B",
    fontWeight: "bold",
    fontSize: 16,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    color: "#A0AEC0",
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: "#2A1A20",
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    flexDirection: "row",
    overflow: "hidden",
  },
  redLine: {
    width: 4,
    backgroundColor: "#FF0033",
  },
  warningContent: {
    padding: 16,
    flex: 1,
  },
  warningTitle: {
    color: "#FF0033",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  warningText: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: "#ffa500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  startButtonText: {
    color: "#1E293B",
    fontWeight: "bold",
    fontSize: 16,
  },
});

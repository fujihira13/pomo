import type { IconName } from "../types/models/IconName";

// TaskTypeの型定義
export interface TaskType {
  id: string;
  icon: IconName;
  label: string;
}

// JobIconNameの型定義
export type JobIconName =
  | "shield-outline"
  | "flash-outline"
  | "heart-outline"
  | "school-outline";

// JobTypeの型定義
export interface JobType {
  id: string;
  icon: JobIconName;
  name: string;
  // 次回リリースで実装予定の機能
  // bonus?: string;
  // description?: string;
  // tags?: string[];
}

/**
 * アプリケーションで使用するタスクタイプのリストを取得する
 * @returns タスクタイプの配列
 */
export const getTaskTypes = (): TaskType[] => {
  return [
    { id: "programming", icon: "code-outline", label: "プログラミング" },
    { id: "reading", icon: "book-outline", label: "読書" },
    { id: "game", icon: "barbell-outline", label: "運動" },
    { id: "music", icon: "musical-notes-outline", label: "音楽" },
    { id: "art", icon: "color-palette-outline", label: "アート" },
    { id: "study", icon: "time-outline", label: "学習" },
  ];
};

/**
 * アプリケーションで使用する職業タイプのリストを取得する
 * @returns 職業タイプの配列
 */
export const getJobTypes = (): JobType[] => {
  return [
    {
      id: "warrior",
      icon: "shield-outline",
      name: "戦士",
      // 次回リリースで実装予定の機能
      // bonus: "集中力持続時間+20%",
      // description: "長時間の学習に強い、集中力の高さが魅力。",
      // tags: ["根性の一撃", "集中力の極"],
    },
    {
      id: "mage",
      icon: "flash-outline",
      name: "魔法使い",
      // 次回リリースで実装予定の機能
      // bonus: "集中経験値+30%",
      // description: "知識の吸収力が高い、より多くの経験値を獲得。",
      // tags: ["知恵の魔法", "記憶強化"],
    },
    {
      id: "priest",
      icon: "heart-outline",
      name: "僧侶",
      // 次回リリースで実装予定の機能
      // bonus: "回復力+40%",
      // description: "体感効果が高い、集中学習でも疲れにくい。",
      // tags: ["癒しの力", "精神統一"],
    },
    /* 次回リリースで「賢者」職業を実装予定
    {
      id: "sage",
      icon: "school-outline",
      name: "賢者",
      bonus: "スキル習得速度+25%",
      description: "新しい技術の習得が早い、複数の分野に強い。",
      tags: ["全知の眼", "習得加速"],
    },
    */
  ];
};

/**
 * 編集時の初期職業タイプを取得する
 * @param jobType 現在の職業タイプ
 * @returns 適切な職業タイプ
 */
export const getInitialJobType = (jobType?: string): string => {
  // 「賢者」は次回リリースで実装予定のため、一時的に「魔法使い」に設定
  return jobType === "sage" ? "mage" : jobType || "";
};

// スキルシステムの定義ファイル

export interface SkillDefinition {
  name: string; // スキル名
  level: number; // 習得レベル
  description: string; // スキルの説明
}

// 各職業ごとのスキル定義
export const JOB_SKILLS: Record<string, SkillDefinition[]> = {
  // 戦士のスキル
  warrior: [
    {
      name: "ブレイブチャージ",
      level: 3,
      description: "連続する集中の流れを生み出す不屈の力",
    },
    {
      name: "ドーンブレイカー",
      level: 5,
      description: "朝の清々しい精神で放つ覚醒の一撃",
    },
    {
      name: "タクティカルマインド",
      level: 8,
      description: "戦況を冷静に分析し最適解を導き出す眼力",
    },
    {
      name: "アイアンウィル",
      level: 12,
      description: "どんな妨害も跳ね返す折れない精神力",
    },
    {
      name: "オーバーリミッター",
      level: 16,
      description: "自らの限界を打ち破る究極の覚醒技",
    },
    {
      name: "フューリアスハート",
      level: 20,
      description: "眠れる戦士の魂を呼び覚ます猛烈な闘気",
    },
    {
      name: "ヴァルハラソウル",
      level: 25,
      description: "伝説の戦士にのみ許された不滅の奥義",
    },
  ],

  // 魔法使いのスキル
  mage: [
    {
      name: "アルカナサージ",
      level: 3,
      description: "魔力を瞬時に増幅させる神秘術",
    },
    {
      name: "カオスレイン",
      level: 5,
      description: "予測不能な魔力の雨を降らせる混沌の術",
    },
    {
      name: "フォービドゥングリモア",
      level: 8,
      description: "禁断の魔道書に秘密を記録する封印術",
    },
    {
      name: "ペンタエレメンタル",
      level: 12,
      description: "五大元素を完全に操る上級魔法",
    },
    {
      name: "クロノディストーション",
      level: 16,
      description: "時空の歪みを生み出す時間操作魔法",
    },
    {
      name: "インフィニティブラスト",
      level: 20,
      description: "全ての制限を解除する禁断の魔術",
    },
    {
      name: "アポカリプスコード",
      level: 25,
      description: "世界を一瞬で書き換える創造と破壊の極致",
    },
  ],

  // 僧侶のスキル
  priest: [
    {
      name: "セレスティアルハーモニー",
      level: 3,
      description: "天上から降り注ぐ癒しの波動",
    },
    {
      name: "セプタゴンサークル",
      level: 5,
      description: "7日間の祈りが結実する神聖な法陣",
    },
    {
      name: "アストラルメディテーション",
      level: 8,
      description: "肉体を超えて星々と繋がる瞑想法",
    },
    {
      name: "オーラレストレーション",
      level: 12,
      description: "生命の根源から活力を引き出す再生術",
    },
    {
      name: "ディバインレゾナンス",
      level: 16,
      description: "神聖な力を分かち合う共鳴の祝福",
    },
    {
      name: "トランセンデンタルフォース",
      level: 20,
      description: "悟りの境地から解き放たれる超越力",
    },
    {
      name: "イモータルセレニティ",
      level: 25,
      description: "永遠の安らぎをもたらす究極の祈り",
    },
  ],

  // 賢者のスキル
  sage: [
    {
      name: "インテリジェンスマトリクス",
      level: 3,
      description: "情報を完璧に体系化する思考法",
    },
    {
      name: "オムニサイトビジョン",
      level: 5,
      description: "あらゆるデータを瞬時に読み解く全視の目",
    },
    {
      name: "ユニバーサルアダプター",
      level: 8,
      description: "どんな知識領域も吸収する適応能力",
    },
    {
      name: "エピファニーフィールド",
      level: 12,
      description: "深い洞察を生み出す啓示の領域",
    },
    {
      name: "ネオコアティクス",
      level: 16,
      description: "知識吸収を加速させる思考回路強化",
    },
    {
      name: "ノレッジシンギュラリティ",
      level: 20,
      description: "全ての知を一点に収束させる統合術",
    },
    {
      name: "コズミックコンシャスネス",
      level: 25,
      description: "宇宙の全知識と繋がる究極の悟り",
    },
  ],
};

// 特殊条件解放技
export const SPECIAL_SKILLS: Record<
  string,
  { condition: string; name: string; description: string }
> = {
  クワドラジェネシス: {
    condition: "全職業レベル10達成",
    name: "クワドラジェネシス",
    description: "四大職業の力を同時に解放する創生術",
  },
  クロノマスタリー: {
    condition: "100セッション達成",
    name: "クロノマスタリー",
    description: "時間を完全に支配する極意",
  },
  オムニディシプリン: {
    condition: "5種類のタスクで各10セッション",
    name: "オムニディシプリン",
    description: "あらゆる領域を制覇する万能の技",
  },
  フェニックスレゾリューション: {
    condition: "30日連続ログイン",
    name: "フェニックスレゾリューション",
    description: "不死鳥のように何度でも蘇る決意の炎",
  },
};

// 指定された職業と現在のレベルから、習得済みのスキルを取得する関数
export const getAcquiredSkills = (
  jobType: string,
  currentLevel: number
): SkillDefinition[] => {
  console.log(
    `getAcquiredSkills: jobType=${jobType}, currentLevel=${currentLevel}`
  );
  const jobSkills = JOB_SKILLS[jobType] || [];
  console.log(`${jobType}の全スキル:`, jobSkills);

  const acquiredSkills = jobSkills.filter(
    (skill) => skill.level <= currentLevel
  );
  console.log(`習得済みスキル:`, acquiredSkills);
  return acquiredSkills;
};

// 指定された職業と現在のレベルから、次に習得するスキルを取得する関数
export const getNextSkill = (
  jobType: string,
  currentLevel: number
): SkillDefinition | null => {
  console.log(`getNextSkill: jobType=${jobType}, currentLevel=${currentLevel}`);
  const jobSkills = JOB_SKILLS[jobType] || [];

  if (jobSkills.length === 0) {
    console.log(`警告: ${jobType}のスキルが見つかりません。`);
    return null;
  }

  const nextSkill = jobSkills.find((skill) => skill.level > currentLevel);
  console.log(`次のスキル:`, nextSkill);
  return nextSkill || null;
};

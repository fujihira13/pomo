/**
 * レベルごとの必要経験値を計算する関数
 * レベルが上がるにつれて必要経験値が増加する
 * @param level 現在のレベル
 * @returns 次のレベルに必要な経験値
 */
export const calculateExpForNextLevel = (level: number): number => {
  // 基本の経験値は100
  const baseExp = 100;
  // レベルが上がるごとに必要経験値が増加する倍率
  const multiplier = 1.5;

  // レベル1→2は100exp、それ以降は倍率を適用
  return Math.floor(baseExp * Math.pow(multiplier, level - 1));
};

/**
 * 経験値を更新し、必要に応じてレベルアップを行う関数
 * @param currentExp 現在の経験値
 * @param maxExp 次のレベルに必要な経験値
 * @param level 現在のレベル
 * @param expToAdd 追加する経験値
 * @returns 更新後の経験値と、レベル、レベルアップしたかどうかのフラグ
 */
export const updateExperienceAndLevel = (
  currentExp: number,
  maxExp: number,
  level: number,
  expToAdd: number
): {
  currentExp: number;
  maxExp: number;
  level: number;
  didLevelUp: boolean;
} => {
  let newCurrentExp = currentExp + expToAdd;
  let newMaxExp = maxExp;
  let newLevel = level;
  let didLevelUp = false;

  // 経験値が最大値を超えた場合、レベルアップ
  while (newCurrentExp >= newMaxExp) {
    // 余った経験値を計算
    const remainingExp = newCurrentExp - newMaxExp;

    // レベルアップ
    newLevel++;
    didLevelUp = true;

    // 次のレベルに必要な経験値を計算
    newMaxExp = calculateExpForNextLevel(newLevel);

    // 余った経験値を持ち越す
    newCurrentExp = remainingExp;
  }

  return {
    currentExp: newCurrentExp,
    maxExp: newMaxExp,
    level: newLevel,
    didLevelUp,
  };
};

/**
 * レベル1から指定したレベルまでに必要な総経験値を計算する関数
 * @param targetLevel 目標レベル
 * @returns レベル1から目標レベルまでに必要な経験値の総和
 */
export const calculateTotalExpToLevel = (targetLevel: number): number => {
  let totalExp = 0;

  // レベル1から目標レベルの手前まで必要な経験値を合計
  for (let level = 1; level < targetLevel; level++) {
    totalExp += calculateExpForNextLevel(level);
  }

  console.log(`レベル1→${targetLevel}までの総経験値: ${totalExp}`);
  return totalExp;
};

/**
 * 現在のレベルと経験値から、レベル1からの累積経験値を計算する関数
 * @param currentLevel 現在のレベル
 * @param currentExp 現在のレベルでの経験値
 * @returns レベル1から現在までの累積経験値
 */
export const calculateTotalEarnedExp = (
  currentLevel: number,
  currentExp: number
): number => {
  // レベル1から現在のレベルまでに必要だった総経験値
  const expToCurrentLevel = calculateTotalExpToLevel(currentLevel);

  // 現在のレベルでの経験値を加算
  const totalEarnedExp = expToCurrentLevel + currentExp;

  console.log(
    `レベル1から現在(Lv.${currentLevel}, ${currentExp}exp)までの累積経験値: ${totalEarnedExp}`
  );
  return totalEarnedExp;
};

/**
 * 現在のレベルから目標レベルまでに必要な合計経験値を計算する関数
 * @param currentLevel 現在のレベル
 * @param targetLevel 目標レベル
 * @returns 必要な合計経験値
 */
export const calculateTotalExpToTargetLevel = (
  currentLevel: number,
  targetLevel: number
): number => {
  if (currentLevel >= targetLevel) return 0;

  let totalExp = 0;

  // デバッグ: パラメータの出力
  console.log(
    `calculateTotalExpToTargetLevel: currentLevel=${currentLevel}, targetLevel=${targetLevel}`
  );

  // 現在のレベルから目標レベルまでの各レベルで必要な経験値を合計
  for (let level = currentLevel; level < targetLevel; level++) {
    const expForLevel = calculateExpForNextLevel(level);
    totalExp += expForLevel;
    console.log(
      `レベル${level}→${
        level + 1
      }に必要な経験値: ${expForLevel}, 累積経験値: ${totalExp}`
    );
  }

  console.log(`目標レベル${targetLevel}までの必要総経験値: ${totalExp}`);
  return totalExp;
};

/**
 * 現在の状態から次のスキルレベルまでの進捗を計算する関数
 * @param currentLevel 現在のレベル
 * @param currentExp 現在のレベルでの経験値
 * @param maxExp 現在のレベルで次のレベルに上がるのに必要な経験値
 * @param targetLevel 目標レベル（スキル習得レベル）
 * @returns 進捗情報（パーセンテージと必要な残り経験値）
 */
export const calculateProgressToSkillLevel = (
  currentLevel: number,
  currentExp: number,
  maxExp: number,
  targetLevel: number
): { progressPercentage: number; remainingExp: number } => {
  // デバッグ: パラメータの出力
  console.log(
    `calculateProgressToSkillLevel: currentLevel=${currentLevel}, currentExp=${currentExp}, maxExp=${maxExp}, targetLevel=${targetLevel}`
  );

  // 既に目標レベルに達している場合
  if (currentLevel >= targetLevel) {
    console.log("既に目標レベル達成済み: 進捗率=100%, 残り経験値=0");
    return { progressPercentage: 100, remainingExp: 0 };
  }

  // レベル1から目標レベルまでに必要な総経験値
  const totalExpToTargetLevel = calculateTotalExpToLevel(targetLevel);

  // レベル1から現在までの累積獲得経験値
  const totalEarnedExp = calculateTotalEarnedExp(currentLevel, currentExp);

  // 残りの必要経験値
  const remainingExp = totalExpToTargetLevel - totalEarnedExp;

  // 進捗率（パーセンテージ）
  const progressPercentage = Math.min(
    100,
    Math.max(0, (totalEarnedExp / totalExpToTargetLevel) * 100)
  );

  console.log(
    `進捗情報: 目標レベルまでの総経験値=${totalExpToTargetLevel}, 獲得済み累積経験値=${totalEarnedExp}, 残り経験値=${remainingExp}, 進捗率=${progressPercentage}%`
  );

  return { progressPercentage, remainingExp };
};

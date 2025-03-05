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

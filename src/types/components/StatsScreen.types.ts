import { Task } from "../models/Task";

export interface StatsScreenProps {
  onBack: () => void;
  taskId?: string; // タスクIDを追加（オプショナル）
  task?: Task; // タスク情報を追加
}

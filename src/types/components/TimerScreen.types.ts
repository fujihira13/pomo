import { Task } from "../models/Task";

export interface TimerScreenProps {
  task: Task;
  onBack: () => void;
  onShowStats: () => void;
}

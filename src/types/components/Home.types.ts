import { Task } from "../models/Task";

export interface HomeProps {
  onTaskSelect: (task: Task) => void;
  onNewTask: () => void;
  onShowStats: () => void;
}

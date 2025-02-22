import { Task } from "../models/Task";

export interface HomeProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
  onShowStats: () => void;
}

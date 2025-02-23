import { Task } from "../models/Task";

export interface HomeProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onNewTask: () => void;
  onShowStats: (tasks: Task[]) => void;
}

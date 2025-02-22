import { Task } from "../models/Task";

export interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

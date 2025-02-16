import { Task } from "../models/Task";

export interface TaskListProps {
  onTaskSelect: (task: Task) => void;
}

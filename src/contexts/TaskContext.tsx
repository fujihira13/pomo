import React, { createContext, useState } from "react";
import type { Task } from "../components/TaskList";

type TaskContextType = {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

export const TaskContext = createContext<TaskContextType>({
  selectedTask: null,
  setSelectedTask: () => {},
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <TaskContext.Provider value={{ selectedTask, setSelectedTask }}>
      {children}
    </TaskContext.Provider>
  );
};

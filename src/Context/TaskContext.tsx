import React, { createContext, useContext, useState } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  start: Date;
  end: Date;
}

export interface TaskTimer {
  id: number;
  duration: number;
  timerType: 1 | 0;
  timerState: 1 | 0;
  studyTaskId: number;
}

export enum TaskPriority {
  "High",
  "Medium",
  "Low",
}

export enum TaskStatus {
  "Pending",
  "OnGoing",
  "Completed",
  "Expired",
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};

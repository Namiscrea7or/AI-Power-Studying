import React, { createContext, useContext, useState } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  start: Date;
  end: Date;
  progressTime: number;
}

export enum TaskPriority {
  "High",
  "Medium",
  "Low",
}

export enum TaskStatus {
  "Completed",
  "OnGoing",
  "Pending",
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "HEHE",
      description: "hehe",
      priority: TaskPriority.Medium,
      status: TaskStatus["OnGoing"],
      start: new Date("2024-12-11T09:00"),
      end: new Date("2024-12-11T15:00"),
    },
  ]);

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

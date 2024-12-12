import React, { createContext, useContext, useState } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: number;
  status: "Completed" | "In Progress" | "Pending";
  start: string;
  end: string;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "HEHE",
      description: "hehe",
      priority: "Medium",
      estimatedTime: 2,
      status: "In Progress",
      start: "2024-12-11 09:00",
      end: "2024-12-11 15:00",
    },
    {
      id: 2,
      title: "Task 2",
      description: "t2",
      priority: "High",
      estimatedTime: 3,
      status: "Pending",
      start: "2024-12-13 08:00",
      end: "2024-12-14 15:00",
    },
    {
      id: 3,
      title: "High Task",
      description: "high vl",
      priority: "High",
      estimatedTime: 1,
      status: "Completed",
      start: "2024-12-11 08:00",
      end: "2024-12-11 20:00",
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
  if (!context) throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};
import React, { createContext, useContext, useState } from "react";

interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  status: "Pending" | "In Progress" | "Completed";
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
      name: "Sample Task",
      description: "This is a sample task",
      priority: "Medium",
      estimatedTime: "2 hours",
      status: "Pending",
    },
    {
      id: 2,
      name: "Another Task",
      description: "This is another task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "In Progress",
    },
    {
      id: 3,
      name: "gei Task",
      description: "This is gei task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "Pending",
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

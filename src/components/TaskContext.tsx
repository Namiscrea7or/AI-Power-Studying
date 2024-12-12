import React, { createContext, useContext, useState } from "react";

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  status: "Completed" | "In Progress" | "Pending";
  startDate?: Date;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTaskStartDate: (taskId: number, newStartDate: Date) => void;
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
      startDate: new Date("2024-12-10T09:00:00Z"),
    },
    {
      id: 2,
      name: "Another Task",
      description: "This is another task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "In Progress",
      startDate: new Date("2024-12-11T14:00:00Z"),
    },
    {
      id: 3,
      name: "Gei Task",
      description: "This is gei task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "Pending",
      startDate: new Date("2024-12-12T10:00:00Z"),
    },
  ]);

  // Update the start date of the task after it is dropped
  const updateTaskStartDate = (taskId: number, newStartDate: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, startDate: newStartDate } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTaskStartDate }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};

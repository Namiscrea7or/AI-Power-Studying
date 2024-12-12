import React, { createContext, useContext, useState } from "react";
import { formatISO } from 'date-fns';

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  status: "Completed" | "In Progress" | "Pending";
  startDate?: string; // Kiểu dữ liệu là string
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
      startDate: '2024-12-10', // Sử dụng YYYY-MM-DD
    },
    {
      id: 2,
      name: "Another Task",
      description: "This is another task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "In Progress",
      startDate: '2024-12-11', // Sử dụng YYYY-MM-DD
    },
    {
      id: 3,
      name: "Gei Task",
      description: "This is gei task",
      priority: "High",
      estimatedTime: "1 hour",
      status: "Pending",
      startDate: '2024-12-12', // Sử dụng YYYY-MM-DD
    },
  ]);

  // Update the start date of the task after it is dropped
  const updateTaskStartDate = (taskId: number, newStartDate: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, startDate: formatISO(newStartDate, { representation: 'date' }) }
          : task
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
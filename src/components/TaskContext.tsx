import React, { createContext, useContext, useState } from "react";

interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: number;
  status: "Pending" | "In Progress" | "Completed";
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Sample Task",
      description: "This is a sample task",
      priority: "Medium",
      estimatedTime: 2,
      status: "Pending",
    },
    {
      id: 2,
      name: "Another Task",
      description: "This is another task",
      priority: "High",
      estimatedTime: 1,
      status: "In Progress",
    },
  ]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};

export { TaskProvider, useTaskContext, Task };

import React from "react";
import { cn } from "../utils/cn.tsx";
import { GoPlus } from "react-icons/go";
import TaskCard from "./TaskCard.tsx";

type TaskColumnProps = {
  title: string;
  tasks: any;
  color: Color;
  onAddTask?: () => void;
};

enum Color {
  Blue,
  Orange,
  Green,
}

const colors = {
  [Color.Blue]: {
    bg: "bg-blue-400",
    border: "border-blue-400",
  },
  [Color.Orange]: {
    bg: "bg-orange-400",
    border: "border-orange-400",
  },
  [Color.Green]: {
    bg: "bg-green-400",
    border: "border-green-400",
  },
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  color,
  onAddTask,
}) => {
  return (
    <div className="lg:flex-shrink-1 w-full lg:w-1/3 p-4 bg-[#f5f5f5] rounded-lg">
      <div className="w-full flex items-center mb-1">
        <div className={cn(`w-4 h-4 rounded-full me-2`, colors[color].bg)} />
        {title !== "To Do" ? (
          <h3 className="text-xl font-bold">{title}</h3>
        ) : (
          <div className="flex-grow flex justify-between items-center">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onAddTask}
              className="bg-blue-200 hover:bg-blue-600 p-1 text-blue-500 hover:text-white rounded flex items-center justify-center">
              <GoPlus />
            </button>
          </div>
        )}
      </div>
      <div className={cn(`mb-4 border`, colors[color].border)} />
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export { TaskColumn, Color };
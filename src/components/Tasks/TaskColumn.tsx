import React, { useState } from "react";
import { cn } from "../../utils/cn.tsx";
import { GoPlus } from "react-icons/go";
import TaskCard from "./TaskCard.tsx";
import { Task, useTaskContext } from "../../Context/TaskContext.tsx";
import TaskInputForm from "./TaskInputForm.tsx";
import * as taskService from "../../services/TaskServices.ts";
import { toast } from "react-toastify";

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  color: Color;
  onAddTask?: () => void;
};

enum Color {
  Blue,
  Orange,
  Green,
  Red,
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
  [Color.Red]: {
    bg: "bg-red-400",
    border: "border-red-400",
  },
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  color,
  onAddTask,
}) => {
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const { setTasks } = useTaskContext();

  const handleEdit = async (updatedTask: Task): Promise<boolean> => {
    try {
      const savedTask = await taskService.updateTask(updatedTask);
      if (savedTask) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );

        setCurrentTask(undefined);
        return true;
      }

      toast.error(`Task not found or has been deleted!`, {
        ariaLabel: "Edit task failed",
      });
      return false;
    } catch (error) {
      toast.error(
        <div>
          <label className="font-bold">Edit Task Failed</label>
          <p> Please try again later!</p>
        </div>
      );
      return false;
    }
  };

  return (
    <div className="w-full lg:w-1/4 p-4 bg-[#f5f5f5] rounded-lg">
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
      {tasks.length === 0}
      {tasks.map((task) => (
        <TaskCard
          onClick={() => setCurrentTask(task)}
          key={task.id}
          task={task}
        />
      ))}
      {currentTask && (
        <TaskInputForm
          task={currentTask}
          onSubmit={handleEdit}
          onCancel={() => setCurrentTask(undefined)}
        />
      )}
    </div>
  );
};

export { TaskColumn, Color };

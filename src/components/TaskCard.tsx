import React from "react";
import { Task, useTaskContext } from "./TaskContext.tsx";
import { AiOutlineDelete } from "react-icons/ai";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
}

const taskPriority = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-700",
};

const TaskCard: React.FC<TaskCardProps> = ({ task, ...props }) => {
  const { setTasks } = useTaskContext();

  const deleteTask = (id: number) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <div {...props} className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{task.name}</h4>
        {task.priority && (
          <span
            className={`text-sm px-2 py-1 rounded ${
              taskPriority[task.priority]
            }`}>
            {task.priority}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2">{task.description}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div>Estimated time: {task.estimatedTime}</div>
        <div className="flex">
          <button
            onClick={handleDeleteClick}
            className="text-red-500 bg-red-100 hover:bg-red-300 p-1 rounded">
            <AiOutlineDelete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

import React from "react";
import {
  Task,
  TaskPriority,
  useTaskContext,
} from "../../Context/TaskContext.tsx";
import { AiOutlineDelete } from "react-icons/ai";
import * as taskService from "../../services/TaskServices.ts";

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
  console.log(task.start);
  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((tasks) => tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <div {...props} className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{task.title}</h4>
        <span
          className={`text-sm px-2 py-1 rounded ${
            taskPriority[TaskPriority[task.priority]]
          }`}>
          {TaskPriority[task.priority]}
        </span>
      </div>
      <hr className="my-2" />
      <p className="text-sm text-gray-600">
        <b>Start:</b> {task?.start?.toLocaleString() ?? "Not set"}
      </p>
      <p className="text-sm text-gray-600 my-2">
        <b>Description: </b>
        {task.description}
      </p>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div>Due: {task?.end?.toLocaleString() ?? "Not set"}</div>
        <button
          onClick={handleDeleteClick}
          className="text-red-500 bg-red-100 hover:bg-red-300 p-1 rounded">
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

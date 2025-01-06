import React, { useState } from "react";
import {
  Task,
  TaskPriority,
  useTaskContext,
} from "../../Context/TaskContext.tsx";
import { AiOutlineDelete } from "react-icons/ai";
import * as taskService from "../../services/TaskServices.ts";
import TimerPopup from "./TimerPopup.tsx";
import { toast } from "react-toastify";
import { PiTimer } from "react-icons/pi";

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
  const [showTimer, setShowTimer] = useState(false);

  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((tasks) => tasks.filter((t) => t.id !== id));
    } catch (error) {
      toast.error(
        <div>
          <label className="font-bold">Delete Task Failed</label>
          <p> Please try again later!</p>
        </div>
      );
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTimer(true);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((tasks) =>
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  return (
    <div {...props} className="bg-white shadow rounded-lg p-4 mb-4 relative">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{task.title}</h4>
        <div className="flex gap-2">
          <button
            onClick={handleTimerClick}
            className="text-blue-500 bg-blue-100 hover:bg-blue-300 p-1 rounded">
            <PiTimer />
          </button>
          <div
            className={`text-sm px-2 py-1 rounded ${
              taskPriority[TaskPriority[task.priority]]
            }`}>
            {TaskPriority[task.priority]}
          </div>
        </div>
      </div>
      <hr className="my-2" />
      <p className="text-sm text-gray-600">
        <b>Start:</b> {task?.start?.toLocaleString() ?? "Not set"}
      </p>
      <p className="text-sm text-gray-600 my-2 break-words line-clamp-3">
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
      {showTimer && (
        <div onClick={(e) => e.stopPropagation()}>
          <TimerPopup
            task={task}
            onClose={() => setShowTimer(false)}
            updateTask={updateTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;

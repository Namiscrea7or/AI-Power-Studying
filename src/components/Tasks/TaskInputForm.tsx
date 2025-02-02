import React, { useEffect, useRef, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "../../Context/TaskContext.tsx";
import { toast } from "react-toastify";

type TaskInputFormProps = {
  task?: Task;
  onSubmit: (task: Task) => Promise<boolean>;
  onCancel: () => void;
};

const TaskInputForm: React.FC<TaskInputFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const [title, setTitle] = useState<string>(task?.title ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? TaskPriority.Low
  );
  const [description, setDescription] = useState<string>(
    task?.description ?? ""
  );
  const [start, setStart] = useState<Date>(task?.start ?? new Date());
  const [end, setEnd] = useState<Date>(task?.end ?? new Date());
  const [status, setStatus] = useState<TaskStatus>(
    task?.status ?? TaskStatus.Pending
  );

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPriority(TaskPriority.Low);
    setStatus(TaskStatus.Pending);
    setStart(new Date());
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title) return;

    const newTask: Task = {
      id: task?.id ?? -1,
      title,
      priority,
      description,
      start,
      end,
      status,
    };

    try {
      const success = await onSubmit(newTask);
      if (success) clearForm();
    } catch (error) {
      toast.error(
        <div>
          <label className="font-bold">Add Task Failed</label>
          <p> Please try again later!</p>
        </div>
      );
    }
  };

  function formatDateToLocalDatetime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // Return formatted date as YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-h-[80%] overflow-y-auto p-6 rounded-lg shadow-lg w-2/3 lg:w-1/3">
        <h2 className="text-xl font-semibold mb-4">
          {task ? "Task Detail" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={title}
              ref={inputRef}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                value={formatDateToLocalDatetime(start)}
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => {
                  setStart(new Date(e.target.value));
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                value={formatDateToLocalDatetime(end)}
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => {
                  setEnd(new Date(e.target.value));
                }}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                className="w-full p-2 border rounded"
                value={TaskPriority[priority]}
                onChange={(e) => setPriority(TaskPriority[e.target.value])}>
                <option value={"Low"}>Low</option>
                <option value={"Medium"}>Medium</option>
                <option value={"High"}>High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full p-2 border rounded"
                value={TaskStatus[status]}
                onChange={(e) => setStatus(TaskStatus[e.target.value])}>
                <option value={"Pending"}>To Do</option>
                <option value={"OnGoing"}>In Progress</option>
                <option value={"Completed"}>Completed</option>
                <option value={"Expired"}>Expired</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded">
              {task ? "Update Task" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskInputForm;

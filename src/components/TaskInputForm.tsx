import React, { useState } from "react";

type TaskInputFormProps = {
  task?: any;
  onSubmit: (task: any) => void;
  onCancel: () => void;
};

const TaskInputForm: React.FC<TaskInputFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "Low");
  const [description, setDescription] = useState(task?.description ?? "");
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime ?? "");
  const [start, setStart] = useState(task?.start ?? "");
  const [status, setStatus] = useState(task?.status ?? "");

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setEstimatedTime("");
    setPriority("Low");
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
      id: task?.id ?? undefined,
      title,
      priority,
      description,
      estimatedTime,
      start,
      status,
    };

    clearForm();
    onSubmit(newTask);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Estimated time
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={
                isNaN(parseInt(estimatedTime)) ? "" : parseInt(estimatedTime)
              }
              onChange={(e) => setEstimatedTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              value={start.replace(" ", "T")}
              type="datetime-local"
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => {
                setStart(e.target.value.replace("T", " "));
              }}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
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

import React, { useState } from "react";

interface TaskFormProps {
  task?: {
    id?: number;
    title: string;
    description: string;
    priority: string;
    estimatedTime: string;
    status: string;
    start: string;
    end: string;
  };
  onSave: (task: any) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [name, setName] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime || "");
  const [status, setStatus] = useState(task?.status || "Pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: task?.id, name, description, priority, estimatedTime, status });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded">
      <div className="mb-2">
        <label className="block">Task Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Estimated Time</label>
        <input
          type="text"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-500 text-white p-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
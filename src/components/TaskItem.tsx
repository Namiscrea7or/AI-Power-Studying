import React from "react";

interface TaskItemProps {
  task: {
    id: number;
    name: string;
    description: string;
    priority: string;
    estimatedTime: string;
    status: string;
  };
  onEdit: () => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-white p-4 border rounded mb-2">
      <div>
        <h3 className="font-bold">{task.name}</h3>
        <p>{task.description}</p>
        <p>
          Priority: {task.priority}, Status: {task.status}
        </p>
        <p>Estimated Time: {task.estimatedTime}</p>
      </div>
      <div className="flex gap-2">
        <button className="bg-yellow-500 text-white p-2 rounded" onClick={onEdit}>
          Edit
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
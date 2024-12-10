import React from "react";

const TaskCard = ({ task }) => (
  <div className="bg-white shadow rounded-lg p-4 mb-4">
    <div className="flex justify-between items-center">
      <h4 className="text-lg font-semibold">{task.title}</h4>
      {task.priority && (
        <span
          className={`text-sm px-2 py-1 rounded ${
            task.priority === "High"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}>
          {task.priority}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
      <div>Due: {task.due}</div>
    </div>
  </div>
);

export default TaskCard;

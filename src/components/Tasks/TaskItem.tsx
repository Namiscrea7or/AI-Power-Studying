// TaskItem.tsx
import React from "react";
import { Task, TaskPriority, useTaskContext } from "../../Context/TaskContext.tsx";
import { colors, Color } from "../../utils/Color";
import { AiOutlineDelete } from "react-icons/ai";

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    color: Color;
}
const taskPriority = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-blue-100 text-blue-700",
    Low: "bg-gray-100 text-gray-700",
};

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onEdit,
    onDelete,
    color,
}) => {
    const { setTasks } = useTaskContext();
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task.id);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">{task.title}</h4>
                <span
                    className={`text-sm px-2 py-1 rounded ${taskPriority[TaskPriority[task.priority]]
                        }`}>
                    {TaskPriority[task.priority]}
                </span>
            </div>
            <hr className="my-2" />
            <p className="text-sm text-gray-600">
                Start Date: {task.start ? task.start.toLocaleString() : "No start date"}
            </p>
            <p className="text-sm text-gray-600 my-2">
                <b>Description: </b>
                {task.description}
            </p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>End Date: {task.end ? task.end.toLocaleString() : "No end date"}
                    <button
                        onClick={handleDeleteClick}
                        className="text-red-500 bg-red-100 hover:bg-red-300 p-1 rounded"
                    >
                        <AiOutlineDelete />
                    </button>
                    <button
                        className="bg-yellow-500 text-white p-2 rounded"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
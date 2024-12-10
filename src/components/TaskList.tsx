import React, { useState } from "react";
import TaskForm from "./TaskForm.tsx";
import TaskItem from "./TaskItem.tsx";
import { useTaskContext } from "./TaskContext.tsx";

interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  status: "Pending" | "In Progress" | "Completed";
}

const TaskList: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("priority");
  const [search, setSearch] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, setTasks } = useTaskContext();

  const addTask = (task: Task) => { // change later
    setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingTask(null);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) => (filter === "all" ? true : task.status === filter))
    .filter((task) => task.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === "priority" ? b.priority.localeCompare(a.priority) : 0));

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select className="border p-2 rounded" onChange={(e) => setSort(e.target.value)}>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {editingTask ? (
        <TaskForm
          task={editingTask}
          onSave={updateTask}
          onCancel={() => setEditingTask(null)}
        />
      ) : (
        <TaskForm onSave={addTask} />
      )}

      <ul className="mt-4">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={() => setEditingTask(task)}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

import React, { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineSort } from "react-icons/md";
import { TaskColumn, Color } from "../Tasks/TaskColumn";
import { useTaskContext } from "../../Context/TaskContext";

const TaskInputForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && due) {
      const newTask = {
        id: Date.now(),
        title,
        priority,
        description,
        due,
      };
      onSubmit(newTask);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
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
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Task
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Header = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleFilterDropdown = () => {
    if (isSortOpen) setIsSortOpen(false);
    setIsFilterOpen((state) => !state);
  };

  const toggleSortDropdown = () => {
    if (isFilterOpen) setIsFilterOpen(false);
    setIsSortOpen((state) => !state);
  };

  return (
    <div className="flex flex-col mb-6 w-full">
      <h1 className="text-4xl font-bold mb-6">My Tasks</h1>
      <div className="gap-2 grid grid-rows-2 sm:flex sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={toggleFilterDropdown}
              className="flex items-center gap-2 py-1 px-2 border-2 rounded text-gray-700">
              <CiFilter />
              Filter
              <IoIosArrowDown />
            </button>
            {isFilterOpen && (
              <div className="absolute -left-4 top-10 w-48 bg-white border rounded shadow-lg z-50">
                <ul className="p-2">
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 1
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 2
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={toggleSortDropdown}
              className="flex items-center gap-2 py-1 px-2 border-2 rounded text-gray-700">
              <MdOutlineSort />
              Sort
              <IoIosArrowDown />
            </button>

            {isSortOpen && (
              <div className="absolute -left-4 top-10 w-48 bg-white border rounded shadow-lg z-50">
                <ul className="p-2">
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 1
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 2
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div>
          <input
            placeholder="Search..."
            type="text"
            className="h-full px-2 border rounded outline-none"
          />
        </div>
      </div>
    </div>
  );
};

const TaskView = () => {
  const {tasks, setTasks} = useTaskContext()
  const [tasksData, setTasksData] = useState(tasks);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addNewTask = (task) => {
    setTasksData((prevTasks) => {
      return {
        ...prevTasks,
        todo: [...prevTasks.todo, task],
      };
    });
    setIsAddingTask(false);
  };

  const cancelAddingTask = () => {
    setIsAddingTask(false);
  };
  return (
    <div>
      <Header />
      {isAddingTask && (
        <TaskInputForm onSubmit={addNewTask} onCancel={cancelAddingTask} />
      )}
      <div className="flex gap-4 lg:flex-row lg:items-start flex-col">
        <TaskColumn
          title="To Do"
          tasks={tasksData.pending}
          color={Color.Blue}
          onAddTask={() => setIsAddingTask(true)}
        />
        <TaskColumn
          title="On Progress"
          tasks={tasksData.onProgress}
          color={Color.Orange}
        />
        <TaskColumn title="Done" tasks={tasksData.done} color={Color.Green} />
      </div>
    </div>
  );
};

export default TaskView;

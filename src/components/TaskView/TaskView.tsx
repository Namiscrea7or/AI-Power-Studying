import React, { useState, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { MdOutlineSort } from "react-icons/md";
import { TaskColumn, Color } from "../Tasks/TaskColumn.tsx";
import {
  useTaskContext,
  Task,
  TaskStatus,
  TaskPriority,
} from "../../Context/TaskContext.tsx";
import TaskInputForm from "../Tasks/TaskInputForm.tsx";
import * as taskService from "../../services/TaskServices.ts";
import { toast } from "react-toastify";

const Header = ({ setIsAddingTask, setSort, setFilter, setSearch }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOrSort, setIsFilterOrSort] = useState(false);

  const sortOptions = [
    {
      title: "Priority",
      compareFn: () => (a: Task, b: Task) => {
        return a.priority - b.priority;
      },
    },
    {
      title: "Name",
      compareFn: () => (a: Task, b: Task) => a.title.localeCompare(b.title),
    },
    {
      title: "Due",
      compareFn: () => (a: Task, b: Task) => a.end > b.end,
    },
  ];

  const filterOptions = [
    {
      title: "High",
      value: TaskPriority.High,
    },
    {
      title: "Medium",
      value: TaskPriority.Medium,
    },
    {
      title: "Low",
      value: TaskPriority.Low,
    },
  ];

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
      <div className="mb-6">
        <h1 className="text-4xl font-bold">My Tasks</h1>
        <p className="text-gray-500 mt-2">
          Easily create, edit, and delete tasks with just a few clicks.{" "}
          <span>
            <button
              onClick={setIsAddingTask}
              className="text-blue-500 underline">
              Create a task
            </button>
          </span>
        </p>
      </div>
      <div className="gap-2 grid grid-rows-2 sm:flex sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={toggleFilterDropdown}
              className="flex items-center gap-2 py-1 px-2 border-2 rounded text-gray-700">
              <CiFilter />
              Filter
              <IoIosArrowDown
                className={`${isFilterOpen ? "" : "scale-y-[-1]"}`}
              />
            </button>
            {isFilterOpen && (
              <div className="absolute -left-4 top-10 w-48 bg-white border rounded shadow-lg z-50">
                <ul className="p-2">
                  {filterOptions.map((opt, index) => (
                    <li
                      onClick={() => {
                        setFilter(opt.value);
                        setIsFilterOrSort(true);
                        setIsFilterOpen(false);
                      }}
                      key={index}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                      {opt.title}
                    </li>
                  ))}
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
              <IoIosArrowDown
                className={`${isSortOpen ? "" : "scale-y-[-1]"}`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute -left-4 top-10 w-48 bg-white border rounded shadow-lg z-50">
                <ul className="p-2">
                  {sortOptions.map((opt, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSort(opt.compareFn);
                        setIsSortOpen(false);
                        setIsFilterOrSort(true);
                      }}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                      {opt.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {isFilterOrSort && (
            <button
              onClick={() => {
                setSort(undefined);
                setFilter(undefined);
                setIsFilterOrSort(false);
              }}
              className="py-1 px-2 rounded text-white bg-red-500 hover:bg-red-400">
              <IoIosClose />
            </button>
          )}
        </div>
        <div>
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
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
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterOption, setFilterOption] = useState(undefined);
  const [search, setSearch] = useState("");
  const { tasks, setTasks } = useTaskContext();
  const [sortOption, setSortOption] = useState<
    ((a: Task, b: Task) => number) | undefined
  >(undefined);

  useEffect(() => {
    const fetchTasksFromAPI = async () => {
      try {
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        toast.error(
          <div>
            <label className="font-bold">Fetch Task Failed</label>
            <p> Please try again later!</p>
          </div>
        );
      }
    };

    fetchTasksFromAPI();
  }, [setTasks]);

  const addTask = async (task: Task): Promise<boolean> => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks([...tasks, newTask]);
      setIsAddingTask(false);
      return true;
    } catch (error) {
      toast.error(
        <div>
          <label className="font-bold">Load Tasks Failed</label>
          <p> Please try again later!</p>
        </div>
      );
      return false;
    }
  };

  const cancelAddingTask = () => {
    setIsAddingTask(false);
  };

  const sortedTasks = (status: TaskStatus) => {
    const filteredTasks = tasks
      .filter((t) => {
        return (
          t.status === status &&
          ((filterOption !== 0 && !filterOption) ||
            t.priority === filterOption) &&
          (!search || t.title.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort(sortOption || (() => 0));

    return filteredTasks;
  };

  return (
    <div>
      <Header
        setIsAddingTask={() => setIsAddingTask(true)}
        setSearch={setSearch}
        setSort={setSortOption}
        setFilter={setFilterOption}
      />
      {isAddingTask && (
        <TaskInputForm onSubmit={addTask} onCancel={cancelAddingTask} />
      )}
      <div className="flex gap-4 lg:flex-row lg:items-start flex-col">
        <TaskColumn
          title="To Do"
          tasks={sortedTasks(TaskStatus.Pending)}
          color={Color.Blue}
          onAddTask={() => setIsAddingTask(true)}
        />
        <TaskColumn
          title="On Progress"
          tasks={sortedTasks(TaskStatus["OnGoing"])}
          color={Color.Orange}
        />
        <TaskColumn
          title="Done"
          tasks={sortedTasks(TaskStatus.Completed)}
          color={Color.Green}
        />
        <TaskColumn
          title="Expired"
          tasks={sortedTasks(TaskStatus.Expired)}
          color={Color.Red}
        />
      </div>
    </div>
  );
};

export default TaskView;

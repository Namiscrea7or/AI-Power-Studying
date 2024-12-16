    // TaskColumn.tsx
    import React, { useState } from "react";
    import { cn } from "../../utils/cn.tsx";
    import { GoPlus } from "react-icons/go";
    import { Task, useTaskContext } from "../../Context/TaskContext.tsx";
    import TaskInputForm from "./TaskInputForm.tsx";
    import TaskItem from "./TaskItem.tsx";
    import { colors, Color } from "../../utils/Color.ts";
    type TaskColumnProps = {
        title: string;
        tasks: Task[];
        color: Color;
        onAddTask?: () => void;
        onDelete: (id: number) => void;
        onEdit: (task: Task) => void;
    };

    const TaskColumn: React.FC<TaskColumnProps> = ({
        title,
        tasks,
        color,
        onAddTask,
        onDelete,
        onEdit,
    }) => {
        const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
        const { setTasks } = useTaskContext();
        const editTask = (task: any) => {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === task.id ? { id: t.id, status: t.status, ...task } : t
            )
          );

          setCurrentTask(undefined);
      };

        return (
            <div className="lg:flex-shrink-1 w-full lg:w-1/3 p-4 bg-[#f5f5f5] rounded-lg">
                <div className="w-full flex items-center mb-1">
                    <div className={cn(`w-4 h-4 rounded-full me-2`, colors[color].bg)} />
                    {title !== "To Do" ? (
                      <h3 className="text-xl font-bold">{title}</h3>
                    ) : (
                        <div className="flex-grow flex justify-between items-center">
                        <h3 className="text-xl font-bold">{title}</h3>
                            <button
                              onClick={onAddTask}
                              className="bg-blue-200 hover:bg-blue-600 p-1 text-blue-500 hover:text-white rounded flex items-center justify-center"
                            >
                                <GoPlus />
                            </button>
                        </div>
                    )}
                </div>
                <div className={cn(`mb-4 border`, colors[color].border)} />
                {tasks.length === 0}
                {tasks.map((task) => (
                    <TaskItem
                      task={task}
                      key={task.id}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      color={color}
                    />
                  ))}

                {currentTask && (
                    <TaskInputForm
                        task={currentTask}
                        onSubmit={editTask}
                        onCancel={() => setCurrentTask(undefined)}
                   />
                )}
            </div>
        );
    };


    export { TaskColumn, Color };
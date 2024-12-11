import React, { useCallback, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTaskContext } from "./TaskContext.tsx";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import { enUS } from "date-fns/locale";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Task {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  status: "Completed" | "In Progress" | "Pending";
  startDate?: Date;
}

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarView: React.FC = () => {
  const { tasks, setTasks } = useTaskContext();
  const [events, setEvents] = useState<any[]>([]);

  const moveTask = useCallback((taskId: number, start: Date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: start < new Date() ? "Completed" : "In Progress", startDate: start }
          : task
      )
    );
  }, [setTasks]);

  const handleDrop = useCallback((item: any, start: Date) => {
    if (!('taskId' in item)) {
      moveTask(item.id, start);

      setEvents((prevEvents) => {
        const newEvent = {
          title: `${item.name} (${item.priority})`,
          start,
          end: addHours(start, 1),
          taskId: item.id,
        };
        return [...prevEvents, newEvent];
      });
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.taskId === item.taskId ? { ...e, start, end: addHours(start, 1) } : e
        )
      );
    }
  }, [moveTask]);

  const handleMoveTaskBackToList = useCallback((taskId: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.taskId !== taskId));
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Pending", startDate: undefined } : task
      )
    );
  }, [setTasks]);

  const TaskItem = React.memo(({ task }: { task: Task }) => {
    const [, drag] = useDrag(() => ({ type: "TASK", item: task }));
    const [, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item: any) => handleMoveTaskBackToList(item.taskId),
    }));

    return (
      <div
        ref={(node) => drag(drop(node))}
        style={{
          opacity: task.status === "Pending" ? 1 : 0,
          padding: "10px",
          margin: "5px 0",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "move",
        }}
      >
        {task.name} ({task.priority})
      </div>
    );
  });

  const DateCellWrapper: React.FC<{ value: Date; children?: React.ReactNode }> = ({ value, children }) => {
    const [, drop] = useDrop<any, any>(() => ({
      accept: "TASK",
      drop: (item) => handleDrop(item, value),
      collect: monitor => ({
        isOver: !!monitor.isOver()
      })
    }));

    return <div ref={drop} style={{ width: "100%", height: "100%", border: '1px solid gray' }}>{children}</div>;
  };

  const Event: React.FC<{ event: any }> = ({ event }) => {
    const [, drag] = useDrag(() => ({ type: "TASK", item: event }));
    const { tasks } = useTaskContext();
    const task = tasks.find((t) => t.id === event.taskId);

    if (!task) {
      return null; 
    }

    return (
      <div
        ref={drag}
        style={{
          padding: "5px",
          backgroundColor: "#B0E0E6",
          borderRadius: "4px",
          cursor: "move",
        }}
      >
        {task.name} ({task.priority})
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex" }}>
        <div style={{ width: "300px", marginRight: "20px" }}>
          <h3>Task List</h3>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

        <div style={{ flexGrow: 1 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: "20px" }}
            components={{ dateCellWrapper: DateCellWrapper, event: Event }}
            draggableAccessor={() => true}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default CalendarView;
import React, { useState, useEffect } from "react";
import { CalendarApp } from "@schedule-x/calendar";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/calendar.css";
import { useTaskContext, Task, TaskStatus } from "../../Context/TaskContext.tsx";
import * as taskService from "../../services/TaskServices.ts";

interface EventDrop {
  event: any;
  start: string;
  end: string;
}

interface DragAndDropConfig {
  onEventDrop: (eventDrop: EventDrop) => Promise<void>;
}

const CalendarView = () => {
  const { tasks, setTasks } = useTaskContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksFromAPI = async () => {
      try {
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasksFromAPI();
  }, []);

    function dateToString(date: Date) {
        return date.toISOString().split("T")[0];
    }

    function formatDateToLocalDatetime(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

  const handleEventDrop = async (eventDrop: EventDrop) => {
        const { event, start, end } = eventDrop;
        if (!event || !start || !end) return;

        // Convert string date to valid Date object
        const newStartDate = new Date(start);
          if (newStartDate < new Date() && event.end !== null && event.end !== undefined) {
            const updatedTask = {
                ...event,
                status: TaskStatus.Expired,
                start: newStartDate,
                 end: new Date(end),
              };
              try {
                  const savedTask = await taskService.updateTask(updatedTask);
                  if (savedTask) {
                    setTasks((prevTasks) => prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t)));
                  }
                    else {
                     console.error(`Task with ID ${event.id} not found.`);
                 }
              }
                catch(err){
                 console.error("Error updating task:", err);
                }
        }
    };

  const calendar: CalendarApp = useCalendarApp({
        views: [createViewWeek(), createViewMonthGrid()],
        events: tasks
            .filter((t) => t.start && t.end)
          .map((t) => ({
            ...t,
            start: formatDateToLocalDatetime(new Date(t.start)), // Format the date to be a string
            end: formatDateToLocalDatetime(new Date(t.end)), // Format the date to be a string
        })),
      selectedDate: dateToString(new Date()),
    plugins: [
      createEventModalPlugin(),
       createDragAndDropPlugin({ onEventDrop: handleEventDrop } as DragAndDropConfig),
      ],
  });
   if (loading) {
        return <div>Loading Calendar...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default CalendarView;
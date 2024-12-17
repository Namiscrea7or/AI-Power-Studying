import React from "react";
import { CalendarApp } from "@schedule-x/calendar";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/calendar.css";
import { useTaskContext, TaskStatus } from "../../Context/TaskContext.tsx";
import * as taskService from "../../services/TaskServices.ts";

const CalendarView = () => {
  const { tasks, setTasks } = useTaskContext();

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

    const handleEventDrop = (eventId: number, newStart: number) => {
        const originalTask = tasks.find(t => t.id === eventId);
        if (!originalTask) return;

        const durationMs = originalTask.end.getTime() - originalTask.start.getTime();
        const newEnd = new Date(newStart + durationMs);

        const updatedTask = {
            ...originalTask,
            start: new Date(newStart),
            end: newEnd,
            status: new Date(newStart) < new Date() ? TaskStatus.Expired : originalTask.status
        };

        setTasks(tasks.map(t => (t.id === eventId ? updatedTask : t)));

        taskService.updateTask(updatedTask)
            .then((isUpdated) => {
                if (!isUpdated) {
                    setTasks(tasks.map(t => (t.id === eventId ? originalTask : t)));
                }
            })
            .catch(() => {
                setTasks(tasks.map(t => (t.id === eventId ? originalTask : t)));
            });
    };


  const dragAndDropPlugin = createDragAndDropPlugin();

  const calendar: CalendarApp = useCalendarApp({
      views: [createViewWeek(), createViewMonthGrid()],
      events: tasks.filter(t => t.start && t.end).map(t => ({
        ...t,
        start: formatDateToLocalDatetime(new Date(t.start)),
        end: formatDateToLocalDatetime(new Date(t.end)),
      })),
      selectedDate: dateToString(new Date()),
    plugins: [
      createEventModalPlugin(),
      (calendar) => {
            calendar.onEventDrop = (eventId, newStart) => {
              if (eventId) {
                 handleEventDrop(eventId, newStart);
              }
            };
        },
       dragAndDropPlugin,
    ],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default CalendarView;
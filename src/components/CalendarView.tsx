import React from "react";
import { CalendarApp } from "@schedule-x/calendar";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/calendar.css";

import { useTaskContext } from "./TaskContext.tsx";

const CalendarView = () => {
  const { tasks } = useTaskContext();

  const calendar: CalendarApp = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid(),
    ],
    events: tasks,
    selectedDate: "2024-12-11 00:00",
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default CalendarView;

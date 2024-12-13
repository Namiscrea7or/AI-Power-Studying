import React from "react";
import { CalendarApp } from "@schedule-x/calendar";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/calendar.css";

import { useTaskContext } from "../../Context/TaskContext.tsx";

const CalendarView = () => {
  const { tasks } = useTaskContext();

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const calendar: CalendarApp = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid(),
    ],
    events: tasks,
    selectedDate: todayString,
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

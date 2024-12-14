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

  function dateToString(date) {
    return date.toISOString().split("T")[0];
  }

  function formatDateToLocalDatetime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // Return formatted date as YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const calendar: CalendarApp = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: tasks.map((t) => {
      return {
        ...t,
        start: formatDateToLocalDatetime(t.start),
        end: formatDateToLocalDatetime(t.end),
      };
    }),
    selectedDate: dateToString(new Date()),
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default CalendarView;
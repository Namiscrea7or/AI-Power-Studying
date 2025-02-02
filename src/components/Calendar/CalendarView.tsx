import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTaskContext, TaskStatus } from "../../Context/TaskContext.tsx";
import * as taskService from "../../services/TaskServices.ts";
import { EventContentArg, EventClickArg } from "@fullcalendar/core";
import { toast } from "react-toastify";
import TimerPopup from "../Tasks/TimerPopup.tsx";

const CalendarView = () => {
  const { tasks, setTasks } = useTaskContext();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  function formatDateToLocalDatetime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  const handleEventDrop = async (info: any) => {
    const eventId = info.event.id;
    const newStart = info.event.start;
    const originalTask = tasks.find((t) => String(t.id) === eventId);
    if (!originalTask) return;

    const durationMs =
      originalTask.end.getTime() - originalTask.start.getTime();
    const newEnd = new Date(newStart.getTime() + durationMs);

    let newStatus: TaskStatus;

    if (new Date(newStart) <= new Date()) {
      newStatus = TaskStatus.Expired;
    } else if (
      new Date(newStart) >= new Date(originalTask.start) &&
      new Date(newStart) <= new Date(originalTask.end)
    ) {
      newStatus = TaskStatus.OnGoing;
    } else {
      newStatus = TaskStatus.Pending;
    }

    const updatedTask = {
      ...originalTask,
      start: newStart,
      end: newEnd,
      status: newStatus,
    };
    setTasks(tasks.map((t) => (String(t.id) === eventId ? updatedTask : t)));

    try {
      const isUpdated = await taskService.updateTask(updatedTask);
      if (!isUpdated) {
        setTasks(
          tasks.map((t) => (String(t.id) === eventId ? originalTask : t))
        );
      }
    } catch (err) {
      toast.error(
        <div>
          <label className="font-bold">Update Task Failed</label>
          <p> Please try again later!</p>
        </div>
      );
      setTasks(tasks.map((t) => (String(t.id) === eventId ? originalTask : t)));
    }
  };
  const formattedEvents = tasks
    .filter((t) => t.start && t.end)
    .map((t) => ({
      id: String(t.id),
      title: t.title,
      start: formatDateToLocalDatetime(new Date(t.start)),
      end: formatDateToLocalDatetime(new Date(t.end)),
      extendedProps: {
        status:
          new Date(new Date(t.start)) < new Date() ? TaskStatus.Expired : "",
        description: t.description,
      },
      allDay: false,
    }));

  console.log("formattedEvents", formattedEvents);
  const renderEventContent = (eventInfo: EventContentArg) => {
    const status = eventInfo.event.extendedProps.status;
    let backgroundColorClass = "bg-blue-300";
    if (status === TaskStatus.Completed) {
      backgroundColorClass = "bg-yellow-200";
    }
    return (
      <div className={`p-2 rounded-md ${backgroundColorClass} text-gray-50`}>
        {eventInfo.event.title}
      </div>
    );
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const task = tasks.find((t) => String(t.id) === eventId);
    console.log("task", task);
    if (task) {
      setSelectedEvent(task);
      setIsModalOpen(true);
    } else {
      toast.error("Task not found!");
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setShowTimer(false);
  };

  const handleStartTimerClick = () => {
    setShowTimer(true);
  };

  const updateTask = (updatedTask: any) => {
    setTasks((tasks) =>
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        editable={true}
        events={formattedEvents}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <p className="mb-2">
              <strong className="font-medium">Title:</strong> {selectedEvent.title}
            </p>
            <p className="mb-2">
              <strong className="font-medium">Start:</strong>{" "}
              {formatDateToLocalDatetime(new Date(selectedEvent.start))}
            </p>
            <p className="mb-2">
              <strong className="font-medium">End:</strong>{" "}
              {formatDateToLocalDatetime(new Date(selectedEvent.end))}
            </p>
            <p className="mb-2">
              <strong className="font-medium">Status:</strong> {selectedEvent.status}
            </p>
            <p className="mb-2">
              <strong className="font-medium">Description:</strong>{" "}
              {selectedEvent.description}
            </p>

            <div className="text-right mt-4">
              <button
                onClick={handleStartTimerClick}
                className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">
                Start Timer
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimer && selectedEvent && (
        <div onClick={(e) => e.stopPropagation()}>
          <TimerPopup
            task={selectedEvent}
            onClose={() => setShowTimer(false)}
            updateTask={updateTask}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;

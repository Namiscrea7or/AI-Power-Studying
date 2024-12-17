import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTaskContext, TaskStatus } from "../../Context/TaskContext.tsx";
import * as taskService from "../../services/TaskServices.ts";
import { EventContentArg, EventClickArg } from '@fullcalendar/core';
import { format } from 'date-fns';


const CalendarView = () => {
    const { tasks, setTasks } = useTaskContext();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


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
        const originalTask = tasks.find(t => t.id === eventId);
        if (!originalTask) return;

        const durationMs = originalTask.end.getTime() - originalTask.start.getTime();
        const newEnd = new Date(newStart.getTime() + durationMs);

        const updatedTask = {
            ...originalTask,
            start: newStart,
            end: newEnd,
            status: new Date(newStart) < new Date() ? TaskStatus.Expired : originalTask.status
        };
        setTasks(tasks.map(t => (t.id === eventId ? updatedTask : t)));

        try {
            const isUpdated = await taskService.updateTask(updatedTask);
            if(!isUpdated) {
                setTasks(tasks.map(t => (t.id === eventId ? originalTask : t)));
            }

        } catch (err) {
            console.error("Error updating task:", err);
            setTasks(tasks.map(t => (t.id === eventId ? originalTask : t)));
        }
    };
     const formattedEvents = tasks.filter(t => t.start && t.end).map(t => ({
        id: String(t.id),
        title: t.title,
        start: formatDateToLocalDatetime(new Date(t.start)),
        end: formatDateToLocalDatetime(new Date(t.end)),
        allDay: false,
        extendedProps: {
            status: new Date(new Date(t.start)) < new Date() ? TaskStatus.Expired : ""
        },
    }))
    const renderEventContent = (eventInfo: EventContentArg) => {
        const status = eventInfo.event.extendedProps.status;
        let backgroundColorClass = "";
        if (status === TaskStatus.Expired) {
          backgroundColorClass = "bg-red-200";
        }
        return (
                <div className={`p-2 rounded-md ${backgroundColorClass}`}>
                 {eventInfo.event.title}
               </div>
        );
    };


    const handleEventClick = (clickInfo: EventClickArg) => {
      setSelectedEvent(clickInfo.event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

     const formatDateTime = (date: Date | null) => {
        if(!date) return '';
       return format(date, "EEE MMM dd yyyy HH:mm:ss zzz");
     }

    return (
        <div className="p-4">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    start: 'today prev,next',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                editable={true}
                events={formattedEvents}
                eventDrop={handleEventDrop}
                 eventContent = {renderEventContent}
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
                            <strong className="font-medium">Start:</strong> {formatDateToLocalDatetime(selectedEvent.start)}
                        </p>
                        <p className="mb-2">
                            <strong className="font-medium">End:</strong> {formatDateToLocalDatetime(selectedEvent.end)}
                        </p>
                         <p className="mb-2">
                            <strong className="font-medium">Status:</strong> {selectedEvent.extendedProps.status}
                        </p>
                          <p className="mb-2">
                            <strong className="font-medium">Description:</strong> {selectedEvent.extendedProps.description}
                        </p>
                        <div className="text-right mt-4">
                         <button onClick={closeModal}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">
                            Close
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
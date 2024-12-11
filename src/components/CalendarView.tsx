import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTaskContext } from "./TaskContext.tsx";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { addHours } from "date-fns/addHours";
import { enUS } from "date-fns/locale";
import { DndProvider, useDrag, useDrop } from "react-dnd";
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
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarView: React.FC = () => {
    const { tasks, setTasks } = useTaskContext();
    const [events, setEvents] = useState<any[]>([]);

    const handleDrop = (task: any, start: Date) => {
        console.log("Dropped task:", task, "Start time:", start);
        const newEvent = {
            title: `${task.name} (${task.priority})`,
            start,
            end: addHours(start, 1),
            taskId: task.id,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    const handleEventDrop = (event: any, start: Date) => {
        const updatedEvent = { ...event, start, end: addHours(start, 1) };
        setEvents((prevEvents) =>
            prevEvents.map((e) => (e.id === event.id ? updatedEvent : e))
        );
    };

    const TaskItem: React.FC<{ task: any }> = ({ task }) => {
        const [, drag] = useDrag(() => ({
            type: "TASK",
            item: task,
        }));

        return (
            <div
                ref={drag}
                style={{
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
    };

    const DateCellWrapper: React.FC<{ value: Date; children?: React.ReactNode }> = ({
        value,
        children,
    }) => {
        const [, drop] = useDrop({
            accept: "TASK",
            drop: (item: any) => handleDrop(item, value),
        });

        return (
            <div
                ref={drop}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "1px dashed gray",
                }}
            >
                {children}
            </div>
        );
    };

    const Event: React.FC<{ event: any }> = ({ event }) => {
        const [, drag] = useDrag(() => ({
            type: "EVENT",
            item: event,
        }));

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
                {event.title}
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
                        components={{
                            dateCellWrapper: DateCellWrapper,
                            event: Event,
                        }}
                        onEventDrop={({ event, start }) => handleEventDrop(event, start)}
                        draggableAccessor={(event) => event.taskId}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default CalendarView;

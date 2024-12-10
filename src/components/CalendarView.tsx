import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTaskContext } from "./TaskContext.tsx"; // Make sure this path is correct
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { addHours } from "date-fns/addHours";
import { enUS } from "date-fns/locale";

// Define Task type (adjust as needed based on your TaskContext)
interface Task {
    id: number;
    name: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    estimatedTime: string;
    status: "Completed" | "In Progress" | "Pending"; // Important: Define allowed status values
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

    const handleDrop = (taskId: number, startDate: Date) => {
        console.log("handleDrop called with taskId:", taskId, "startDate:", startDate);

        setTasks((prevTasks: Task[]) => {
            const updatedTasks: Task[] = prevTasks.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          status: startDate < new Date() ? "Completed" : "In Progress",
                          startDate: startDate,
                      }
                    : task
            );
            console.log("Updated Tasks:", updatedTasks);
            return updatedTasks;
        });

        const task = tasks.find((t) => t.id === taskId);

        if (task) {
            const newEvent = {
                title: `${task.name} (${task.priority})`,
                start: startDate,
                end: addHours(startDate, 1),
                taskId: task.id,
            };
            console.log("New Event:", newEvent);

            setEvents((prevEvents) => {
                const updatedEvents = [...prevEvents, newEvent];
                console.log("Updated Events:", updatedEvents);
                return updatedEvents;
            });
        } else {
            console.error("Task not found for taskId:", taskId);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            {/* Task List */}
            <div style={{ width: "300px", marginRight: "20px" }}>
                <h3>Task List</h3>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("taskId", String(task.id));
                        }}
                        style={{
                            padding: "10px",
                            margin: "5px 0",
                            backgroundColor: "#f0f0f0",
                            cursor: "move",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        {task.name} ({task.priority})
                    </div>
                ))}
            </div>

            {/* Calendar View */}
            <div style={{ flexGrow: 1 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "20px" }}
                    selectable
                    onDragOver={(e) => e.preventDefault()}
                    onDropFromOutside={(e) => {
                        console.log("iugsadfg")
                        e.preventDefault();
                        const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
                        handleDrop(taskId, e.start);
                    }}
                    onSelectEvent={(event) => console.log("Selected Event:", event)}
                />
            </div>
        </div>
    );
};

export default CalendarView;
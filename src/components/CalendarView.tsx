import React, { useState, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { formatISO, parseISO, addHours } from 'date-fns';
import '@schedule-x/theme-default/dist/index.css';
import { useTaskContext, Task } from './TaskContext.tsx';
import { CalendarEvent, CalendarExternalEvent } from '@schedule-x/calendar';

const ItemType = 'TASK';

const CalendarApp: React.FC = () => {
  const { tasks, updateTaskStartDate } = useTaskContext();

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const [externalEvents, setExternalEvents] = useState<CalendarExternalEvent[]>(
    []
  );

  const handleExternalEventDrop = (
    externalEvent: CalendarExternalEvent,
    calendarEvent: CalendarEvent
  ) => {
    const taskID = Number(externalEvent.id);
    const newStartDate = new Date(calendarEvent.start);
    updateTaskStartDate(taskID, newStartDate);
  };

  const dragAndDropPlugin = createDragAndDropPlugin({
    onExternalEventDrop: handleExternalEventDrop,
    enableDraggingFromOutside: true,
  });

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: tasks
      .filter((task) => task.startDate)
      .map((task) => {
        if (task.startDate) {
          const startDate = parseISO(task.startDate + 'T00:00:00');
          const endDate = addHours(startDate, 1);

          return {
            id: task.id.toString(),
            title: task.name,
            start: formatISO(startDate, { representation: 'date' }),
            end: formatISO(endDate, { representation: 'date' }),
          };
        } else {
          return null;
        }
      })
      .filter((event) => event !== null),
    plugins: [eventsService, dragAndDropPlugin],
  });

  useEffect(() => {
    eventsService.getAll()
  }, [eventsService])

  useEffect(() => {
    setExternalEvents(
      tasks
        .filter((task) => !task.startDate)
        .map((task) => ({
          id: task.id.toString(),
          title: task.name,
          duration: 60,
          task: task,
        }))
    );
  }, [tasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-72 p-4">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          {externalEvents.map((event) => (
            <div key={event.id}>
              <TaskItem task={event.task} />
            </div>
          ))}
        </div>

        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">ScheduleX Calendar</h1>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </DndProvider>
  );
};

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: {
      id: task.id,
      duration: 60,
      title: task.name,
      task: task,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`mb-2 p-2 border border-gray-400 rounded ${
        isDragging ? 'bg-green-200' : 'bg-white'
      } cursor-move`}
    >
      <h3 className="font-semibold">{task.name}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Estimated Time: {task.estimatedTime}</p>
      {task.startDate && <p>Start Date: {task.startDate}</p>}
    </div>
  );
};

export default CalendarApp;
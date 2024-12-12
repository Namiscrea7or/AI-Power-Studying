import React, { useState, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useDrag, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';

import '@schedule-x/theme-default/dist/index.css'
import { useTaskContext, Task } from './TaskContext.tsx'

const ItemType = 'TASK'

const CalendarApp: React.FC = () => {
  const { tasks, updateTaskStartDate } = useTaskContext()

  const eventsService = useState(() => createEventsServicePlugin())[0]

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: tasks.map(task => ({
      id: task.id.toString(),
      title: task.name,
      start: task.startDate ? task.startDate.toISOString().split('T')[0] : "",
      end: task.startDate ? new Date(task.startDate.getTime() + 60 * 60 * 1000).toISOString().split('T')[0] : "",
    })),
    plugins: [
      eventsService,
      createDragAndDropPlugin()
    ],
  })

  useEffect(() => {
    eventsService.getAll()
  }, [eventsService])

  const handleEventUpdate = (event: any) => {
    const taskID = Number(event.id);
    const newStartDate = new Date(event.start);
    updateTaskStartDate(taskID, newStartDate);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-72 p-4">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>

        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">ScheduleX Calendar</h1>
          <ScheduleXCalendar
            calendarApp={calendar}
            onEventUpdate={handleEventUpdate}
          />
        </div>
      </div>
    </DndProvider>
  )
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`mb-2 p-2 border border-gray-400 rounded ${isDragging ? 'bg-green-200' : 'bg-white'} cursor-move`}
    >
      <h3 className="font-semibold">{task.name}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Estimated Time: {task.estimatedTime}</p>
      {task.startDate && <p>Start Date: {task.startDate.toString()}</p>}
    </div>
  )
}

export default CalendarApp
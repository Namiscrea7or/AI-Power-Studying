import { Task, TaskPriority, TaskStatus } from "../Context/TaskContext.tsx";

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Mock Task 1",
    description: "This is a mock task description.",
    priority: TaskPriority.High,
    status: TaskStatus.Pending,
    start: new Date(),
    end: new Date(Date.now() + 3600 * 1000),
  },
  {
    id: 2,
    title: "Mock Task 2",
    description: "This is another mock task description.",
    priority: TaskPriority.Medium,
    status: TaskStatus.OnGoing,
    start: new Date(),
    end: new Date(Date.now() + 7200 * 1000),
  },
];
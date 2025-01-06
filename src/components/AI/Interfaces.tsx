import { TaskPriority } from "../../Context/TaskContext";

interface TaskSuggestion {
  taskId: number;
  taskTitle: string;
  oldPriority: TaskPriority | null;
  newPriority: TaskPriority | null;
  oldStart: Date | null;
  newStart: Date | null;
  oldEnd: Date | null;
  newEnd: Date | null;
}

interface TaskAnalysis {
  content: string;
  suggestions: TaskSuggestion[];
}

interface TaskAnalytics {
  content: string;
}

enum AIContentType {
  Suggestions,
  Analytics,
}

export { TaskSuggestion, TaskAnalysis, TaskAnalytics, AIContentType };

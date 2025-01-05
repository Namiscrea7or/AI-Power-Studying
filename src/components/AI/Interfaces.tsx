import { TaskPriority } from "../../Context/TaskContext";

interface TaskSuggestion {
  taskId: number;
  taskTitle: string;
  oldPriority?: TaskPriority;
  newPriority?: TaskPriority;
  oldStart?: Date;
  newStart?: Date;
  oldEnd?: Date;
  newEnd?: Date;
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

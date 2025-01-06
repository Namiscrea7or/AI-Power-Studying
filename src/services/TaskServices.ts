import axios from "axios";
import { Task, TaskPriority, TaskStatus, TaskTimer } from "../Context/TaskContext.tsx";
import { Serializer } from "jsonapi-serializer";
import { auth } from "../firebase/firebase.config.js"
import { TaskAnalysis, TaskSuggestion } from "../components/AI/Interfaces.tsx";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export interface DBTask {
  id: number | undefined;
  title: string;
  description: string;
  priorityLevel: TaskPriority;
  status: TaskStatus;
  startDate: Date;
  dueDate: Date;
}

const TaskSerializer = new Serializer("studyTasks", {
  attributes: ["title", "description", "priorityLevel", "status", "startDate", "dueDate"],
  keyForAttribute: "camelCase",
});

const deserializeTasks = (jsonData: any): Task[] => {
  return jsonData.data.map((item: any) => ({
    id: parseInt(item.id, 10),
    title: item.attributes.title,
    description: item.attributes.description,
    priority: item.attributes.priorityLevel,
    status: item.attributes.status,
    start: item.attributes.startDate ? new Date(item.attributes.startDate) : null,
    end: item.attributes.dueDate ? new Date(item.attributes.dueDate) : null,
  }));
};

function taskToDBTask(task: Task): DBTask {
  const dbtask: DBTask = {
    id: task.id === -1 ? undefined : task.id,
    description: task.description,
    dueDate: task.end,
    startDate: task.start,
    status: task.status,
    priorityLevel: task.priority,
    title: task.title
  }

  return dbtask;
}

const deserializeTask = (jsonData: any): Task => {
  const task: any = {
    id: parseInt(jsonData.id, 10),
    title: jsonData.attributes.title,
    description: jsonData.attributes.description,
    priority: jsonData.attributes.priorityLevel,
    status: jsonData.attributes.status,
    start: jsonData.attributes.startDate ? new Date(jsonData.attributes.startDate) : null,
    end: jsonData.attributes.dueDate ? new Date(jsonData.attributes.dueDate) : null,
  }

  return task;
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    const response = await axios.get(`${API_BASE_URL}/studyTasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return deserializeTasks(response.data);
  } catch (error) {
    throw error;
  }
};

export const getTask = async (id: number): Promise<Task | null> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    const response = await axios.get(`${API_BASE_URL}/studyTasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return deserializeTask(response.data);
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    // Serialize task
    const dbtask = taskToDBTask(task);
    const serializedTask = TaskSerializer.serialize(dbtask);

    const response = await axios.post(
      `${API_BASE_URL}/studyTasks`,
      JSON.stringify(serializedTask),
      {
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${token}`
        }
      });

    return deserializeTask(response.data.data);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export interface AiTaskUpdate {
  id: number;
  priorityLevel?: TaskPriority;
  startDate?: Date;
  dueDate?: Date;
}

function suggestionToTask(suggestion: TaskSuggestion): AiTaskUpdate {
  const dbtask: AiTaskUpdate = {
    id: suggestion.taskId,
    dueDate: suggestion.newEnd,
    startDate: suggestion.newStart,
    priorityLevel: suggestion.newPriority,
  }

  return dbtask;
}

export const updateTaskAI = async (suggestion: TaskSuggestion): Promise<void> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);

    const updatedTask = suggestionToTask(suggestion)
    await axios.patch(`${API_BASE_URL}/studyTasks/${updatedTask.id}`, JSON.stringify(updatedTask), {
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    throw error
  }
};

export const updateTask = async (task: Task): Promise<boolean> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);

    const dbtask = taskToDBTask(task);
    const serializedTask = TaskSerializer.serialize(dbtask);

    await axios.patch(`${API_BASE_URL}/studyTasks/${task.id}`, JSON.stringify(serializedTask), {
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`
      }
    });
    return true
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);

    await axios.delete(`${API_BASE_URL}/studyTasks/${id}`, {
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

const JsonToTaskAnalysis = (jsonData: any): TaskAnalysis => {
  return {
    content: jsonData.content,
    suggestions: jsonData.suggestions
  }
}

export const getSuggestions = async (): Promise<TaskAnalysis> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    const response = await axios.get(`${API_BASE_URL}/studyTasks/schedule-suggestion`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(response.data)
    return JsonToTaskAnalysis(response.data);
  } catch (error) {
    throw error;
  }
}

export const getAnalyticsSummary = async (): Promise<any> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    const response = await axios.get(`${API_BASE_URL}/analytics/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const TimerSerializer = new Serializer("timerSessions", {
  attributes: ["studyTaskId", "duration", "startTime", "endTime", "timerType", "timerState"],
  keyForAttribute: "camelCase",
});

const deserializeTimers = (jsonData: any): TaskTimer[] => {
  return jsonData.data.map((item: any) => ({
    id: parseInt(item.id, 10),
    studyTaskId: parseInt(item.attributes.studyTaskId, 10),
    duration: item.attributes.duration,
    startTime: item.attributes.startTime ? new Date(item.attributes.startTime) : null,
    endTime: item.attributes.endTime ? new Date(item.attributes.endTime) : null,
    timerType: item.attributes.timerType,
    timerState: item.attributes.timerState,
  }));
};

const timerToDBTimer = (timer: TaskTimer): any => ({
  id: timer.id,
  studyTaskId: timer.studyTaskId,
  duration: timer.duration,
  startTime: timer.startTime,
  endTime: timer.endTime,
  timerType: timer.timerType,
  timerState: timer.timerState,
});

export const getTimerSessions = async (studyTaskId: number): Promise<TaskTimer[]> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    token = await user.getIdToken(false);

    const response = await axios.get(`${API_BASE_URL}/timerSessions/${studyTaskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return deserializeTimers(response.data);
  } catch (error) {
    console.error("Error fetching timer sessions:", error);
    throw error;
  }
};

export const createTimerSession = async (timerSession: TaskTimer): Promise<TaskTimer> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);

    const dbTimer = timerToDBTimer(timerSession);
    const serializedTimer = TimerSerializer.serialize(dbTimer);
    console.log("this is timer data", serializedTimer);

    const response = await axios.post(
      `${API_BASE_URL}/timerSessions`,
      JSON.stringify(serializedTimer),
      {
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("this is response", response.data.data);

    return deserializeTimers({ data: response.data.data })[0];
  } catch (error) {
    console.error("Error creating timer session:", error);
    throw error;
  }
};
import axios from "axios";
import { Task, TaskPriority, TaskStatus, TaskTimer } from "../Context/TaskContext.tsx";
import { Serializer } from "jsonapi-serializer";
import { auth } from "../firebase/firebase.config.js"
import { TaskAnalysis, TaskAnalytics, TaskSuggestion } from "../components/AI/Interfaces.tsx";

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
  return {
    id: suggestion.taskId ,
    dueDate: suggestion.newEnd ?? undefined,
    startDate: suggestion.newStart ?? undefined,
    priorityLevel: suggestion.newPriority ?? undefined,
  };
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
    const serializedTask = TaskSerializer.serialize(updatedTask);
    console.log(serializedTask);
    await axios.patch(`${API_BASE_URL}/studyTasks/${updatedTask.id}`, JSON.stringify(serializedTask), {
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
    throw error;
  }
};

const JsonToTaskAnalysis = (jsonData: any): TaskAnalysis => {
  return {
    content: jsonData.content,
    suggestions: jsonData.suggestions.map((s) : TaskSuggestion => {
      return {
        taskId: s.id,
        taskTitle: s.title,
        oldEnd: s.oldEnd ? new Date(s.oldEnd) : null,
        newEnd: s.newEnd ? new Date(s.newEnd) : null,
        oldPriority: s.oldPriority,
        newPriority: s.newPriority,
        oldStart: s.oldStart ? new Date(s.oldStart) : null,
        newStart: s.newStart ? new Date(s.newStart) : null
      }
    })
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

    return JsonToTaskAnalysis(response.data)
  } catch (error) {
    throw error;
  }
}

export const getAnalyticsFeedback = async (): Promise<TaskAnalytics> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error();
    }

    token = await user.getIdToken(false);
    const response = await axios.get(`${API_BASE_URL}/studyTasks/ai-feedback`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(response.data)
    return {
      content: response.data
    }
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
    studyTaskId: parseInt(item.studyTaskId, 10),
    duration: item.duration,
    timerType: item.timerType,
    timerState: item.timerState,
  }));
};

const deserializeTimer = (item: any): TaskTimer => {
  return {
    id: parseInt(item.id, 10),
    studyTaskId: item.studyTaskId,
    duration: item.duration,
    timerType: item.timerType,
    timerState: item.timerState,
  };
};

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
      throw new Error("User is not authenticated");
    }

    token = await user.getIdToken(false);

    const serializedTimer = {
      data: {
        type: "timerSessions",
        attributes: {
          duration: timerSession.duration,
          timerType: timerSession.timerType,
          timerState: timerSession.timerState,
        },
        relationships: {
          studyTask: {
            data: {
              type: "studyTasks",
              id: timerSession.studyTaskId,
            },
          },
        },
      },
    };

    console.log("Serialized Timer:", serializedTimer);

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

    console.log("Response Data:", response.data);

    return deserializeTimer({ data: response.data.data })[0];
  } catch (error) {
    console.error("Error creating timer session:", error);
    throw error;
  }
};

export const updateTimerSession = async (timerSession: TaskTimer): Promise<TaskTimer> => {
  try {
    let token = "";
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    token = await user.getIdToken(false);

    const serializedTimer = {
      data: {
        type: "timerSessions",
        id: timerSession.id,
        attributes: {
          duration: timerSession.duration,
          timerType: timerSession.timerType,
          timerState: timerSession.timerState,
        },
        relationships: {
          studyTask: {
            data: {
              type: "studyTasks",
              id: timerSession.studyTaskId,
            },
          },
        },
      },
    };

    console.log("Serialized Timer:", serializedTimer);

    const response = await axios.patch(
      `${API_BASE_URL}/timerSessions/${timerSession.id}`,
      JSON.stringify(serializedTimer),
      {
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response Data:", response.data);

    return deserializeTimer({ data: response.data.data })[0];
  } catch (error) {
    console.error("Error updating timer session:", error);
    throw error;
  }
};
import axios from "axios";
import { Task, TaskPriority, TaskStatus } from "../Context/TaskContext.tsx";
import { Serializer } from "jsonapi-serializer";

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

function toDBTask(task: Task): DBTask {
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
    const task : any = {
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
    const response = await axios.get(`${API_BASE_URL}`);
    return deserializeTasks(response.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const getTask = async (id: number): Promise<Task | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return deserializeTask(response.data);
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  try {
    const serializedTask = TaskSerializer.serialize(task);
    console.log("Serialized Task:", serializedTask);

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(serializedTask),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error details:", errorResponse);
      throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    return deserializeTask(jsonData);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<boolean> => {
  try {
    const dbtask = toDBTask(task);
    const serializedTask = TaskSerializer.serialize(dbtask);
    
    await axios.patch(`${API_BASE_URL}/${task.id}`, JSON.stringify(serializedTask), {
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
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
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/vnd.api+json",
      }
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

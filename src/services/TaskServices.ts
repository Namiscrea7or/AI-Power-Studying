import { Task, TaskPriority, TaskStatus } from "../Context/TaskContext.tsx";
import { Serializer } from "jsonapi-serializer";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const TaskSerializer = new Serializer("studyTasks", {
  attributes: ["title", "description", "priority", "status", "start", "end", "estimatedTime"],
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

const deserializeTask = (jsonData: any): Task => deserializeTasks(jsonData)[0];

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    console.log(jsonData)
    return deserializeTasks(jsonData);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const getTask = async (id: number): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch task ${id}: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    return deserializeTask(jsonData);
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  console.log("task bthg: ", task)
  try {
    // Serialize task
    const serializedTask = TaskSerializer.serialize(task);
    console.log("Serialized Task:", serializedTask);

    // Gửi request
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


export const updateTask = async (task: Task): Promise<Task | null> => {
  try {
    const serializedTask = TaskSerializer.serialize(task);
    console.log(serializedTask)
    const response = await fetch(`${API_BASE_URL}/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(serializedTask),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to update task ${task.id}: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    return deserializeTask(jsonData);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete task ${id}: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

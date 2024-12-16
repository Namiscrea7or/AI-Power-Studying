// taskService.ts
import { Task, TaskPriority, TaskStatus } from "../Context/TaskContext.tsx";
import { Serializer } from 'jsonapi-serializer';

const API_BASE_URL = process.env.REACT_APP_API_URL || "LOL"; 

const TaskSerializer = new Serializer('studyTasks', {
    attributes: ['title', 'description', 'priorityLevel', 'status', 'startDate', 'dueDate', 'estimatedTime'],
    keyForId: 'id',
    type: function({ type }) { // Optional: override type if necessary
       return type === 'studyTask' ? 'studyTasks' : type;
   }

  });

export const getTasks = async (): Promise<Task[]> => {
    try{
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
    
        const jsonData = await response.json();
        const deserializedTasks = TaskSerializer.deserialize(jsonData)
                    .then(data => data);
          return (await deserializedTasks) as Task[];
    }catch(error){
        console.error("Error fetching tasks:", error);
        return [];
    }
};

export const getTask = async (id: number): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch task ${id}: ${response.status} ${response.statusText}`);
    }
    const jsonData = await response.json();
    const deserializedTask = TaskSerializer.deserialize(jsonData)
            .then(data => data);
    return (await deserializedTask) as Task;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};


export const createTask = async (task: Task): Promise<Task> => {
  try{
      const serializedTask = await TaskSerializer.serialize(task);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify(serializedTask), 
      });
        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
        }
        const jsonData = await response.json();
        const deserializedData = TaskSerializer.deserialize(jsonData)
        .then(data => data);
        return (await deserializedData) as Task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }

};

export const updateTask = async (task: Task): Promise<Task | null> => {
    try{
        const serializedTask = await TaskSerializer.serialize(task);
        const response = await fetch(`${API_BASE_URL}/${task.id}`, {
          method: "PATCH", 
          headers: {
              "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify(serializedTask),
        });
        if (!response.ok) {
            if (response.status === 404) {
              return null;
            }
            throw new Error(`Failed to update task ${task.id}: ${response.status} ${response.statusText}`);
          }
          const jsonData = await response.json();
          const deserializedTask = TaskSerializer.deserialize(jsonData)
          .then(data => data);
    return (await deserializedTask) as Task;

    }catch(error){
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
import api from './api'; // Using the shared api instance

// Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
  hasReminder?: boolean;
  taskList?: string; // Optional since we've moved to a list-free structure
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export type TaskCreateDTO = Omit<Task, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>;
export type TaskUpdateDTO = Partial<TaskCreateDTO>;



// Tasks - now using direct endpoints without list dependency
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.data;
};

export const getTask = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data.data;
};

export const createTask = async (task: TaskCreateDTO): Promise<Task> => {
  console.log('taskService: Making POST request to /tasks with data:', task);
  try {
    const response = await api.post('/tasks', task);
    console.log('taskService: API response:', response);
    return response.data.data;
  } catch (error) {
    console.error('taskService: API error:', error);
    console.log('taskService: Full error object:', JSON.stringify(error, null, 2));
    throw error;
  }
};

export const updateTask = async (taskId: string, task: TaskUpdateDTO): Promise<Task> => {
  const response = await api.put(`/tasks/${taskId}`, task);
  return response.data.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    console.log(`taskService: Deleting task with ID: ${taskId}`);
    await api.delete(`/tasks/${taskId}`);
    console.log(`taskService: Delete request for task ${taskId} completed successfully`);
  } catch (error: any) {
    console.error(`taskService: Error deleting task ${taskId}:`, error.message);
    console.error('taskService: Response data:', error.response?.data);
    console.error('taskService: Response status:', error.response?.status);
    throw error; // Re-throw to let the calling code handle it
  }
};

// Special task operations
export const updateTaskStatus = async (
  taskId: string, 
  status: 'todo' | 'inProgress' | 'completed'
): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const toggleTaskCompletion = async (taskId: string): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/completed`, {});
  return response.data.data;
};

const taskService = {
  // Task methods
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleTaskCompletion
};

export default taskService;

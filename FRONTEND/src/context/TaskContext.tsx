import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import taskService, { Task as ApiTask } from '../services/taskService';
import { TaskCreateDTO, TaskUpdateDTO } from '../services/taskService';
import { notify } from '../utils/toast';

// Task interface - Using API task as base but with id instead of _id
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  hasReminder?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Context interface
interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: TaskCreateDTO) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, targetStatus: 'todo' | 'inProgress' | 'completed') => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Initial empty state
const initialTasks: Task[] = [];

export const TaskProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user: currentUser } = useAuth();
  console.log('TaskContext: currentUser state:', currentUser);
  
  // State
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform API task to context task
  const transformApiTaskToContextTask = useCallback((apiTask: ApiTask): Task => ({
    id: apiTask._id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status as 'todo' | 'inProgress' | 'completed',
    priority: apiTask.priority as 'low' | 'medium' | 'high' | undefined,
    dueDate: apiTask.dueDate,
    completed: apiTask.completed || false,
    hasReminder: apiTask.hasReminder,
    createdAt: apiTask.createdAt,
    updatedAt: apiTask.updatedAt
  }), []);

  // Load tasks
  const refreshTasks = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await taskService.getTasks();
      const transformedTasks = response.map(transformApiTaskToContextTask);
      setTasks(transformedTasks);
      // Silent load on initial login to avoid duplicate toast notifications
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
      notify.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, transformApiTaskToContextTask]);

  // Load tasks on mount or when user changes
  useEffect(() => {
    if (currentUser) {
      refreshTasks();
    } else {
      setTasks([]);
    }
  }, [currentUser, refreshTasks]);

  // Add a new task
  const addTask = useCallback(async (taskData: TaskCreateDTO) => {
    console.log('TaskContext: addTask called with data:', taskData);
    console.log('TaskContext: Authentication state check:', { 
      isCurrentUserDefined: !!currentUser,
      currentUserValue: currentUser,
      isTokenInLocalStorage: !!localStorage.getItem('token'),
      isTokenInSessionStorage: !!sessionStorage.getItem('token'),
      tokenValue: localStorage.getItem('token') || sessionStorage.getItem('token')
    });
    
    if (!currentUser) {
      console.log('TaskContext: No current user, aborting task creation');
      console.log('TaskContext: You need to be logged in to create tasks. Please check your authentication state.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('TaskContext: Making API call to create task');
      const response = await taskService.createTask(taskData);
      console.log('TaskContext: API response received:', response);
      const newTask = transformApiTaskToContextTask(response);
      console.log('TaskContext: Transformed task:', newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);
      console.log('TaskContext: Task added to state successfully');
      notify.success('Task created successfully');
    } catch (err) {
      setError('Failed to add task');
      console.error('TaskContext: Error adding task:', err);
      notify.error('Failed to create task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, transformApiTaskToContextTask]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert id to _id if present in updates
      const apiUpdates: TaskUpdateDTO = { ...updates };
      delete (apiUpdates as any).id;
      
      const response = await taskService.updateTask(taskId, apiUpdates);
      const updatedTask = transformApiTaskToContextTask(response);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      notify.success('Task updated successfully');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      notify.error('Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, transformApiTaskToContextTask]);

  // Remove a task
  const removeTask = useCallback(async (taskId: string) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to delete task with ID: ${taskId}`);
      await taskService.deleteTask(taskId);
      console.log(`Task deleted successfully on server`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      notify.success('Task deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove task';
      setError(errorMessage);
      console.error('Delete task error:', errorMessage);
      console.error('Full error object:', err);
      
      // Handle the error but don't throw it, so UI doesn't break
      // Optimistically remove the task from UI even if the server fails
      // This prevents UI from getting stuck in a bad state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      notify.warning('Task removed from view, but server error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await updateTask(taskId, { completed: !task.completed });
  }, [tasks, updateTask]);

  // Move task to a different status
  const moveTask = useCallback(async (taskId: string, targetStatus: 'todo' | 'inProgress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await updateTask(taskId, { status: targetStatus });
  }, [tasks, updateTask]);

  // Get task by ID
  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const value = {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    removeTask,
    toggleTaskCompletion,
    moveTask,
    getTaskById,
    refreshTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;

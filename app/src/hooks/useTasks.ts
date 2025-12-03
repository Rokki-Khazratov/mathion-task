/**
 * useTasks hook
 * Manages task CRUD operations and state
 */

import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilter } from '../lib/types';
import { supabase } from '../lib/supabase';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Promise<Task | null>;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for managing tasks
 * 
 * @example
 * const { tasks, loading, createTask, deleteTask } = useTasks();
 * 
 * // Create a new task
 * await createTask({ title: 'New Task', status: 'open' });
 * 
 * // Delete a task
 * await deleteTask('task-id');
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');

  // Fetch all tasks for current user
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement fetch from Supabase
      // const { data, error } = await supabase.from('tasks').select('*');
      console.log('Fetching tasks...');
      setTasks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single task by ID
  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      // TODO: Implement fetch single task from Supabase
      console.log('Getting task:', id);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get task');
      return null;
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement create task in Supabase
      console.log('Creating task:', input);
      await fetchTasks(); // Refresh list
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Update existing task
  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement update task in Supabase
      console.log('Updating task:', id, input);
      await fetchTasks(); // Refresh list
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Delete task
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement delete task in Supabase
      console.log('Deleting task:', id);
      await fetchTasks(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Clear error
  const clearError = () => setError(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on current filter
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  return {
    tasks: filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  };
}

export default useTasks;


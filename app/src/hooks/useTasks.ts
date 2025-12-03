/**
 * useTasks hook
 * Manages task CRUD operations with Supabase API
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
 * Hook for managing tasks with Supabase
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
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTasks(data || []);
    } catch (err: any) {
      const errorMessage = err?.message || 'Aufgaben konnten nicht geladen werden';
      setError(errorMessage);
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single task by ID
  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'Aufgabe konnte nicht geladen werden';
      setError(errorMessage);
      console.error('Get task error:', err);
      return null;
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Nicht angemeldet');
      }

      const { data, error: createError } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: input.title,
          description: input.description || null,
          status: input.status || 'open',
          deadline: input.deadline || null,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Add to local state
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'Aufgabe konnte nicht erstellt werden';
      setError(errorMessage);
      console.error('Create task error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing task
  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'Aufgabe konnte nicht aktualisiert werden';
      setError(errorMessage);
      console.error('Update task error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Deleting task with ID:', id);
      
      const { data, error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .select(); // Add select to see what was deleted

      console.log('Delete response:', { data, error: deleteError });

      if (deleteError) {
        throw deleteError;
      }

      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Aufgabe konnte nicht gelöscht werden';
      setError(errorMessage);
      console.error('Delete task error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

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

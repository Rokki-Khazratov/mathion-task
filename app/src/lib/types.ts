// Task status enum
export type TaskStatus = 'open' | 'in_progress' | 'done';

// Task model
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null; 
  created_at: string;
  updated_at: string;
}

// Create task input
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  deadline?: string | null;
}

// Update task input
export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  deadline?: string | null;
}

// Auth user
export interface User {
  id: string;
  email: string;
  email_confirmed_at?: string | null;
  created_at?: string;
}

// Auth response from Supabase
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

// Session from Supabase
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

// Login/Register credentials
export interface AuthCredentials {
  email: string;
  password: string;
}

// API error response
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Filter options for task list
export type TaskFilter = 'all' | TaskStatus;

// Navigation param types
export type RootStackParamList = {
  Auth: undefined;
  TaskList: { filter?: TaskFilter }; // Optional filter to set
  TaskDetail: { taskId?: string }; // undefined = create mode
};


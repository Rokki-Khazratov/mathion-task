import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthCredentials } from '../lib/types';
import { supabase } from '../lib/supabase';

// Context value type
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean; // True after successful registration (email confirmation required)
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearRegistrationSuccess: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session as any);
        setUser(session.user as User);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session as any);
        setUser(session.user as User);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login with email and password
  const login = async (credentials: AuthCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session as any);
        setUser(data.user as User);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Anmeldung fehlgeschlagen';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (credentials: AuthCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    setRegistrationSuccess(false);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Email confirmation disabled - user can login immediately
        setSession(data.session as any);
        setUser(data.user as User);
      } else if (data.user) {
        // User created but email confirmation required
        // Do NOT set user - show confirmation page instead
        setRegistrationSuccess(true);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Registrierung fehlgeschlagen';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err?.message || 'Abmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Clear registration success state (when navigating back to login)
  const clearRegistrationSuccess = () => setRegistrationSuccess(false);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    registrationSuccess,
    login,
    register,
    logout,
    clearError,
    clearRegistrationSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 * Throws error if used outside of AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;


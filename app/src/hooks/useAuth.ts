import { useAuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication state and methods
 * 
 * @example
 * const { user, login, logout, loading } = useAuth();
 * 
 * if (loading) return <Loading />;
 * if (!user) return <AuthScreen />;
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;


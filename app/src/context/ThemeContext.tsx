import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeType, Colors } from '../constants/colors';

// Context value type
interface ThemeContextValue {
  theme: ThemeType;
  colors: typeof Colors.light | typeof Colors.dark;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component
 * Provides theme state and toggle functionality
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Initialize theme - default to dark
  const [theme, setThemeState] = useState<ThemeType>('dark');

  // Update theme when system preference changes
  useEffect(() => {
    // TODO: Optionally persist user preference with AsyncStorage
  }, [systemColorScheme]);

  // Get current colors based on theme
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const isDark = theme === 'dark';

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Set specific theme
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextValue = {
    theme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook to use theme context
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;


/**
 * Mathion Task App
 * Main entry point with providers and navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context providers
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

// Navigation
import { RootNavigator } from './src/navigation';

/**
 * Root App component
 * Wraps the app with necessary providers:
 * - SafeAreaProvider (for safe area insets)
 * - ThemeProvider (light/dark theme)
 * - AuthProvider (authentication state)
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/**
 * RootNavigator
 * Main navigation configuration
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { useAuth } from '../hooks';
import { AuthScreen, TaskListScreen, TaskDetailScreen } from '../screens';

// Create stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Auth Stack - shown when user is not logged in
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}

/**
 * Main Stack - shown when user is logged in
 */
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // TODO: Add custom header styling
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen}
        options={{ title: 'Task' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator
 * Switches between Auth and Main stacks based on auth state
 */
export function RootNavigator() {
  const { user, loading } = useAuth();
  
  // Loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#86868B' }}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default RootNavigator;
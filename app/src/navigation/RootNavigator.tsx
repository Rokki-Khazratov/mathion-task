/**
 * RootNavigator
 * Main navigation configuration with bottom tabs
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../lib/types';
import { useAuth } from '../hooks';
import { AuthScreen, TaskListScreen, TaskDetailScreen, ProfileScreen } from '../screens';

// Tab param list
type TabParamList = {
  TasksTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Auth Stack - shown when user is not logged in
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}

/**
 * Tasks Stack - for tasks navigation
 */
function TasksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}

/**
 * Create Task Screen (wrapper for TaskDetail in create mode)
 */
function CreateTaskScreen() {
  return <TaskDetailScreen />;
}

/**
 * Main Tab Navigator
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5EA',
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#86868B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="TasksTab" 
        component={TasksStack}
        options={{
          tabBarLabel: 'Aufgaben',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CreateTab" 
        component={CreateTaskScreen}
        options={{
          tabBarLabel: 'Erstellen',
          tabBarIcon: ({ color, size }) => (
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Switches between Auth and Main tabs based on auth state
 */
export function RootNavigator() {
  const { user, loading } = useAuth();
  
  // Loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#86868B' }}>Laden...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default RootNavigator;

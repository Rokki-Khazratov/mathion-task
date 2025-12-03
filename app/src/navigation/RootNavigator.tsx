/**
 * RootNavigator
 * Main navigation configuration with bottom tabs
 */

import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, Animated, Easing } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../lib/types';
import { useAuth } from '../hooks';
import { AuthScreen, TaskListScreen, TaskDetailScreen, ProfileScreen } from '../screens';
import { useThemeContext } from '../context/ThemeContext';

// Tab param list
type TabParamList = {
  HomeTab: undefined;
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
 * With entrance animation
 */
function CreateTaskScreen() {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useEffect(() => {
    // Animate in when screen mounts
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  // Callback for successful task creation - navigate to HomeTab
  const handleCreateSuccess = () => {
    navigation.navigate('HomeTab', { 
      screen: 'TaskList', 
      params: { filter: 'all' } 
    } as any);
  };

  return (
    <Animated.View style={{ 
      flex: 1, 
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
    }}>
      <TaskDetailScreen onCreateSuccess={handleCreateSuccess} />
    </Animated.View>
  );
}

/**
 * Main Tab Navigator
 */
function MainTabs() {
  const { colors, isDark } = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        // Dark theme: active icons/labels are white, light theme: use accent
        tabBarActiveTintColor: isDark ? '#FFFFFF' : colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={TasksStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={24} color={color} />
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
              // In dark theme show white pill with accent plus icon, in light keep accent pill
              backgroundColor: isDark ? '#FFFFFF' : colors.accent,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: isDark ? '#000000' : '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Ionicons
                name="add"
                size={28}
                color={isDark ? colors.accent : '#FFFFFF'}
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Reset the create screen state when tapping the tab
            // This ensures a fresh form each time
          },
        })}
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
 * Uses session (not user) to ensure email is confirmed
 */
export function RootNavigator() {
  const { session, loading } = useAuth();
  
  // Loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={{ marginTop: 16, color: '#98989D' }}>Laden...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {session ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default RootNavigator;

/**
 * TaskListScreen
 * Displays list of user's tasks with filtering
 */

import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Task } from '../lib/types';
import { useTasks, useAuth } from '../hooks';
import { Header, FilterTabs, TaskCard, Button } from '../components';

type TaskListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

/**
 * Task list screen with filtering and navigation
 * 
 * Features:
 * - Header with avatar and menu
 * - Filter tabs (All, Open, In Progress, Done)
 * - Pull to refresh
 * - FAB or button to create new task
 * - Empty state
 * - Loading state
 * - Error state with retry
 */
export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigationProp>();
  const { logout } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    filter, 
    setFilter, 
    fetchTasks 
  } = useTasks();
  
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Navigate to task detail
  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  // Navigate to create new task
  const handleCreateTask = () => {
    navigation.navigate('TaskDetail', {});
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Render task item
  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard task={item} onPress={() => handleTaskPress(item)} />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View>
      <Text>No tasks yet</Text>
      <Text>Create your first task to get started</Text>
      <Button 
        title="Create Task" 
        onPress={handleCreateTask} 
        variant="primary" 
      />
    </View>
  );

  // TODO: Implement styling with NativeWind
  // TODO: Add FAB button for create
  // TODO: Add menu dropdown
  
  return (
    <SafeAreaView>
      {/* Header */}
      <Header 
        title="My Tasks" 
        showAvatar 
        onAvatarPress={() => setMenuVisible(!menuVisible)}
      />
      
      {/* Filter Tabs */}
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
      
      {/* Loading State */}
      {loading && !refreshing && (
        <View>
          <ActivityIndicator />
          <Text>Loading your tasks...</Text>
        </View>
      )}
      
      {/* Error State */}
      {error && (
        <View>
          <Text>{error}</Text>
          <Button title="Retry" onPress={fetchTasks} variant="secondary" />
        </View>
      )}
      
      {/* Task List */}
      {!loading && !error && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
      
      {/* Create Button (alternative to FAB) */}
      <Button 
        title="+ New Task" 
        onPress={handleCreateTask} 
        variant="primary" 
      />
    </SafeAreaView>
  );
}

export default TaskListScreen;


/**
 * TaskDetailScreen
 * Create and edit tasks
 */

import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../lib/types';
import { useTasks } from '../hooks';
import { Button, Input, Card } from '../components';

type TaskDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

// Status options for segmented control
const statusOptions: { key: TaskStatus; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

/**
 * Task detail screen for creating and editing tasks
 * 
 * Features:
 * - Create mode (no taskId) or Edit mode (with taskId)
 * - Title input (required)
 * - Description input (multiline)
 * - Status segmented control
 * - Deadline date picker
 * - Save button
 * - Delete button (edit mode only)
 */
export function TaskDetailScreen() {
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params || {};
  
  const { getTask, createTask, updateTask, deleteTask, loading } = useTasks();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [deadline, setDeadline] = useState('');
  const [initialLoading, setInitialLoading] = useState(!!taskId);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const isEditMode = !!taskId;

  // Load task data if editing
  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;
    
    setInitialLoading(true);
    const task = await getTask(taskId);
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDeadline(task.deadline || '');
    }
    setInitialLoading(false);
  };

  // Validate form
  const validate = (): boolean => {
    if (!title.trim()) {
      setValidationError('Title is required');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;
    
    const taskData: CreateTaskInput | UpdateTaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      deadline: deadline || null,
    };
    
    try {
      if (isEditMode && taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData as CreateTaskInput);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!taskId) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTask(taskId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // TODO: Implement styling with NativeWind
  // TODO: Add date picker for deadline
  // TODO: Add segmented control for status
  
  if (initialLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
        <Text>Loading task...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {/* Title */}
          <Text>
            {isEditMode ? 'Edit Task' : 'New Task'}
          </Text>
          
          <Card>
            {/* Title Input */}
            <Input
              label="Title"
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
              error={validationError && !title ? validationError : undefined}
            />
            
            {/* Description Input */}
            <Input
              label="Description"
              placeholder="Enter task description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
            
            {/* Status Selector */}
            <View>
              <Text>Status</Text>
              <View>
                {statusOptions.map((option) => (
                  <Button
                    key={option.key}
                    title={option.label}
                    onPress={() => setStatus(option.key)}
                    variant={status === option.key ? 'primary' : 'secondary'}
                    fullWidth={false}
                  />
                ))}
              </View>
            </View>
            
            {/* Deadline Input */}
            <Input
              label="Deadline"
              placeholder="YYYY-MM-DD (optional)"
              value={deadline}
              onChangeText={setDeadline}
            />
          </Card>
          
          {/* Action Buttons */}
          <View>
            <Button
              title="Save"
              onPress={handleSave}
              loading={loading}
              variant="primary"
            />
            
            {isEditMode && (
              <Button
                title="Delete Task"
                onPress={handleDelete}
                variant="destructive"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TaskDetailScreen;


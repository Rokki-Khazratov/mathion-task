/**
 * TaskCard component
 * Displays a task in the list view
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '../lib/types';
import { StatusBadge } from './ui';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

/**
 * Task card for the list view
 * Shows title, description preview, status badge, and deadline
 * 
 * @example
 * <TaskCard 
 *   task={task} 
 *   onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} 
 * />
 */
export function TaskCard({ task, onPress }: TaskCardProps) {
  // TODO: Format deadline as dd.MM.yyyy
  // TODO: Truncate description to 2 lines
  // TODO: Implement styling with NativeWind
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        // className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm mb-3"
      >
        {/* Header: Title + Status */}
        <View>
          <Text>{task.title}</Text>
          <StatusBadge status={task.status} />
        </View>
        
        {/* Description (if exists) */}
        {task.description && (
          <Text numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        {/* Deadline (if exists) */}
        {task.deadline && (
          <Text>
            Due: {task.deadline}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default TaskCard;


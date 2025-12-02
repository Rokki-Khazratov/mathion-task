/**
 * StatusBadge component
 * Displays task status as a colored pill
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TaskStatus } from '../../lib/types';

interface StatusBadgeProps {
  status: TaskStatus;
}

// Status display labels
const statusLabels: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};

/**
 * Reusable StatusBadge component
 * 
 * @example
 * <StatusBadge status="open" />
 * <StatusBadge status="in_progress" />
 * <StatusBadge status="done" />
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  // TODO: Implement styling with NativeWind
  // TODO: Add theme support and status colors
  
  return (
    <View
      // className={`...`} - will be styled based on status
    >
      <Text>
        {statusLabels[status]}
      </Text>
    </View>
  );
}

export default StatusBadge;


/**
 * FilterTabs component
 * Segmented control for filtering tasks by status
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter } from '../lib/types';

interface FilterTabsProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

// Filter options
const filters: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

/**
 * Filter tabs for task list
 * 
 * @example
 * <FilterTabs 
 *   activeFilter={filter} 
 *   onFilterChange={setFilter} 
 * />
 */
export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  // TODO: Implement styling with NativeWind
  // TODO: Add active state styling
  
  return (
    <View
      // className="flex-row bg-gray-100 dark:bg-neutral-800 rounded-xl p-1"
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          onPress={() => onFilterChange(filter.key)}
          // className={activeFilter === filter.key ? 'active' : ''}
        >
          <Text>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default FilterTabs;


/**
 * Card component
 * Container with shadow and rounded corners
 */

import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  padding?: boolean;
}

/**
 * Reusable Card component
 * 
 * @example
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 */
export function Card({ children, padding = true }: CardProps) {
  // TODO: Implement styling with NativeWind
  // className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm"
  
  return (
    <View
      // className={`...`} - will be styled with NativeWind
    >
      {children}
    </View>
  );
}

export default Card;


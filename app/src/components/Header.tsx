/**
 * Header component
 * App header with title, avatar, and menu
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  showAvatar?: boolean;
  onAvatarPress?: () => void;
  onThemeToggle?: () => void;
}

/**
 * Header component for screens
 * 
 * @example
 * <Header 
 *   title="My Tasks" 
 *   showAvatar 
 *   onAvatarPress={handleMenuOpen}
 * />
 */
export function Header({
  title,
  showAvatar = false,
  onAvatarPress,
  onThemeToggle,
}: HeaderProps) {
  // TODO: Implement avatar with user initials
  // TODO: Implement dropdown menu for logout/theme
  // TODO: Implement styling with NativeWind
  
  return (
    <View
      // className="flex-row items-center justify-between px-5 py-4"
    >
      <Text>
        {title}
      </Text>
      
      {showAvatar && (
        <TouchableOpacity onPress={onAvatarPress}>
          {/* Avatar placeholder */}
          <View>
            <Text>U</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Header;


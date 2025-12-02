import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Reusable Button component
 * 
 * @example
 * <Button title="Save" onPress={handleSave} variant="primary" />
 * <Button title="Cancel" onPress={handleCancel} variant="secondary" />
 * <Button title="Delete" onPress={handleDelete} variant="destructive" />
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  // TODO: Implement styling with NativeWind
  // TODO: Add theme support (light/dark)
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      // className={`...`} - will be styled with NativeWind
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;


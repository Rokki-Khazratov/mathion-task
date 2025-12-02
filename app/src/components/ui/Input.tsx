/**
 * Input component
 * Text input with label, error, and theme support
 */

import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable Input component
 * 
 * @example
 * <Input 
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 * />
 */
export function Input({
  label,
  error,
  helperText,
  ...props
}: InputProps) {
  // TODO: Implement styling with NativeWind
  // TODO: Add theme support (light/dark)
  
  return (
    <View>
      {label && (
        <Text>{label}</Text>
      )}
      <TextInput
        {...props}
        // className={`...`} - will be styled with NativeWind
      />
      {error && (
        <Text>{error}</Text>
      )}
      {helperText && !error && (
        <Text>{helperText}</Text>
      )}
    </View>
  );
}

export default Input;


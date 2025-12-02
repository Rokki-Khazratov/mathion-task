/**
 * RootNavigator
 * Main navigation configuration
 * Currently shows only Auth screen
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '../screens';

// Create stack navigator
const Stack = createNativeStackNavigator();

/**
 * Root Navigator
 * Shows only Auth screen for now
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;


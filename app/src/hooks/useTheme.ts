/**
 * useTheme hook
 * Wrapper around ThemeContext for easier usage
 */

import { useThemeContext } from '../context/ThemeContext';

/**
 * Hook to access theme state and methods
 * 
 * @example
 * const { theme, colors, isDark, toggleTheme } = useTheme();
 * 
 * <View style={{ backgroundColor: colors.background }}>
 *   <Button onPress={toggleTheme}>Toggle Theme</Button>
 * </View>
 */
export function useTheme() {
  return useThemeContext();
}

export default useTheme;


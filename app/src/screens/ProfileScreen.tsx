import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks';
import { useThemeContext } from '../context/ThemeContext';

// App version
const APP_VERSION = '1.0.0';

/**
 * Profile screen with user info and settings
 */
export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark, colors } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Default OFF
  
  // Sync local state with theme context
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);
  
  useEffect(() => {
    setDarkModeEnabled(isDark);
  }, [isDark]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    toggleTheme();
  };

  // Get user initial
  const getInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>
            Profil
          </Text>
        </View>

        {/* User Card */}
        <View style={{ 
          marginHorizontal: 20, 
          backgroundColor: colors.surface, 
          borderRadius: 16, 
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          marginBottom: 24,
        }}>
          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 32, fontWeight: '600', color: '#FFFFFF' }}>
                {getInitial()}
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              {user?.email || 'Benutzer'}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase' }}>
            Einstellungen
          </Text>
          
          <View style={{ 
            backgroundColor: colors.surface, 
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }}>
            {/* Dark Mode Toggle */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: '#E5E5EA',
            }}>
              <Ionicons name="moon-outline" size={22} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: colors.text }}>
                Dunkelmodus
              </Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            {/* Notifications with Switch */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: '#E5E5EA',
            }}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: colors.text }}>
                Benachrichtigungen
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            {/* Language (placeholder) */}
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
            }}>
              <Ionicons name="language-outline" size={22} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: colors.text }}>
                Sprache
              </Text>
              <Text style={{ fontSize: 16, color: colors.textSecondary, marginRight: 8 }}>Deutsch</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF3B30' }}>
              Abmelden
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            Version {APP_VERSION}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;

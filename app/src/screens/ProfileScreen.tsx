import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks';

/**
 * Profile screen with user info and settings
 */
export function ProfileScreen() {
  const { user, logout } = useAuth();

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Get user initial
  const getInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1D1D1F' }}>
            Profil
          </Text>
        </View>

        {/* User Card */}
        <View style={{ 
          marginHorizontal: 20, 
          backgroundColor: '#FFFFFF', 
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
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1D1D1F' }}>
              {user?.email || 'Benutzer'}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#86868B', marginBottom: 12, textTransform: 'uppercase' }}>
            Einstellungen
          </Text>
          
          <View style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          }}>
            {/* Dark Mode Toggle (placeholder) */}
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: '#E5E5EA',
            }}>
              <Ionicons name="moon-outline" size={22} color="#1D1D1F" />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1D1D1F' }}>
                Dunkelmodus
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#86868B" />
            </TouchableOpacity>

            {/* Notifications (placeholder) */}
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: '#E5E5EA',
            }}>
              <Ionicons name="notifications-outline" size={22} color="#1D1D1F" />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1D1D1F' }}>
                Benachrichtigungen
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#86868B" />
            </TouchableOpacity>

            {/* Language (placeholder) */}
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
            }}>
              <Ionicons name="language-outline" size={22} color="#1D1D1F" />
              <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1D1D1F' }}>
                Sprache
              </Text>
              <Text style={{ fontSize: 16, color: '#86868B', marginRight: 8 }}>Deutsch</Text>
              <Ionicons name="chevron-forward" size={20} color="#86868B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{
              backgroundColor: '#FFFFFF',
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;


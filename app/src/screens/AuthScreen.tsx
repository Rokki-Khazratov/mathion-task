/**
 * AuthScreen
 * Handles both login and registration
 */

import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../hooks';

type AuthMode = 'login' | 'register';

/**
 * Authentication screen with login/register toggle
 * 
 * Features:
 * - Toggle between Login and Register modes
 * - Email and password fields
 * - Confirm password (register only)
 * - Form validation
 * - Error display
 */
export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { login, register, loading, error } = useAuth();

  const isLogin = mode === 'login';

  // Toggle between login and register
  const toggleMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setValidationError(null);
  };

  // Validate form
  const validate = (): boolean => {
    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
    } catch (err) {
      // Error is handled by context
    }
  };

  // TODO: Implement styling with NativeWind
  // TODO: Add keyboard avoiding view for iOS
  // TODO: Add theme support
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          {/* Title */}
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 32, textAlign: 'center' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          {/* Mode Toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={{
                flex: 1,
                backgroundColor: isLogin ? '#FFFFFF' : 'transparent',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: isLogin ? '600' : '400', color: '#1D1D1F' }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('register')}
              style={{
                flex: 1,
                backgroundColor: !isLogin ? '#FFFFFF' : 'transparent',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: !isLogin ? '600' : '400', color: '#1D1D1F' }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Card */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1D1D1F', marginBottom: 8 }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#86868B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ backgroundColor: '#F2F2F7', borderRadius: 12, padding: 12, fontSize: 16, color: '#1D1D1F' }}
              />
            </View>
            
            {/* Password Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1D1D1F', marginBottom: 8 }}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#86868B"
                secureTextEntry
                style={{ backgroundColor: '#F2F2F7', borderRadius: 12, padding: 12, fontSize: 16, color: '#1D1D1F' }}
              />
            </View>
            
            {/* Confirm Password (register only) */}
            {!isLogin && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1D1D1F', marginBottom: 8 }}>Confirm Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#86868B"
                  secureTextEntry
                  style={{ backgroundColor: '#F2F2F7', borderRadius: 12, padding: 12, fontSize: 16, color: '#1D1D1F' }}
                />
              </View>
            )}
            
            {/* Error Display */}
            {(validationError || error) && (
              <Text style={{ color: '#FF3B30', marginBottom: 16 }}>
                {validationError || error}
              </Text>
            )}
            
            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              style={{ backgroundColor: '#007AFF', borderRadius: 25, padding: 16, alignItems: 'center', marginTop: 8, opacity: loading ? 0.6 : 1 }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Toggle Mode Link */}
          <Text 
            onPress={toggleMode}
            style={{ marginTop: 20, textAlign: 'center', color: '#007AFF', fontSize: 14 }}
          >
            {isLogin 
              ? "Don't have an account? Create one" 
              : 'Already have an account? Sign in'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthScreen;


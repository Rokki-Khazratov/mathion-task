import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks';
import { useThemeContext } from '../context/ThemeContext';

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
 * - Email confirmation page after registration
 */
export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { login, register, loading, error, registrationSuccess, clearRegistrationSuccess } = useAuth();
  const { colors, isDark } = useThemeContext();

  const isLogin = mode === 'login';

  // Toggle between login and register
  const toggleMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setValidationError(null);
  };

  // Navigate to login after registration confirmation
  const goToLogin = () => {
    clearRegistrationSuccess();
    setMode('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setValidationError(null);
  };

  // Validate form
  const validate = (): boolean => {
    if (!email || !password) {
      setValidationError('Bitte fülle alle Felder aus');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setValidationError('Passwörter stimmen nicht überein');
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

  // Show email confirmation page after successful registration
  if (registrationSuccess) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' }}>
          {/* Success Icon */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#34C759',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Ionicons name="mail-outline" size={40} color="#FFFFFF" />
          </View>
          
          {/* Title */}
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Bestätige deine E-Mail
          </Text>
          
          {/* Description */}
          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
            paddingHorizontal: 20,
          }}>
            Wir haben dir eine Bestätigungs-E-Mail gesendet. Bitte überprüfe dein Postfach und klicke auf den Link, um dein Konto zu aktivieren.
          </Text>
          
          {/* Info Card */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            width: '100%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.1,
            shadowRadius: 8,
            marginBottom: 32,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginLeft: 8 }}>
                Hinweis
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
              Überprüfe auch deinen Spam-Ordner, falls du die E-Mail nicht findest.
            </Text>
          </View>
          
          {/* Go to Login Button */}
          <TouchableOpacity
            onPress={goToLogin}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 25,
              paddingVertical: 16,
              paddingHorizontal: 32,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              Zur Anmeldung
            </Text>
          </TouchableOpacity>
          
          {/* Secondary Link */}
          <Text
            onPress={goToLogin}
            style={{ marginTop: 20, textAlign: 'center', color: colors.textSecondary, fontSize: 14 }}
          >
            E-Mail bestätigt?{' '}
            <Text style={{ color: colors.accent, fontWeight: '500' }}>Jetzt anmelden</Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          {/* Title */}
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 32, textAlign: 'center' }}>
            {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
          </Text>
          
          {/* Mode Toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={{
                flex: 1,
                backgroundColor: isLogin ? colors.surface : 'transparent',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: isLogin ? '600' : '400', color: colors.text }}>
                Anmelden
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('register')}
              style={{
                flex: 1,
                backgroundColor: !isLogin ? colors.surface : 'transparent',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: !isLogin ? '600' : '400', color: '#1D1D1F' }}>
                Registrieren
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Card */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0.2 : 0.1, shadowRadius: 8 }}>
            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>E-Mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Deine E-Mail-Adresse eingeben"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ backgroundColor: colors.border, borderRadius: 12, padding: 12, fontSize: 16, color: colors.text }}
              />
            </View>
            
            {/* Password Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Passwort</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Dein Passwort eingeben"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  style={{ backgroundColor: colors.border, borderRadius: 12, padding: 12, paddingRight: 45, fontSize: 16, color: colors.text }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 12 }}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Confirm Password (register only) */}
            {!isLogin && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Passwort bestätigen</Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Passwort bestätigen"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    style={{ backgroundColor: colors.border, borderRadius: 12, padding: 12, paddingRight: 45, fontSize: 16, color: colors.text }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 12, top: 12 }}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#86868B" 
                    />
                  </TouchableOpacity>
                </View>
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
                {loading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Konto erstellen')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Toggle Mode Link */}
          <Text 
            onPress={toggleMode}
            style={{ marginTop: 20, textAlign: 'center', color: '#007AFF', fontSize: 14 }}
          >
            {isLogin 
              ? "Noch kein Konto? Jetzt registrieren" 
              : 'Bereits ein Konto? Jetzt anmelden'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthScreen;


import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      // Use the login function from context
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al intentar iniciar sesión');
    }
  };

  return (
    <BackgroundWrapper>
      <ThemedView style={styles.container}>
        {/* Círculos decorativos */}
        <View style={styles.circlesContainer}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
        </View>

        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>Inicia tu camino</ThemedText>

          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo-hekate-circle.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#999999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>

          <View style={styles.loginOptions}>
            <ThemedText style={styles.loginWithText}>Iniciar sesión con:</ThemedText>
            <TouchableOpacity style={styles.googleButton}>
              <Ionicons name="logo-google" size={24} color="#1253AA" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </ThemedText>
          </TouchableOpacity>

          <Link href="/auth/register" asChild replace>
            <TouchableOpacity style={styles.linkButton}>
              <ThemedText>
                <ThemedText style={styles.normalText}>¿No tienes cuenta? </ThemedText>
                <ThemedText style={styles.registerText}>Regístrate</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </ThemedView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F4FF',
    justifyContent: 'center',
  },
  circlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: '#1253AA',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -110,
    left: -20,
    opacity: 0.7,
    transform: [{ rotate: '-15deg' }],
  },
  circle2: {
    width: 200,
    height: 200,
    top: -50,
    left: -90,
    opacity: 0.7,
    backgroundColor: '#1253AA',
    transform: [{ rotate: '15deg' }],
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 28,
    color: '#003A5C',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1253AA',
    fontSize: 14,
  },
  loginOptions: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginWithText: {
    marginBottom: 10,
    color: '#666',
  },
  googleButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  button: {
    backgroundColor: '#1253AA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  normalText: {
    color: '#000000',
    fontSize: 16,
  },
  registerText: {
    color: '#1253AA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  buttonDisabled: {
    backgroundColor: '#80D1F0',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
});
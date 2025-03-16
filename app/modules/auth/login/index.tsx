import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@shared/components/ThemedText';
import { ThemedView } from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.info) {
        setError(data.info);
        return;
      }

      router.replace('/(tabs)');
    } catch (err) {
      setError('Error al intentar iniciar sesión');
    }
  };

  return (
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
            source={require('@/assets/images/icon.png')}
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
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
        </TouchableOpacity>

        <View style={styles.loginOptions}>
          <ThemedText style={styles.loginWithText}>Iniciar sesión con:</ThemedText>
          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Iniciar sesión</ThemedText>
        </TouchableOpacity>

        <Link href="/auth/register" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <ThemedText style={styles.linkText}>¿No tienes cuenta? Regístrate</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  circlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: '#A1CEDC',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    left: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 28,
    color: '#1D3D47',
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0a7ea4',
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
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#1D3D47',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});
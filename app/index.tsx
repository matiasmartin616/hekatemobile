import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, ErrorBoundaryProps } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useAuth } from '@shared/context/AuthContext';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  console.log('App iniciando - verificando rutas y autenticación');
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Error en la página principal</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity style={styles.errorButton} onPress={retry}>
        <Text style={styles.errorButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Index() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  console.log('index principal');
  // Show a loading indicator while checking auth
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Verificando autenticación...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isAuthenticated ? <Redirect href="/(routes)/auth/login" /> : <Redirect href="/(tabs)" />}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
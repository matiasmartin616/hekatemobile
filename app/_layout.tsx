import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useColorScheme from '@shared/hooks/useColorScheme';
import { AuthProvider } from '@shared/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// For development, enable all logs
//LogBox.ignoreAllLogs(false);

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  console.log('ErrorBoundary');
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>¡Algo salió mal!</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity style={styles.errorButton} onPress={retry}>
        <Text style={styles.errorButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  SplashScreen.hideAsync();
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(routes)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
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
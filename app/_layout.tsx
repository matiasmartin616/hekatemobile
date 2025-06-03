import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, ErrorBoundaryProps, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import { AuthProvider } from '@/app/modules/shared/context/auth-context';
import ModalProvider from '@/app/modules/shared/context/modal-context';
import { useCallback, useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './modules/shared/services/query-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// For development, enable all logs
LogBox.ignoreAllLogs(false);

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
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
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load important images
        await Asset.loadAsync([
          require('@/assets/images/app-main-background.png'),
          // Add any other important images here
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <ThemeProvider value={colorScheme.mode === 'dark' ? DarkTheme : DefaultTheme}>
            <ModalProvider>
              <Stack
                screenOptions={{ headerShown: false }}
                linking={{
                  prefixes: ['hekate://'],
                  config: {
                    screens: {
                      '(routes)/(public)/auth/reset-password': 'reset-password',
                    },
                  },
                }}
              />
            </ModalProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
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
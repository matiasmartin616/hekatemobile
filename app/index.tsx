import { DefaultTheme } from '@react-navigation/native';
import { DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useAuth } from '@modules/auth/hooks/useAuth';

export default function Index() {
  const colorScheme = useColorScheme();
  /* const { isAuthenticated } = useAuth(); */
  const isAuthenticated = false;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isAuthenticated ? <Redirect href="/auth/login" /> : <Redirect href="/(tabs)" />}

      <Stack>
        <Stack.Screen name="(routes)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
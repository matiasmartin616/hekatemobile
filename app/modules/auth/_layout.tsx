import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Registro',
          headerShown: false
        }}
      />
    </Stack>
  );
}
import { Stack } from 'expo-router';

export default function RoutesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
        </Stack>
    );
}
import { Stack, useRouter } from "expo-router";
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function PrivateLayout() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/(routes)/(public)/auth/login');
        }
    }, [user, isLoading]);

    if (isLoading) return <ActivityIndicator size="large" />;
    if (!user) return null; // Redirección en progreso

    return (
        <Stack screenOptions={{ headerShown: false }}/>
    );
}
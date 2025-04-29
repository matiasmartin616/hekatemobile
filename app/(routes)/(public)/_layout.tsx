import { Slot, Stack, useRouter } from "expo-router";
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { useEffect } from "react";

export default function PublicLayout() {
    const { user } = useAuth();
    const router = useRouter();
    // Evita que un usuario logueado vuelva al login
    useEffect(() => {
        if (user) router.push("/(routes)/(private)/(tabs)");
    }, [user]);

    return (
        <Stack screenOptions={{ headerShown: false }}/>
    );
}

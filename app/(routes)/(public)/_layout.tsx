import { Stack, useRouter } from "expo-router";
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { useEffect } from "react";

export default function PublicLayout() {
    const { user } = useAuth();
    const router = useRouter();
    console.log('llega a public layout', user);
    // Evita que un usuario logueado vuelva al login
    /* useEffect(() => {
        if (user) router.replace("/(routes)/(private)/(tabs)/home");
    }, [user]); */

    return <Stack screenOptions={{ headerShown: false }} />;
}

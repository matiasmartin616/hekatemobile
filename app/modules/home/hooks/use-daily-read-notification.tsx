import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const DAILY_READ_NOTIFICATION_KEY = 'daily_read_notification_key';

export default function useDailyReadNotification() {
    const router = useRouter();
    const [showNotification, setShowNotification] = useState(false);

    const checkNotificationStatus = async () => {
        try {
            const lastShownDate = await AsyncStorage.getItem(DAILY_READ_NOTIFICATION_KEY);
            const today = new Date().toDateString();

            if (!lastShownDate || lastShownDate !== today) {
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error checking notification status:', error);
            setShowNotification(true); // Show by default if there's an error
        }
    };

    const handleReadNow = async () => {
        try {
            // Save today's date as the last shown date
            await AsyncStorage.setItem(DAILY_READ_NOTIFICATION_KEY, new Date().toDateString());
            setShowNotification(false);
            router.push('/(routes)/(private)/(tabs)/reading');
        } catch (error) {
            console.error('Error saving notification status:', error);
            router.push('/(routes)/(private)/(tabs)/reading');
        }
    };

    return {
        checkNotificationStatus,
        handleReadNow,
        showNotification
    }
}
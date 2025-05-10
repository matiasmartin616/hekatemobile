import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedView from '@/app/modules/shared/components/themed-view';
import DreamSection from '@modules/home/components/dream-section';
import PrivateRoutineSection from '@/app/modules/home/components/private-routine-section';
import InspirationCard from '@modules/home/components/inspiration-card';
import DailyReadNotificationButton from '@modules/home/components/daily-read-notification-button';
import colors from '@/app/modules/shared/theme/theme';
import { router } from 'expo-router';
import { DAILY_READ_NOTIFICATION_KEY, months } from '@/app/modules/shared/constants/const';



export default function HomeScreen() {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        checkNotificationStatus();
    }, []);

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

    const date = new Date().toLocaleDateString().split('/');
    const formattedDate = `${date[0]} de ${months[parseInt(date[1]) - 1]} de ${date[2]}`;
    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                <InspirationCard
                    message="Cree en ti mismo y todo será posible"
                    onShare={() => { }}
                    date={formattedDate}
                />

                {showNotification && (
                    <DailyReadNotificationButton onReadNow={handleReadNow} />
                )}

                <DreamSection />

                <PrivateRoutineSection />

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.palette.blue[20],
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
    },
});

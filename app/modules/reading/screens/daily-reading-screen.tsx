import { useQuery } from "@tanstack/react-query";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import readingApi from "../api/reading";
import ThemedText from "@/app/modules/shared/components/themed-text";
import colors from "../../shared/theme/theme";
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { DAILY_READ_NOTIFICATION_KEY } from "@/app/modules/shared/constants/const";

export default function DailyReadingScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dailyReading'],
        queryFn: () => readingApi.getDailyReading(),
    });

    const homeNotificationCheck = async () => {
        try {
            const lastShownDate = await AsyncStorage.getItem(DAILY_READ_NOTIFICATION_KEY);
            const today = new Date().toDateString();

            if (!lastShownDate || lastShownDate !== today) {
                await AsyncStorage.setItem(DAILY_READ_NOTIFICATION_KEY, new Date().toDateString());
            }

            router.push('/(routes)/(private)/(tabs)/reading');
        } catch (error) {
            console.error('Error saving notification status:', error);
            router.push('/(routes)/(private)/(tabs)/reading');
        }
    }

    useEffect(() => {
        homeNotificationCheck();
    }, []);

    return (
        isLoading
            ? <ActivityIndicator />
            :
            <ScrollView style={styles.container}>
                <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>{data?.title}</ThemedText>
                <ThemedText style={{ fontSize: 16, marginTop: 20 }}>{data?.content}</ThemedText>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.palette.blue[20],
        padding: 20,
    },
});
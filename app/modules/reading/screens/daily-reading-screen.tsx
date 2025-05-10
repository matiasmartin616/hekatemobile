import { useQuery } from "@tanstack/react-query";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import readingApi from "../api/reading";
import ThemedText from "@/app/modules/shared/components/themed-text";
import colors from "../../shared/theme/theme";
import { useRouter } from "expo-router";

export default function DailyReadingScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dailyReading'],
        queryFn: () => readingApi.getDailyReading(),
    });

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
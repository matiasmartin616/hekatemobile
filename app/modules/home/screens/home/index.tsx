import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import ThemedView from '@/app/modules/shared/components/themed-view';
import DreamSection from '@modules/home/components/dream-section';
import RoutineSection from '@modules/home/components/routine-section';
import InspirationCard from '@modules/home/components/inspiration-card';
import DailyReadNotificationButton from '@modules/home/components/daily-read-notification-button';
import colors from '@/app/modules/shared/constants/Colors';
import { router } from 'expo-router';

const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export default function HomeScreen() {

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

                <DailyReadNotificationButton onReadNow={() => { router.push('/(routes)/(private)/(tabs)/reading') }} />

                <DreamSection />

                <RoutineSection />

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 20,
    },
});

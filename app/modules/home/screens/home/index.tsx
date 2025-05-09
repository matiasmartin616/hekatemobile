import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import ThemedView from '@/app/modules/shared/components/themed-view';
import DreamSection from '@modules/home/components/dream-section';
import RoutineSection from '@modules/home/components/routine-section';
import InspirationCard from '@modules/home/components/inspiration-card';
import DailyReadNotificationButton from '@modules/home/components/daily-read-notification-button';

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

                <DailyReadNotificationButton />

                <DreamSection />

                <RoutineSection />

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 20,
    },
    menuItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    menuText: {
        fontSize: 16,
        color: '#000000',
    },
});

import { StyleSheet, ScrollView } from 'react-native';
import { useEffect } from 'react';
import ThemedView from '@/app/modules/shared/components/themed-view';
import DreamSection from '@modules/home/components/dream-section';
import PrivateRoutineSection from '@/app/modules/home/components/private-routine-section';
import InspirationCard from '@modules/home/components/inspiration-card';
import DailyReadNotificationButton from '@modules/home/components/daily-read-notification-button';
import colors from '@/app/modules/shared/theme/theme';
import { months } from '@/app/modules/shared/constants/const';
import useDailyReadNotification from '../../hooks/use-daily-read-notification';



export default function HomeScreen() {
    const { checkNotificationStatus, handleReadNow, showNotification } = useDailyReadNotification();
    
    useEffect(() => {
        checkNotificationStatus();
    }, []);



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

import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import DreamSection from '@modules/home/components/dream-section';
import RoutineSection from '@modules/home/components/routine-section';
import InspirationCard from '@modules/home/components/inspiration-card';

export default function HomeScreen() {
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
                    onArchive={() => { }}
                />

                <DreamSection />

                <RoutineSection />

                <Link href="/reading" asChild>
                    <TouchableOpacity style={styles.menuItem}>
                        <ThemedText style={styles.menuText}>Lectura diaria</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color="#1253AA" />
                    </TouchableOpacity>
                </Link>
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
        paddingHorizontal: 20,
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

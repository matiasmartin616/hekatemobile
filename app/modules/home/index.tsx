import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import DreamSection from './sections/dreams/dream-section';
import RoutineSection from './sections/routines/RoutineSection';
import InspirationCard from './components/InspirationCard';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            {/* Contenido principal */}
            <View style={styles.content}>
                <InspirationCard
                    message="Cree en ti mismo y todo será posible"
                    onShare={() => {}}
                    onArchive={() => {}}
                />

                <DreamSection />
                
                <RoutineSection />

                <Link href="/(tabs)/reading" asChild>
                    <TouchableOpacity style={styles.menuItem}>
                        <ThemedText style={styles.menuText}>Lectura diaria</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color="#1253AA" />
                    </TouchableOpacity>
                </Link>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
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

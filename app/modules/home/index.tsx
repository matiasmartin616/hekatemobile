import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import DreamSection from './sections/dreams/dream-section';
import { useState } from 'react';

export default function HomeScreen() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Esperar un poco para dar feedback visual
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsRefreshing(false);
    };

    return (
        <ThemedView style={styles.container}>

            {/* Contenido principal */}
            <View style={styles.content}>
                <DreamSection />

                <Link href="/routine" asChild>
                    <TouchableOpacity style={styles.menuItem}>
                        <ThemedText style={styles.menuText}>Rutina</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color="#1253AA" />
                    </TouchableOpacity>
                </Link>

                <Link href="/daily-reading" asChild>
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
    circlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 200,
        backgroundColor: '#1253AA',
    },
    circle1: {
        width: 200,
        height: 200,
        top: -110,
        left: -20,
        opacity: 0.7,
        transform: [{ rotate: '-15deg' }],
    },
    circle2: {
        width: 200,
        height: 200,
        top: -50,
        left: -90,
        opacity: 0.7,
        transform: [{ rotate: '15deg' }],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
        //backgroundColor: '#3478BE', // Azul más claro que el original
        paddingBottom: 15,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    refreshButton: {
        padding: 8,
    },
    refreshIcon: {
        opacity: 1,
    },
    refreshing: {
        opacity: 0.5,
        transform: [{ rotate: '180deg' }],
    },
});

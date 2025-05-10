import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import useDreamsApiFetching from '../hooks/use-dreams-api';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/app/modules/shared/theme/theme';

export default function DreamDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const { dreams, isLoading } = useDreamsApiFetching();

    const dream = dreams?.find(d => d.id === id);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    }

    if (!dream) {
        return (
            <View style={styles.container}>
                <ThemedText>Dream not found</ThemedText>
            </View>
        );
    }

    return (
        <View style={[styles.container]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color={theme.colors.light.primary.main} />
            </TouchableOpacity>

            <ScrollView>
                <View style={styles.content}>
                    <ThemedText style={styles.title}>{dream.title}</ThemedText>
                    <ThemedText style={styles.description}>{dream.text}</ThemedText>

                    <View style={styles.metadataContainer}>
                        <ThemedText style={styles.metadata}>
                            Created: {new Date(dream.createdAt).toLocaleDateString()}
                        </ThemedText>
                        <ThemedText style={styles.metadata}>
                            Status: {dream.todayVisualizations}
                        </ThemedText>
                        {dream.visualizations && (
                            <ThemedText style={styles.metadata}>
                                Visualizations: {dream.visualizations.length}
                            </ThemedText>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.palette.blue[100],
    },
    backButton: {
        zIndex: 1,
        padding: 8,
        marginLeft: 70,
        marginTop: 80,
    },
    content: {
        padding: 16,
        paddingTop: 64,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    metadataContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(165, 95, 95, 0.47)',
    },
    metadata: {
        fontSize: 14,
        marginBottom: 8,
    },
}); 
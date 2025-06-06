import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import useDreamsApi from '../hooks/use-dreams-api';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/app/modules/shared/theme/theme';
import EditDreamForm from '../components/edit-dream-form';
import { useModal } from '../../shared/context/modal-context';

export default function DreamDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const { dreams, isLoading, deleteDream } = useDreamsApi();
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

    const { openModal, closeModal } = useModal();

    const handleEditDream = () => {
        openModal(<EditDreamForm dream={dream} />);
    }

    const handleDeleteDream = () => {
        deleteDream.mutate(dream.id, {
            onSuccess: () => {
                closeModal();
                router.back();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    const handleDeleteDreamConfirmation = () => {
        openModal(
            <View>
                <ThemedText>¿Estás seguro de querer eliminar este sueño?</ThemedText>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                    <TouchableOpacity onPress={handleDeleteDream} style={styles.deleteButton}>
                        <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal} style={{ marginTop: 10 }}>
                        <ThemedText>Cancelar</ThemedText>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.light.primary.main} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={handleEditDream}>
                    <ThemedText style={styles.editButtonText}>Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDreamConfirmation}>
                    <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                </TouchableOpacity>
            </View>

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
        backgroundColor: colors.light.background.main,
    },
    header: {
        marginTop: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        zIndex: 1,
        padding: 8,
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
    editButton: {
        width: 60,
        height: 30,
        backgroundColor: colors.light.palette.blue[500],
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    editButtonText: {
        color: colors.light.neutral.white,
    },
    deleteButton: {
        width: 60,
        height: 30,
        backgroundColor: colors.light.palette.red[500],
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        color: colors.light.neutral.white,
    },
}); 
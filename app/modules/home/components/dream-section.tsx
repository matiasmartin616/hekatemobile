import { useState } from 'react';
import { StyleSheet, Alert, FlatList, TouchableOpacity, View, Text } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import useDreamsApiFetching from '../../dreams/hooks/use-dreams-api';
import DreamCard from './dream-card';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useModal } from '@/app/modules/shared/context/modal-context';
import colors from '@/app/modules/shared/theme/theme';

export default function DreamSection() {
    const theme = useTheme();
    const router = useRouter();
    const { dreams, isLoading, refetch, visualizeDream, createDream } = useDreamsApiFetching();
    const [visualizingDreamId, setVisualizingDreamId] = useState<string | null>(null);
    const { openModal, closeModal } = useModal();

    const handleSeeDreamDetail = (dreamId: string) => {
        router.push(`/dreams/${dreamId}`);
    };
    const MyComponent = () => {
        return (
            <View>
                <Text>TODO: Crear sueño</Text>
            </View>
        );
    };
    const handleAddDream = () => {
        // Open the modal with a form to create a new dream
        openModal(
            <MyComponent />
        );
    };

    const handleVisualize = async (dreamId: string) => {
        setVisualizingDreamId(dreamId);
        visualizeDream.mutate(
            { dreamId },
            {
                onSuccess: () => {
                    refetch();
                    setVisualizingDreamId(null);
                },
                onError: () => {
                    setVisualizingDreamId(null);
                    Alert.alert('Error', 'No se pudo visualizar el sueño. Inténtalo de nuevo.');
                }
            }
        );
    };

    if (isLoading) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.light.primary.main }]}>Cargando sueños...</ThemedText>;
    }
    if (dreams && dreams.length === 0) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.light.primary.main }]}>No hay sueños disponibles</ThemedText>;
    }



    // Combine dreams data with an extra item for the "Add Dream" button
    const listData = dreams && dreams.length > 0
        ? [...dreams, { id: 'add-dream-button', isAddButton: true }]
        : [{ id: 'add-dream-button', isAddButton: true }];

    return (
        <FlatList
            data={listData}
            keyExtractor={item => item.id}
            style={styles.flatList}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingVertical: theme.spacing.sm,
                paddingLeft: theme.spacing.sm
            }}
            renderItem={({ item }) => {
                // Render add dream button if this is the special item
                if ('isAddButton' in item) {
                    return (
                        <TouchableOpacity
                            style={styles.addDreamButton}
                            onPress={handleAddDream}
                        >
                            <View style={styles.addDreamButtonInner}>
                                <Ionicons name="add" size={32} color={theme.colors.light.primary.main} />
                                <Text style={[styles.addDreamText, { color: theme.colors.light.primary.main }]}>Añadir sueño</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }

                // Otherwise render normal dream card
                return (
                    <DreamCard
                        title={item.title}
                        description={item.text}
                        images={[require('@assets/images/dream-carousel-default-image.png'), require('@assets/images/dream-carousel-default-image.png')]}
                        onViewComplete={() => handleSeeDreamDetail(item.id)}
                        onAddImage={() => { }}
                        onVisualize={() => handleVisualize(item.id)}
                        isVisualized={!item.canVisualize || item.slotVisualized}
                        isVisualizing={visualizingDreamId === item.id}
                    />
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        padding: 16,
        textAlign: 'center',
    },
    flatList: {
        width: '100%',
        marginLeft: -4,
        marginTop: 8
    },
    addDreamButton: {
        width: 180,
        height: 220,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.light.palette.blue[200],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        backgroundColor: colors.light.palette.blue[50]
    },
    addDreamButtonInner: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    addDreamText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600'
    }
}); 
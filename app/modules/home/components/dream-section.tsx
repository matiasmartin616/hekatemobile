import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TextInput, Text, Alert, FlatList } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dreamsApi, Dream } from '../../dreams/api/dreams';
import useDreamsApiFetching from '../../dreams/hooks/use-dreams-api';
import DreamCard from './dream-card';
import { useTheme } from '@/app/modules/shared/theme/useTheme';

export default function DreamSection() {
    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [newDream, setNewDream] = useState({ title: '', text: '' });
    const [editingDream, setEditingDream] = useState<Dream | null>(null);
    const { dreams, isLoading, error, refetch, createDream, updateDream, archiveDream, visualizeDream, deleteDream } = useDreamsApiFetching();

    const handleVisualize = async (dreamId: string) => {
        visualizeDream.mutate({ dreamId });
        refetch();
    };

    const handleCreateDream = async () => {
        createDream.mutate({ title: newDream.title, text: newDream.text, maxDaily: 1 });
    };

    const handleEditDream = async () => {
        if (!editingDream) return;
        try {
            updateDream.mutate({
                dreamId: editingDream.id,
                dream: {
                    title: editingDream.title,
                    text: editingDream.text
                }
            });
            setModalVisible(false);
            setEditingDream(null);
            refetch();
        } catch (error) {
            console.error('Error updating dream:', error);
        }
    };

    const openEditModal = (dream: Dream) => {
        setEditingDream(dream);
        setModalVisible(true);
    };

    const handleDeleteDream = async (dreamId: string) => {
        try {
            deleteDream.mutate(dreamId);
            refetch();
        } catch (error) {
            console.error('Error deleting dream:', error);
            Alert.alert(
                'Error',
                'No se pudo eliminar el sueño. Por favor, inténtalo de nuevo.',
                [{ text: 'OK' }]
            );
        }
    };

    if (isLoading) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.primary.main }]}>Cargando sueños...</ThemedText>;
    }
    if (dreams && dreams.length === 0) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.primary.main }]}>No hay sueños disponibles</ThemedText>;
    }

    return (
        <FlatList
            data={dreams}
            keyExtractor={item => item.id}
            style={styles.flatList}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingVertical: theme.spacing.sm,
                paddingLeft: theme.spacing.sm
            }}
            renderItem={({ item }) => (
                <DreamCard
                    title={item.title}
                    description={item.text}
                    images={[require('@assets/images/dream-carousel-default-image.png'), require('@assets/images/dream-carousel-default-image.png')]}
                    onViewComplete={() => openEditModal(item)}
                    onAddImage={() => { }}
                    onVisualize={() => handleVisualize(item.id)}
                />
            )}
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
    }
}); 
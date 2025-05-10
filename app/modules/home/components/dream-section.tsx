import { useState } from 'react';
import { StyleSheet, Alert, FlatList, TouchableOpacity, View, Text } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import useDreamsApi from '../../dreams/hooks/use-dreams-api';
import DreamCard from './dream-card';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useModal } from '@/app/modules/shared/context/modal-context';
import colors from '@/app/modules/shared/theme/theme';
import CreateDreamForm from './form/create-dream-form';

export default function DreamSection() {
    const theme = useTheme();
    const router = useRouter();
    const { dreams, isLoading, refetch, createDream } = useDreamsApi();
    const { openModal } = useModal();

    const handleSeeDreamDetail = (dreamId: string) => {
        router.push(`/dreams/${dreamId}`);
    };
    const handleAddDream = () => {
        // Open the modal with a form to create a new dream
        openModal(
            <CreateDreamForm />
        );
    };

    if (isLoading) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.light.primary.main }]}>Cargando sueños...</ThemedText>;
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
                        id={item.id}
                        title={item.title}
                        description={item.text}
                        canVisualize={item.canVisualize}
                        slotVisualized={item.slotVisualized}
                        images={[
                            'https://inmoclip.com/wp-content/uploads/2023/10/comprar-una-casa-en-la-playa.jpg',
                            'https://inmoclip.com/wp-content/uploads/2023/10/comprar-una-casa-en-la-playa.jpg'
                        ]}
                        onViewComplete={() => handleSeeDreamDetail(item.id)}
                        onAddImage={() => { }}
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
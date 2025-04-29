import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TextInput, Text, Alert } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import { dreamsApi, Dream } from '../../dreams/api/dreams';

export default function DreamSection() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newDream, setNewDream] = useState({ title: '', text: '' });
    const [editingDream, setEditingDream] = useState<Dream | null>(null);

    useEffect(() => {
        loadDreams();
    }, []);

    const loadDreams = async () => {
        try {
            const response = await dreamsApi.getDreams();
            setDreams(response);
        } catch (error) {
            console.error('Error loading dreams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVisualize = async (dreamId: string) => {
        try {
            await dreamsApi.visualizeDream(dreamId);
            // Recargar los sueños para actualizar estados
            loadDreams();
        } catch (error) {
            console.error('Error visualizing dream:', error);
        }
    };

    const handleCreateDream = async () => {
        try {
            await dreamsApi.createDream({
                title: newDream.title,
                text: newDream.text,
                maxDaily: 1 // valor por defecto
            });
            setModalVisible(false);
            setNewDream({ title: '', text: '' });
            loadDreams(); // Recargar la lista
        } catch (error) {
            console.error('Error creating dream:', error);
        }
    };

    const handleEditDream = async () => {
        if (!editingDream) return;

        try {
            await dreamsApi.updateDream(editingDream.id, {
                title: editingDream.title,
                text: editingDream.text
            });
            setModalVisible(false);
            setEditingDream(null);
            loadDreams();
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
            await dreamsApi.deleteDream(dreamId);
            setDreams(currentDreams => currentDreams.filter(dream => dream.id !== dreamId));
        } catch (error) {
            console.error('Error deleting dream:', error);
            Alert.alert(
                'Error',
                'No se pudo eliminar el sueño. Por favor, inténtalo de nuevo.',
                [{ text: 'OK' }]
            );
        }
    };

    const renderLeftActions = (dreamId: string, dragX: any) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => {
                    Alert.alert(
                        'Confirmar',
                        '¿Eliminar este elemento?',
                        [
                            {
                                text: 'Cancelar',
                                style: 'cancel'
                            },
                            {
                                text: 'Eliminar',
                                onPress: () => handleDeleteDream(dreamId),
                                style: 'destructive'
                            }
                        ]
                    );
                }}
            >
                <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity
                style={styles.headerContainer}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <View style={styles.titleContainer}>
                    <Ionicons
                        name={isExpanded ? "chevron-down" : "chevron-forward"}
                        size={20}
                        color="#000000"
                    />
                    <Text style={styles.title}>Sueños</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setEditingDream(null);
                        setNewDream({ title: '', text: '' });
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={24} color="#1253AA" />
                </TouchableOpacity>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.content}>
                    {loading ? (
                        <ThemedText>Cargando sueños...</ThemedText>
                    ) : dreams.length === 0 ? (
                        <ThemedText>No hay sueños disponibles</ThemedText>
                    ) : (
                        dreams.map((dream) => (
                            <Swipeable
                                key={dream.id}
                                renderLeftActions={(progress, dragX) =>
                                    renderLeftActions(dream.id, dragX)
                                }
                                leftThreshold={40}
                                friction={2}
                                overshootLeft={false}
                            >
                                <View style={styles.dreamItem}>
                                    <TouchableOpacity
                                        style={styles.dreamTextContainer}
                                        onPress={() => openEditModal(dream)}
                                    >
                                        <ThemedText style={styles.dreamTitle}>{dream.title}</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleVisualize(dream.id)}
                                        disabled={!dream.canVisualize}
                                    >
                                        <Ionicons
                                            name={dream.slotVisualized ? "eye" : "eye-outline"}
                                            size={24}
                                            color={dream.canVisualize ? "#1253AA" : "#999999"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Swipeable>
                        ))
                    )}
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {
                    setModalVisible(false);
                    setEditingDream(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>
                            {editingDream ? 'Editar Sueño' : 'Nuevo Sueño'}
                        </ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Título del sueño"
                            value={editingDream ? editingDream.title : newDream.title}
                            onChangeText={(text) => {
                                if (editingDream) {
                                    setEditingDream({ ...editingDream, title: text });
                                } else {
                                    setNewDream(prev => ({ ...prev, title: text }));
                                }
                            }}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descripción"
                            value={editingDream ? editingDream.text : newDream.text}
                            onChangeText={(text) => {
                                if (editingDream) {
                                    setEditingDream({ ...editingDream, text: text });
                                } else {
                                    setNewDream(prev => ({ ...prev, text: text }));
                                }
                            }}
                            multiline
                            numberOfLines={4}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingDream(null);
                                }}
                            >
                                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.createButton]}
                                onPress={editingDream ? handleEditDream : handleCreateDream}
                            >
                                <ThemedText style={styles.buttonText}>
                                    {editingDream ? 'Guardar' : 'Crear'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 15,
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
        color: '#000000',
    },
    addButton: {
        padding: 5,
    },
    content: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    dreamItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    dreamTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    dreamTitle: {
        fontSize: 14,
        color: '#000000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxWidth: 500,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    createButton: {
        backgroundColor: '#1253AA',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    deleteAction: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
}); 
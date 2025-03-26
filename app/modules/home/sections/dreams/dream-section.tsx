import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dreamsApi, Dream } from './api/dreams';


export default function DreamSection() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newDream, setNewDream] = useState({ title: '', text: '' });

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

    return (
        <ThemedView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => setIsExpanded(!isExpanded)}
                >
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={24}
                        color="#1253AA"
                    />
                    <ThemedText style={styles.title}>Sueños</ThemedText>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={24} color="#1253AA" />
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.content}>
                    {loading ? (
                        <ThemedText>Cargando sueños...</ThemedText>
                    ) : dreams.length === 0 ? (
                        <ThemedText>No hay sueños disponibles</ThemedText>
                    ) : (
                        dreams.map((dream) => (
                            <View key={dream.id} style={styles.dreamItem}>
                                <ThemedText style={styles.dreamTitle}>{dream.title}</ThemedText>
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
                        ))
                    )}
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Nuevo Sueño</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Título del sueño"
                            value={newDream.title}
                            onChangeText={(text) => setNewDream(prev => ({ ...prev, title: text }))}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descripción"
                            value={newDream.text}
                            onChangeText={(text) => setNewDream(prev => ({ ...prev, text: text }))}
                            multiline
                            numberOfLines={4}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.createButton]}
                                onPress={handleCreateDream}
                            >
                                <ThemedText style={styles.buttonText}>Crear</ThemedText>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    dreamTitle: {
        fontSize: 14,
        color: '#000000',
        flex: 1,
    },
    addButton: {
        padding: 5,
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
}); 
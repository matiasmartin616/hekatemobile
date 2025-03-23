import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import ThemedText from '../shared/components/ThemedText';
import ThemedView from '../shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
    const [dreams, setDreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [editingDream, setEditingDream] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002/api';

    useEffect(() => {
        fetchDreams();
    }, []);

    const fetchDreams = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/dream`);

            console.log('Response status:', response.status);
            console.log('Response headers:', JSON.stringify(response.headers.map));

            const responseClone = response.clone();
            const textResponse = await responseClone.text();
            console.log('Raw response text (first 200 chars):', textResponse.substring(0, 200));

            if (!response.ok) {
                throw new Error(`Failed to fetch dreams: ${response.status}`);
            }

            if (textResponse.trim().startsWith('[') || textResponse.trim().startsWith('{')) {
                const data = JSON.parse(textResponse);
                console.log('Parsed data:', data);
                setDreams(data);
            } else {
                throw new Error('Response is not valid JSON');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dreams:', err);
        } finally {
            setLoading(false);
        }
    };

    const createDream = async () => {
        if (!title.trim() || !text.trim()) {
            Alert.alert('Error', 'Por favor rellena todos los campos');
            return;
        }

        try {
            const userId = 'clzv3yty00004ayzxex37f5nb'; // This should come from your auth state

            const response = await fetch(`${apiUrl}/dream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, text, userId }),
            });

            console.log('Create dream response status:', response.status);
            const textResponse = await response.text();
            console.log('Create dream raw response:', textResponse);

            if (!response.ok) {
                throw new Error('Failed to create dream');
            }

            // Reset form
            setTitle('');
            setText('');

            // Refresh dreams list
            fetchDreams();

        } catch (err) {
            setError(err.message);
            Alert.alert('Error', 'No se pudo crear el sueño');
        }
    };

    const updateDream = async () => {
        if (!title.trim() || !text.trim() || !editingDream) {
            Alert.alert('Error', 'Por favor rellena todos los campos');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/dream`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingDream.id,
                    title,
                    text
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update dream');
            }

            // Reset form and close modal
            setTitle('');
            setText('');
            setEditingDream(null);
            setModalVisible(false);

            // Refresh dreams list
            fetchDreams();

        } catch (err) {
            setError(err.message);
            Alert.alert('Error', 'No se pudo actualizar el sueño');
        }
    };

    const deleteDream = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/dream`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete dream');
            }

            // Refresh dreams list
            fetchDreams();

        } catch (err) {
            setError(err.message);
            Alert.alert('Error', 'No se pudo eliminar el sueño');
        }
    };

    const openEditModal = (dream) => {
        setEditingDream(dream);
        setTitle(dream.title);
        setText(dream.text);
        setModalVisible(true);
    };

    const renderDreamItem = ({ item }) => (
        <ThemedView style={styles.dreamItem}>
            <View style={styles.dreamContent}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
                <ThemedText>{item.text}</ThemedText>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}
                >
                    <Ionicons name="pencil" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        Alert.alert(
                            "Eliminar Sueño",
                            "¿Estás seguro que deseas eliminar este sueño?",
                            [
                                { text: "Cancelar" },
                                { text: "Eliminar", onPress: () => deleteDream(item.id) }
                            ]
                        );
                    }}
                >
                    <Ionicons name="trash" size={20} color="#F44336" />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );

    if (loading && dreams.length === 0) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#A1CEDC" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.pageTitle}>Mis Objetivos</ThemedText>

            {error && (
                <ThemedView style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                </ThemedView>
            )}

            {/* Create new dream form */}
            <ThemedView style={styles.formContainer}>
                <ThemedText type="subtitle">Nuevo Objetivo</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Título"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descripción"
                    multiline
                    numberOfLines={4}
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={styles.addButton} onPress={createDream}>
                    <ThemedText style={styles.buttonText}>Agregar</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            {/* Dreams list */}
            <ThemedText type="subtitle" style={styles.listTitle}>Tus Objetivos</ThemedText>
            {dreams.length === 0 ? (
                <ThemedText>No has creado ningún objetivo todavía</ThemedText>
            ) : (
                <FlatList
                    data={dreams}
                    renderItem={renderDreamItem}
                    keyExtractor={item => item.id}
                    style={styles.dreamsList}
                />
            )}

            {/* Edit modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <ThemedView style={styles.modalView}>
                        <ThemedText type="subtitle">Editar Objetivo</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Título"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descripción"
                            multiline
                            numberOfLines={4}
                            value={text}
                            onChangeText={setText}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setEditingDream(null);
                                    setTitle('');
                                    setText('');
                                }}
                            >
                                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSave]}
                                onPress={updateDream}
                            >
                                <ThemedText style={styles.buttonText}>Guardar</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    pageTitle: {
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorContainer: {
        padding: 10,
        backgroundColor: '#FFEBEE',
        marginBottom: 15,
        borderRadius: 5,
    },
    errorText: {
        color: '#D32F2F',
    },
    formContainer: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    listTitle: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    dreamsList: {
        flex: 1,
    },
    dreamItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        elevation: 2,
    },
    dreamContent: {
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        padding: 8,
        marginRight: 5,
    },
    deleteButton: {
        padding: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#9E9E9E',
    },
    buttonSave: {
        backgroundColor: '#2196F3',
    },
});

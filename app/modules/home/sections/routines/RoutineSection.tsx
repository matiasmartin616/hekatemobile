import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, TextInput, Platform } from 'react-native';
import ThemedText from '../../../shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useThemeColor from '../../../shared/hooks/useThemeColor';

interface Routine {
    id: string;
    time: string;
    description: string;
    completed: boolean;
}

interface RoutineSectionProps {
    // Add any props if needed
}

export const RoutineSection: React.FC<RoutineSectionProps> = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [newRoutine, setNewRoutine] = useState({
        time: new Date(),
        timeString: '',
        description: ''
    });
    const [routines, setRoutines] = useState<Routine[]>([
        { id: '1', time: '8:00', description: 'DESPERTARME', completed: true },
        { id: '2', time: '8:30', description: 'ENTRENAR', completed: true },
        { id: '3', time: '10:00', description: 'OFI', completed: false },
    ]);

    const backgroundColor = useThemeColor('background');

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setShowTimePicker(Platform.OS === 'ios');
            setSelectedTime(selectedDate);
            setNewRoutine(prev => ({
                ...prev,
                time: selectedDate,
                timeString: formatTime(selectedDate)
            }));
        } else {
            setShowTimePicker(false);
        }
    };

    const toggleRoutineStatus = (routineId: string) => {
        setRoutines(currentRoutines =>
            currentRoutines.map(routine =>
                routine.id === routineId
                    ? { ...routine, completed: !routine.completed }
                    : routine
            )
        );
    };

    const handleCreateRoutine = () => {
        if (newRoutine.timeString && newRoutine.description.trim()) {
            const newId = (routines.length + 1).toString();
            setRoutines(currentRoutines => [
                ...currentRoutines,
                {
                    id: newId,
                    time: newRoutine.timeString,
                    description: newRoutine.description.toUpperCase(),
                    completed: false
                }
            ]);
            setModalVisible(false);
            setShowTimePicker(false);
            setNewRoutine({
                time: new Date(),
                timeString: '',
                description: ''
            });
        }
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
                    <Text style={styles.title}>Rutinas</Text>
                </View>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={24} color="#1253AA" />
                </TouchableOpacity>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.content}>
                    {routines.map((routine) => (
                        <View key={routine.id} style={styles.routineItem}>
                            <View style={styles.routineInfo}>
                                <ThemedText style={styles.routineTime}>{routine.time}</ThemedText>
                                <ThemedText style={styles.routineDescription}>
                                    {routine.description}
                                </ThemedText>
                            </View>
                            <TouchableOpacity 
                                onPress={() => toggleRoutineStatus(routine.id)}
                                style={styles.checkbox}
                            >
                                <Ionicons 
                                    name={routine.completed ? "checkmark-circle" : "ellipse-outline"} 
                                    size={24} 
                                    color={routine.completed ? "#1253AA" : "#999999"}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor }]}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Nueva Rutina</ThemedText>
                        
                        <TouchableOpacity
                            style={styles.timeInput}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <ThemedText>
                                {formatTime(selectedTime)}
                            </ThemedText>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Descripción"
                            value={newRoutine.description}
                            onChangeText={(text) => setNewRoutine(prev => ({ ...prev, description: text }))}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setShowTimePicker(false);
                                    setNewRoutine({
                                        time: new Date(),
                                        timeString: '',
                                        description: ''
                                    });
                                }}
                            >
                                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.createButton]}
                                onPress={handleCreateRoutine}
                            >
                                <ThemedText style={[styles.buttonText, styles.createButtonText]}>
                                    Crear
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
    routineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    routineInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    routineTime: {
        fontSize: 14,
        color: '#000000',
        marginRight: 15,
        width: 50,
    },
    routineDescription: {
        fontSize: 14,
        color: '#000000',
    },
    checkbox: {
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
        fontWeight: '500',
    },
    createButtonText: {
        color: '#FFFFFF',
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        height: 40,
        justifyContent: 'center',
    },
    timePicker: {
        height: 200,
        marginBottom: 15,
    },
}); 
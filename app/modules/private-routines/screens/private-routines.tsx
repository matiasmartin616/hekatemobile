import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions, Modal, TextInput, Alert } from 'react-native';
import ThemedText from "@/app/modules/shared/components/themed-text";
import ThemedView from "@/app/modules/shared/components/themed-view";
import usePrivateRoutinesApi from "../hooks/use-private-routines-api";
import { PrivateRoutineBlock, PrivateRoutineDay } from '../api/private-routine-api';
import colors from '../../shared/theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import privateRoutinesApi from '../api/private-routines-api';
import { useQueryClient } from '@tanstack/react-query';

const { width, height } = Dimensions.get('window');

// Mapeo de días de la semana
const weekDayNames: Record<string, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
};

// Mapeo de colores por día
const weekDayColors: Record<string, {light: string, main: string, gradient: string[]}> = {
    'MONDAY': {
        light: colors.light.palette.blue[50],
        main: colors.light.palette.blue[500],
        gradient: [colors.light.palette.blue[400], colors.light.palette.blue[600]]
    },
    'TUESDAY': {
        light: colors.light.palette.green[50],
        main: colors.light.palette.green[500],
        gradient: [colors.light.palette.green[400], colors.light.palette.green[600]]
    },
    'WEDNESDAY': {
        light: colors.light.palette.purple[50],
        main: colors.light.palette.purple[500],
        gradient: [colors.light.palette.purple[400], colors.light.palette.purple[600]]
    },
    'THURSDAY': {
        light: colors.light.palette.teal[50],
        main: colors.light.palette.teal[500],
        gradient: [colors.light.palette.teal[400], colors.light.palette.teal[600]]
    },
    'FRIDAY': {
        light: colors.light.palette.orange[50],
        main: colors.light.palette.orange[500],
        gradient: [colors.light.palette.orange[400], colors.light.palette.orange[600]]
    },
    'SATURDAY': {
        light: colors.light.palette.red[50],
        main: colors.light.palette.red[500],
        gradient: [colors.light.palette.red[400], colors.light.palette.red[600]]
    },
    'SUNDAY': {
        light: colors.light.palette.yellow[50],
        main: colors.light.palette.yellow[500],
        gradient: [colors.light.palette.yellow[400], colors.light.palette.yellow[600]]
    }
};

// Mapeo número de día (0-6) a formato de día de la semana
const dayNumberToWeekDay: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
};

// Función para obtener el día actual
const getTodayWeekDay = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    return dayNumberToWeekDay[dayOfWeek];
};

export default function PrivateRoutinesScreen() {
    const { data, isLoading } = usePrivateRoutinesApi();
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<PrivateRoutineBlock | null>(null);
    const [editedBlock, setEditedBlock] = useState<PrivateRoutineBlock | null>(null);
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Inicializar el día seleccionado cuando los datos se cargan
    useEffect(() => {
        if (data && data.days && data.days.length > 0) {
            // Si tenemos datos, seleccionar el día actual o el primer día disponible
            const todayWeekDay = getTodayWeekDay();
            const todayRoutine = data.days.find(day => day.weekDay === todayWeekDay);
            if (todayRoutine) {
                setSelectedDayId(todayRoutine.id);
            } else {
                setSelectedDayId(data.days[0].id);
            }
        }
    }, [data]);
    
    // Función para abrir el modal de edición de bloque
    const handleBlockPress = (block: PrivateRoutineBlock) => {
        setSelectedBlock(block);
        setEditedBlock({...block});
        setEditModalVisible(true);
    };
    
    // Función para abrir modal para añadir un nuevo bloque
    const handleAddNewBlock = () => {
        // Crear un bloque vacío con valores predeterminados
        if (!selectedRoutine) return;
        
        console.log("Día seleccionado:", {
            id: selectedRoutine.id,
            routineId: selectedRoutine.routineId,
            weekDay: selectedRoutine.weekDay
        });
        
        const newBlockData: Omit<PrivateRoutineBlock, 'id'> = {
            title: '',
            description: '',
            color: blockColors[0],
            order: sortedBlocks.length > 0 ? Math.max(...sortedBlocks.map(b => b.order)) + 1 : 0,
            routineDayId: selectedRoutine.id,
            weekDay: selectedRoutine.weekDay,
            status: 'VISUALIZED'
        };
        
        // Crear un objeto temporal para el formulario
        setSelectedBlock(null);
        setEditedBlock({
            ...newBlockData,
            id: 'temp-id' // ID temporal que se reemplazará al guardar
        });
        setEditModalVisible(true);
    };
    
    // Función para guardar cambios de un bloque
    const handleSaveBlock = async () => {
        if (!editedBlock || !selectedRoutine) return;
        
        try {
            setIsSaving(true);
            // Si el bloque tiene un ID temporal, es un nuevo bloque
            if (editedBlock.id === 'temp-id') {
                // Crear un nuevo bloque
                const blockData = {
                    title: editedBlock.title,
                    description: editedBlock.description,
                    color: editedBlock.color,
                    order: editedBlock.order,
                    routineDayId: selectedRoutine.id,
                    weekDay: selectedRoutine.weekDay,
                    status: 'VISUALIZED' as 'DONE' | 'VISUALIZED'
                };
                
                console.log("Creando bloque con datos:", blockData);
                
                // Usar la ruta correcta con el ID del día de rutina
                await privateRoutinesApi.addBlockDirectly(selectedRoutine.id, blockData);
            } else {
                // Actualizar un bloque existente
                await privateRoutinesApi.updateBlockDirectly(editedBlock.id, {
                    title: editedBlock.title,
                    description: editedBlock.description,
                    color: editedBlock.color,
                    order: editedBlock.order
                });
            }
            
            queryClient.invalidateQueries({ queryKey: ['private-routines'] });
            setEditModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el bloque:', error);
            Alert.alert('Error', 'No se pudo guardar el bloque');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Función para eliminar un bloque
    const handleDeleteBlock = async () => {
        if (!selectedBlock) return;
        
        Alert.alert(
            'Eliminar bloque',
            '¿Estás seguro de que deseas eliminar este bloque?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await privateRoutinesApi.deleteBlockDirectly(selectedBlock.id);
                            queryClient.invalidateQueries({ queryKey: ['private-routines'] });
                            setEditModalVisible(false);
                        } catch (error) {
                            console.error('Error al eliminar el bloque:', error);
                            Alert.alert('Error', 'No se pudo eliminar el bloque');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    // Componente para mostrar bloques de rutina con interacción para editar
    function RoutineBlockItem({ block }: { block: PrivateRoutineBlock }) {
        return (
            <TouchableOpacity 
                style={[styles.blockItem, { borderLeftColor: block.color }]}
                onPress={() => handleBlockPress(block)}
            >
                <View style={styles.blockContent}>
                    <ThemedText style={styles.blockTitle}>{block.title}</ThemedText>
                    <ThemedText style={styles.blockDescription} numberOfLines={2}>
                        {block.description}
                    </ThemedText>
                </View>
            </TouchableOpacity>
        );
    }

    // Mostrar pantalla de carga
    if (isLoading || !data) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.light.palette.blue[500]} />
                <ThemedText style={styles.loadingText}>Cargando tus rutinas...</ThemedText>
            </ThemedView>
        );
    }

    // Obtener los días de la rutina desde la API
    const routineDays = data.days || [];
    
    // Ordenar los días según el orden de la semana
    const sortedRoutineDays = [...routineDays].sort((a, b) => {
        const weekDayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        return weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay);
    });
    
    // Encontrar la rutina seleccionada
    const selectedRoutine = routineDays.find(day => day.id === selectedDayId) || null;
    
    // Ordenar bloques por orden
    const sortedBlocks = selectedRoutine?.blocks 
        ? [...selectedRoutine.blocks].sort((a, b) => a.order - b.order) 
        : [];

    return (
        <ThemedView style={styles.container}>
            {/* Selector de días dinámico */}
            <View style={styles.daySelectorContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daySelector}
                >
                    {sortedRoutineDays.map((routineDay) => {
                        const isSelected = routineDay.id === selectedDayId;
                        const dayColor = weekDayColors[routineDay.weekDay] || weekDayColors.MONDAY; // fallback a lunes
                        
                        return (
                            <TouchableOpacity
                                key={routineDay.id}
                                style={[
                                    styles.dayButton,
                                    isSelected && { backgroundColor: dayColor.light, borderColor: dayColor.main }
                                ]}
                                onPress={() => setSelectedDayId(routineDay.id)}
                            >
                                <ThemedText 
                                    style={[
                                        styles.dayButtonText,
                                        isSelected && { color: dayColor.main, fontWeight: 'bold' }
                                    ]}
                                >
                                    {routineDay.weekDay}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Contenido principal */}
            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {selectedRoutine && (
                    <>
                        {/* Lista de bloques */}
                        <View style={styles.blocksContainer}>
                            {sortedBlocks.length > 0 ? (
                                <>
                                    {sortedBlocks.map((block) => (
                                        <RoutineBlockItem key={block.id} block={block} />
                                    ))}
                                </>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons 
                                        name="calendar-blank-outline" 
                                        size={64} 
                                        color={colors.light.palette.blue[200]} 
                                    />
                                    <ThemedText style={styles.emptyText}>
                                        No hay actividades para este día
                                    </ThemedText>
                                </View>
                            )}
                        </View>
                    </>
                )}

                {/* Botón para agregar nueva rutina */}
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={handleAddNewBlock}
                >
                    <Ionicons name="add-outline" size={22} color="#fff" />
                    <ThemedText style={styles.editButtonText}>Añadir Rutina</ThemedText>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal de edición de bloque */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <ThemedText type="subtitle" style={styles.modalTitle}>
                                {selectedBlock ? "Editar Bloque" : "Nuevo Bloque"}
                            </ThemedText>
                            <TouchableOpacity 
                                onPress={() => setEditModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color={colors.light.neutral.black} />
                            </TouchableOpacity>
                        </View>
                        
                        {editedBlock && (
                            <View style={styles.modalBody}>
                                <ThemedText style={styles.inputLabel}>Título</ThemedText>
                                <TextInput
                                    style={styles.inputTitle}
                                    value={editedBlock.title}
                                    onChangeText={text => setEditedBlock(prev => prev ? {...prev, title: text} : null)}
                                    placeholder="Título del bloque"
                                />
                                
                                <ThemedText style={styles.inputLabel}>Descripción</ThemedText>
                                <TextInput
                                    style={styles.inputDesc}
                                    value={editedBlock.description}
                                    onChangeText={text => setEditedBlock(prev => prev ? {...prev, description: text} : null)}
                                    placeholder="Descripción del bloque"
                                    multiline={true}
                                    numberOfLines={3}
                                />
                                
                                <ThemedText style={styles.inputLabel}>Color</ThemedText>
                                <View style={styles.colorSelector}>
                                    {blockColors.map(color => (
                                        <TouchableOpacity 
                                            key={color}
                                            style={[
                                                styles.colorOption, 
                                                { backgroundColor: color },
                                                editedBlock.color === color && styles.colorOptionSelected
                                            ]}
                                            onPress={() => setEditedBlock(prev => prev ? {...prev, color} : null)}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                        
                        <View style={styles.modalFooter}>
                            {selectedBlock && selectedBlock.id !== 'temp-id' && (
                                <TouchableOpacity 
                                    style={styles.deleteButton}
                                    onPress={handleDeleteBlock}
                                    disabled={isDeleting || isSaving}
                                >
                                    {isDeleting ? (
                                        <ActivityIndicator size="small" color={colors.light.palette.red[500]} />
                                    ) : (
                                        <>
                                            <Ionicons name="trash-outline" size={20} color={colors.light.palette.red[500]} />
                                            <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                            
                            <View style={styles.footerActions}>
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={() => setEditModalVisible(false)}
                                    disabled={isSaving || isDeleting}
                                >
                                    <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={styles.saveButton}
                                    onPress={handleSaveBlock}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.light.palette.blue[500],
    },
    daySelectorContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light.neutral.gray[100],
    },
    daySelector: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 6,
    },
    dayButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.light.neutral.gray[200],
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        height: 32,
    },
    dayButtonText: {
        fontSize: 12,
        color: colors.light.neutral.gray[700],
    },
    
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 10,
        paddingBottom: 40,
    },
    dayHeader: {
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dayHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayHeaderTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    dayHeaderSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    
    blocksContainer: {
        marginBottom: 20,
    },
    blockItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.84,
        elevation: 2,
    },
    blockContent: {
        flex: 1,
    },
    blockTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    blockDescription: {
        fontSize: 14,
        color: colors.light.neutral.gray[600],
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: colors.light.neutral.gray[500],
        marginTop: 12,
        textAlign: 'center',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.light.palette.blue[500],
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    groupContainer: {
        marginBottom: 24,
        backgroundColor: colors.light.palette.blue[50],
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    groupHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.palette.blue[100],
        paddingBottom: 8,
    },
    viewByGroupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.light.palette.blue[50],
        position: 'absolute',
        right: 12,
        top: 10,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[200],
    },
    viewByGroupButtonText: {
        fontSize: 12,
        marginLeft: 4,
        color: colors.light.palette.blue[600],
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.palette.blue[100],
        backgroundColor: colors.light.palette.blue[50],
    },
    modalTitle: {
        fontSize: 18,
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: colors.light.palette.blue[700],
    },
    inputTitle: {
        backgroundColor: '#fff',
        borderColor: colors.light.palette.blue[200],
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    inputDesc: {
        backgroundColor: '#fff',
        borderColor: colors.light.palette.blue[200],
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    colorSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 16,
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        marginBottom: 12,
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: colors.light.neutral.black,
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.light.palette.blue[100],
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[300],
    },
    cancelButtonText: {
        color: colors.light.palette.blue[500],
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: colors.light.palette.blue[500],
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.light.palette.red[300],
        backgroundColor: colors.light.palette.red[50],
    },
    deleteButtonText: {
        marginLeft: 8,
        color: colors.light.palette.red[500],
        fontWeight: '600',
    },
});

// Colores predefinidos para bloques
const blockColors = [
    '#4A90E2', // Azul
    '#50E3C2', // Verde turquesa
    '#F5A623', // Naranja
    '#D0021B', // Rojo
    '#7ED321', // Verde
    '#9013FE', // Morado
];

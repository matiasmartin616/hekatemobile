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
import RoutineBlockItem from '../components/routine-block-item';

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

// Mapeo número de día (0-6) a formato de día de la semana (0=LUNES, 6=DOMINGO)
const dayNumberToWeekDay: Record<number, string> = {
    0: 'MONDAY',
    1: 'TUESDAY',
    2: 'WEDNESDAY',
    3: 'THURSDAY',
    4: 'FRIDAY',
    5: 'SATURDAY',
    6: 'SUNDAY'
};

// Función para obtener el día actual (ajustado para que 0 sea lunes)
const getTodayWeekDay = () => {
    const today = new Date();
    const jsDay = today.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    const backendDay = (jsDay + 6) % 7; // 0=Lunes, 1=Martes, ..., 6=Domingo
    return dayNumberToWeekDay[backendDay];
};

// 1. Definir los colores de estado y los iconos
const routineStateStyles = {
    VISUALIZED: {
        backgroundColor: '#fff',
        icon: 'eye-outline' as const,
        iconColor: colors.light.palette.blue[500],
        textColor: '#222',
    },
    IN_PROGRESS: {
        backgroundColor: '#9DECF9',
        iconColor: '#222',
        textColor: '#222',
    },
    DONE: {
        backgroundColor: '#90CDF4',
        icon: 'checkmark-circle-outline' as const,
        iconColor: '#fff',
        textColor: '#fff',
    },
};

// 2. Añadir función para cambiar el estado cíclicamente
function getNextRoutineState(current: 'VISUALIZED' | 'IN_PROGRESS' | 'DONE') {
    if (current === 'VISUALIZED') return 'IN_PROGRESS';
    if (current === 'IN_PROGRESS') return 'DONE';
    return 'VISUALIZED';
}

export default function PrivateRoutinesScreen() {
    const { data, isLoading } = usePrivateRoutinesApi();
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    
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
    
    // Función para abrir modal para añadir un nuevo bloque
    const handleAddNewBlock = () => {
        if (!selectedRoutine) return;
        const lastOrder = selectedRoutine.blocks && selectedRoutine.blocks.length
            ? Math.max(...selectedRoutine.blocks.map(b => b.order)) + 1
            : 0;
        router.push({
            pathname: '/modules/private-routines/screens/edit-routine',
            params: {
                mode: 'add',
                routineDayId: selectedRoutine.id,
                weekDay: selectedRoutine.weekDay,
                order: lastOrder
            }
        });
    };

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
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.daySelectorContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.daySelector}
                    >
                        {sortedRoutineDays.map((routineDay) => {
                            const isSelected = routineDay.id === selectedDayId;
                            const dayColor = weekDayColors[routineDay.weekDay] || weekDayColors.MONDAY;
                            const routineCount = routineDay.blocks ? routineDay.blocks.length : 0;
                            return (
                                <TouchableOpacity
                                    key={routineDay.id}
                                    style={[
                                        styles.dayButton,
                                        isSelected && styles.selectedDayButton
                                    ]}
                                    onPress={() => setSelectedDayId(routineDay.id)}
                                >
                                    <ThemedText 
                                        style={[
                                            styles.dayButtonText,
                                            isSelected && styles.selectedDayButtonText
                                        ]}
                                    >
                                        {weekDayNames[routineDay.weekDay]}
                                    </ThemedText>
                                    <ThemedText style={[
                                        styles.dayButtonSubText,
                                        isSelected && styles.selectedDayButtonSubText
                                    ]}>
                                        {routineCount} rutina{routineCount === 1 ? '' : 's'}
                                    </ThemedText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                {selectedRoutine && (
                    <>
                        {/* Lista de bloques */}
                        <View style={styles.blocksContainer}>
                            {sortedBlocks.length > 0 ? (
                                <>
                                    {sortedBlocks.map((block) => (
                                        <RoutineBlockItem key={block.id} block={block} showEditButton={true} />
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
                    <Ionicons name="add-outline" size={24} color="#1A365D" />
                    <ThemedText style={styles.editButtonText}>Añadir Rutina</ThemedText>
                </TouchableOpacity>
            </ScrollView>
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
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors.light.neutral.gray[100],
        backgroundColor: '#EBF8FF',
        marginTop: 0,
        marginBottom: 16,
    },
    daySelector: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 6,
        paddingLeft: 15,
        paddingRight: 8,
    },
    dayButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1A365D',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        minHeight: 56,
        height: undefined,
        flexDirection: 'column',
        gap: 0,
    },
    selectedDayButton: {
        backgroundColor: '#1A365D',
        borderColor: '#1A365D',
    },
    dayButtonText: {
        fontSize: 15,
        color: '#1A365D',
        fontWeight: '600',
        textAlign: 'center',
    },
    selectedDayButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    dayButtonSubText: {
        fontSize: 12,
        color: '#1A365D',
        textAlign: 'center',
        marginTop: 2,
    },
    selectedDayButtonSubText: {
        color: '#fff',
    },
    
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    blocksContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    routineCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 16,
        marginBottom: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        color: '#1A365D',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'left',
    },
    activityBullet: {
        color: '#1A365D',
        fontSize: 14,
        marginBottom: 2,
        textAlign: 'left',
    },
    cardActions: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 12,
        gap: 8,
    },
    iconButton: {
        padding: 6,
        borderRadius: 16,
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
        width: '90%',
        alignSelf: 'center',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#1A365D',
        backgroundColor: 'transparent',
        paddingVertical: 6,
        marginTop: 8,
        marginBottom: 8,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A365D',
        marginLeft: 8,
        fontFamily: 'Inter',
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

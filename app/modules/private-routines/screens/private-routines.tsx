import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import ThemedText from "@/app/modules/shared/components/themed-text";
import ThemedView from "@/app/modules/shared/components/themed-view";
import usePrivateRoutinesApi from "../hooks/use-private-routines-api";
import { PrivateRoutineBlock, PrivateRoutineDay } from '../api/private-routine-api';
import colors from '../../shared/theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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

// Componente para mostrar bloques de rutina
function RoutineBlockItem({ block }: { block: PrivateRoutineBlock }) {
    return (
        <View style={[styles.blockItem, { borderLeftColor: block.color }]}>
            <View style={styles.blockContent}>
                <ThemedText style={styles.blockTitle}>{block.title}</ThemedText>
                <ThemedText style={styles.blockDescription} numberOfLines={2}>
                    {block.description}
                </ThemedText>
            </View>
        </View>
    );
}

// Componente para mostrar un indicador de día actual
function TodayIndicator() {
    return (
        <View style={styles.todayBadge}>
            <ThemedText style={styles.todayText}>HOY</ThemedText>
        </View>
    );
}

export default function PrivateRoutinesScreen() {
    const { data, isLoading } = usePrivateRoutinesApi();
    const [selectedDay, setSelectedDay] = useState<string | null>(getTodayWeekDay());
    
    // Manejar la edición de una rutina
    const handleEditRoutine = (weekDay: string) => {
        router.push({
            pathname: "/(routes)/(private)/routine-edit",
            params: { 
                weekDay: weekDay,
                routineId: data?.id
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

    // Extraer días de la respuesta
    const routines = data.days || [];

    // Asegurarse de que hay rutinas para todos los días
    const allWeekDays = Object.keys(weekDayNames);
    const routinesByDay = allWeekDays.reduce((acc, day) => {
        acc[day] = routines.find((r: PrivateRoutineDay) => r.weekDay === day) || {
            id: `empty-${day}`,
            routineId: data.id,
            weekDay: day,
            blocks: []
        };
        return acc;
    }, {} as Record<string, PrivateRoutineDay>);

    // Obtener la rutina seleccionada
    const selectedRoutine = selectedDay ? routinesByDay[selectedDay] : null;
    
    // Ordenar bloques por orden
    const sortedBlocks = selectedRoutine?.blocks 
        ? [...selectedRoutine.blocks].sort((a, b) => a.order - b.order) 
        : [];

    return (
        <ThemedView style={styles.container}>
            {/* Selector de días de la semana - compacto */}
            <View style={styles.daySelectorContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daySelector}
                >
                    {Object.entries(weekDayNames).map(([weekDay, displayName]) => {
                        const isToday = weekDay === getTodayWeekDay();
                        const isSelected = weekDay === selectedDay;
                        const dayColor = weekDayColors[weekDay];
                        
                        return (
                            <TouchableOpacity
                                key={weekDay}
                                style={[
                                    styles.dayButton,
                                    isSelected && { backgroundColor: dayColor.light, borderColor: dayColor.main }
                                ]}
                                onPress={() => setSelectedDay(weekDay)}
                            >
                                <ThemedText 
                                    style={[
                                        styles.dayButtonText,
                                        isSelected && { color: dayColor.main, fontWeight: 'bold' }
                                    ]}
                                >
                                    {displayName.substring(0, 3)}
                                </ThemedText>
                                {isToday && <View style={[styles.todayDot, { backgroundColor: dayColor.main }]} />}
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
                        {/* Cabecera del día */}
                        <LinearGradient
                            colors={[weekDayColors[selectedRoutine.weekDay].gradient[0], weekDayColors[selectedRoutine.weekDay].gradient[1]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.dayHeader}
                        >
                            <View style={styles.dayHeaderContent}>
                                <View>
                                    <ThemedText style={styles.dayHeaderTitle}>
                                        {weekDayNames[selectedRoutine.weekDay]}
                                    </ThemedText>
                                    <ThemedText style={styles.dayHeaderSubtitle}>
                                        {selectedRoutine.blocks.length} {selectedRoutine.blocks.length === 1 ? 'actividad' : 'actividades'}
                                    </ThemedText>
                                </View>
                                {getTodayWeekDay() === selectedRoutine.weekDay && <TodayIndicator />}
                            </View>
                        </LinearGradient>

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

                {/* Botón de edición */}
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => selectedDay && handleEditRoutine(selectedDay)}
                >
                    <Ionicons name="create-outline" size={22} color="#fff" />
                    <ThemedText style={styles.editButtonText}>Editar Rutina</ThemedText>
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
        minWidth: 56,
        height: 28,
    },
    dayButtonText: {
        fontSize: 12,
        color: colors.light.neutral.gray[700],
    },
    todayDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        position: 'absolute',
        bottom: 2,
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
    todayBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 12,
    },
    todayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
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
});

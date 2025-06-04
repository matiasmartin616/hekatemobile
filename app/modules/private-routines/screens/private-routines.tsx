import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ThemedText from "@/app/modules/shared/components/themed-text";
import ThemedView from "@/app/modules/shared/components/themed-view";
import usePrivateRoutinesData from "../hooks/use-private-routines-data";
import colors from '../../shared/theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import RoutineBlockItem from '../components/routine-block-item';

const weekDayNames: Record<string, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
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

const getTodayWeekDay = () => {
    const today = new Date();
    const jsDay = today.getDay();
    const backendDay = (jsDay + 6) % 7;
    return dayNumberToWeekDay[backendDay];
};

export default function PrivateRoutinesScreen() {
    const { data, isLoading } = usePrivateRoutinesData();
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

    useEffect(() => {
        if (data && data.days && data.days.length > 0) {
            const todayWeekDay = getTodayWeekDay();
            const todayRoutine = data.days.find(day => day.weekDay === todayWeekDay);
            if (todayRoutine) {
                setSelectedDayId(todayRoutine.id);
            } else {
                setSelectedDayId(data.days[0].id);
            }
        }
    }, [data]);


    const handleCreateBlock = () => {
        if (!selectedDay) return;

        router.push({
            pathname: '/(routes)/(private)/private-routine/block-detail',
            params: {
                routineDayId: selectedDay.id,
                weekDay: selectedDay.weekDay
            }
        });
    };

    if (isLoading || !data) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.light.palette.blue[500]} />
                <ThemedText style={styles.loadingText}>Cargando tu información...</ThemedText>
            </ThemedView>
        );
    }

    const routineDays = data.days || [];
    const sortedRoutineDays = [...routineDays].sort((a, b) => {
        const weekDayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        return weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay);
    });

    const selectedDay = routineDays.find(day => day.id === selectedDayId) || null;

    const sortedBlocks = selectedDay?.blocks
        ? [...selectedDay.blocks].sort((a, b) => a.order - b.order)
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
                                        {routineCount} Bloque{routineCount === 1 ? '' : 's'}
                                    </ThemedText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                {selectedDay && (
                    <>
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

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleCreateBlock}
                >
                    <Ionicons name="add-outline" size={24} color="#1A365D" />
                    <ThemedText style={styles.editButtonText}>Añadir Bloque</ThemedText>
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

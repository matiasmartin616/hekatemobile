import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ThemedText from "@/app/modules/shared/components/themed-text";
import ThemedView from "@/app/modules/shared/components/themed-view";
import usePrivateRoutinesData from "../hooks/use-private-routines-data";
import colors from '../../shared/theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import RoutineBlockItem from '../components/routine-block-item';
import ReorderableList, { reorderItems } from 'react-native-reorderable-list';
import usePrivateRoutineBlockReorder from '../hooks/use-private-routine-block-reorder';
import { PrivateRoutineBlock } from '../api/private-routine-block-api';
import {
    useQueryClient,
} from '@tanstack/react-query';
import DuplicateDayModal from '@modules/private-routines/components/duplicate-day-modal';
import usePrivateRoutineDayDuplicate from '@modules/private-routines/hooks/use-private-routine-day-duplicate';
import { useModal } from '@/app/modules/shared/context/modal-context';
import { useToast } from '@/app/modules/shared/context/toast-context';

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
    const [dayBlocks, setDayBlocks] = useState<PrivateRoutineBlock[]>([]);
    const queryClient = useQueryClient();
    const dayScrollViewRef = useRef<ScrollView>(null);
    const { openModal, closeModal } = useModal();
    const { showToast } = useToast();

    const reorderBlocksMutation = usePrivateRoutineBlockReorder();
    const { duplicateDayMutation, duplicateMultipleDaysMutation } = usePrivateRoutineDayDuplicate();

    // Initialize selectedDayId when data loads - defaults to today's routine or first available day
    useEffect(() => {
        if (data && data.days && data.days.length > 0 && !selectedDayId) {
            const todayWeekDay = getTodayWeekDay();
            const todayRoutine = data.days.find(day => day.weekDay === todayWeekDay);
            if (todayRoutine) {
                setSelectedDayId(todayRoutine.id);
            } else {
                setSelectedDayId(data.days[0].id);
            }
        }
    }, [data, selectedDayId]);

    // Auto-scroll to selected day when it changes
    useEffect(() => {
        if (selectedDayId && data?.days && dayScrollViewRef.current) {
            const routineDays = data.days || [];
            const sortedRoutineDays = [...routineDays].sort((a, b) => {
                const weekDayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                return weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay);
            });

            const selectedIndex = sortedRoutineDays.findIndex(day => day.id === selectedDayId);
            if (selectedIndex >= 0) {
                const buttonWidth = 90 + 8; // minWidth + marginRight
                const scrollPosition = selectedIndex * buttonWidth;

                setTimeout(() => {
                    dayScrollViewRef.current?.scrollTo({
                        x: scrollPosition,
                        animated: true
                    });
                }, 100);
            }
        }
    }, [selectedDayId, data]);

    // Update dayBlocks when user switches to a different day
    useEffect(() => {
        if (selectedDayId && data) {
            const selectedDay = data.days?.find(day => day.id === selectedDayId) || null;
            const sortedBlocks = selectedDay?.blocks
                ? [...selectedDay.blocks].sort((a, b) => a.order - b.order)
                : [];
            setDayBlocks(sortedBlocks);
        }
    }, [selectedDayId]);

    const handleCreateBlock = () => {
        const selectedDay = data?.days?.find(day => day.id === selectedDayId);
        if (!selectedDay) return;

        router.push({
            pathname: '/(routes)/(private)/private-routine/block-detail',
            params: {
                routineDayId: selectedDay.id,
                weekDay: selectedDay.weekDay
            }
        });
    };

    const handleReorder = ({ from, to }: { from: number; to: number }) => {
        if (!selectedDayId) return;

        const originalBlocks = dayBlocks;
        const reorderedBlocks = reorderItems(dayBlocks, from, to);
        const reorderedBlocksWithOrder = reorderedBlocks.map((block, index) => ({
            ...block,
            order: index,
        }));

        setDayBlocks(reorderedBlocksWithOrder);

        reorderBlocksMutation.mutate({
            routineDayId: selectedDayId,
            reorderedBlocks: reorderedBlocksWithOrder,
        }, {
            onError: () => {
                setDayBlocks(originalBlocks);
            },
        });
    };

    const handleDuplicateDay = (targetDayIds: string[]) => {
        if (!selectedDayId) {
            showToast('No hay día seleccionado', 'error');
            return;
        }

        const sourceDay = data?.days?.find(day => day.id === selectedDayId);

        if (!sourceDay) {
            showToast('No se pudo encontrar el día origen', 'error');
            return;
        }

        const sortedBlocks = [...sourceDay.blocks].sort((a, b) => a.order - b.order);

        duplicateMultipleDaysMutation.mutate({
            sourceDayId: selectedDayId,
            targetDayIds,
            sourceBlocks: sortedBlocks,
            routineDays: data?.days || []
        }, {
            onSuccess: (results) => {
                closeModal();

                const successfulDuplications = results.filter(result => result.status === 'fulfilled');
                const failedDuplications = results.filter(result => result.status === 'rejected');

                const successCount = successfulDuplications.length;
                const errorCount = failedDuplications.length;
                const totalTargets = targetDayIds.length;

                if (successCount === totalTargets) {
                    showToast(
                        `Las rutinas se han duplicado correctamente en ${successCount} día${successCount === 1 ? '' : 's'}.`,
                        'success'
                    );
                } else if (successCount > 0) {
                    showToast(
                        `Se duplicaron ${successCount} de ${totalTargets} días correctamente. ${errorCount} duplicaciones fallaron.`,
                        'warning'
                    );
                } else {
                    showToast('No se pudo duplicar la rutina en ningún día. Intenta nuevamente.', 'error');
                }
            },
            onError: (error) => {
                console.error('Error duplicating days:', error);
                closeModal();
                showToast('No se pudo duplicar la rutina. Intenta nuevamente.', 'error');
            }
        });
    };

    if (isLoading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.light.palette.blue[500]} />
                <ThemedText style={styles.loadingText}>Cargando tu información...</ThemedText>
            </ThemedView>
        );
    }

    const routineDays = data?.days || [];
    const sortedRoutineDays = [...routineDays].sort((a, b) => {
        const weekDayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        return weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay);
    });

    const selectedDay = routineDays.find(day => day.id === selectedDayId) || null;

    return (
        <ThemedView style={styles.container}>
            <ReorderableList
                data={dayBlocks}
                onReorder={handleReorder}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.blocksContainer}>
                        <RoutineBlockItem
                            key={item.id}
                            block={item}
                            showEditButton={true}
                        />
                    </View>
                )}
                ListHeaderComponent={
                    <View>
                        <View style={styles.daySelectorContainer}>
                            <ScrollView
                                ref={dayScrollViewRef}
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
                            <View style={styles.topButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={handleCreateBlock}
                                >
                                    <Ionicons name="add-outline" size={16} color="#1A365D" />
                                    <ThemedText style={styles.editButtonText}>Añadir</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.duplicateButton}
                                    onPress={() => openModal(
                                        <DuplicateDayModal
                                            onClose={closeModal}
                                            routineDays={data?.days || []}
                                            currentDayId={selectedDayId}
                                            onDuplicate={handleDuplicateDay}
                                            isLoading={duplicateMultipleDaysMutation.isPending}
                                        />
                                    )}
                                >
                                    <MaterialCommunityIcons name="content-duplicate" size={16} color="#1A365D" />
                                    <ThemedText style={styles.duplicateButtonText}>Duplicar</ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    selectedDay && (
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
                    )
                }
                contentContainerStyle={styles.contentContainer}
            />
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
        paddingBottom: 100,
    },
    blocksContainer: {
        marginBottom: 0,
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
    footerContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#1A365D',
        backgroundColor: 'transparent',
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    editButtonText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1A365D',
        marginLeft: 6,
        fontFamily: 'Inter',
    },
    topButtonsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
    },
    duplicateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#1A365D',
        backgroundColor: 'transparent',
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    duplicateButtonText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1A365D',
        marginLeft: 6,
        fontFamily: 'Inter',
    },
});

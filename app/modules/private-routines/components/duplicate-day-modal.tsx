import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import ThemedButton from '@/app/modules/shared/components/themed-button';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../shared/theme/theme';
import { PrivateRoutineDay } from '../api/private-routines-api';

interface DuplicateDayModalProps {
    onClose: () => void;
    routineDays: PrivateRoutineDay[];
    currentDayId: string | null;
    onDuplicate: (targetDayIds: string[]) => void;
    isLoading?: boolean;
}

const weekDayNames: Record<string, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
};

export default function DuplicateDayModal({
    onClose,
    routineDays,
    currentDayId,
    onDuplicate,
    isLoading = false
}: DuplicateDayModalProps) {
    const { control, handleSubmit, watch, setValue } = useForm<{ targetDayIds: string[] }>({
        defaultValues: { targetDayIds: [] },
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const targetDayIds = watch('targetDayIds');

    const sortedRoutineDays = [...routineDays].sort((a, b) => {
        const weekDayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        return weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay);
    });

    const handleTargetDayToggle = (dayId: string) => {
        const current = watch('targetDayIds');
        if (current.includes(dayId)) {
            setValue('targetDayIds', current.filter(id => id !== dayId));
        } else {
            setValue('targetDayIds', [...current, dayId]);
        }
    };

    const handleDuplicate = () => {
        if (!currentDayId || targetDayIds.length === 0) {
            return;
        }
        if (targetDayIds.includes(currentDayId)) {
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        onDuplicate(targetDayIds);
        setShowConfirmation(false);
        onClose();
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const currentDay = routineDays.find(day => day.id === currentDayId);
    const currentDayName = currentDay ? weekDayNames[currentDay.weekDay] : '';

    const mainContent = (
        <ThemedView style={styles.modalContent}>
            <ScrollView style={styles.modalBody}>
                <View style={styles.infoContainer}>
                    <ThemedText style={styles.infoText}>
                        Estás en el día <ThemedText style={styles.currentDayText}>{currentDayName}</ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.infoSubText}>
                        Se duplicará en la siguiente selección:
                    </ThemedText>
                </View>
                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Selecciona los días destino:</ThemedText>
                    <Controller
                        control={control}
                        name="targetDayIds"
                        render={() => (
                            
                            <View style={styles.daysGrid2col}>
                                {sortedRoutineDays.filter(day => day.id !== currentDayId).map((day, idx) => {
                                    const isSelected = targetDayIds.includes(day.id);
                                    return (
                                        <TouchableOpacity
                                            key={day.id}
                                            style={styles.checkboxRow}
                                            onPress={() => handleTargetDayToggle(day.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.checkboxSimple, isSelected && styles.checkboxSimpleChecked]}>
                                                {isSelected && (
                                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                                )}
                                            </View>
                                            <ThemedText style={styles.dayNameSmall}>{weekDayNames[day.weekDay]}</ThemedText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
            <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.duplicateButton,
                        isLoading && styles.duplicateButtonDisabled,
                        targetDayIds.length === 0 && styles.duplicateButtonDisabled
                    ]}
                    onPress={handleDuplicate}
                    disabled={isLoading || targetDayIds.length === 0}
                >
                    <ThemedText style={styles.duplicateButtonText}>
                        {isLoading ? 'Duplicando...' : 'Duplicar'}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );

    const confirmationContent = (
        <ThemedView style={styles.modalContent}>
            <View style={styles.confirmationHeader}>
                <View style={styles.confirmationIcon}>
                    <Ionicons name="help-circle" size={48} color="#1A365D" />
                </View>
                <ThemedText style={styles.confirmationTitle}>¿Estás seguro?</ThemedText>
            </View>

            <View style={styles.confirmationBody}>
                <ThemedText style={styles.confirmationText}>
                    Esta acción reemplazará los bloques existentes en los días seleccionados.
                </ThemedText>
            </View>

            <View style={styles.confirmationFooter}>
                <ThemedButton
                    title="Cancelar"
                    variant="outline"
                    size="medium"
                    onPress={handleCancel}
                    style={styles.confirmationCancelButton}
                />
                <ThemedButton
                    title="Confirmar"
                    variant="primary"
                    size="medium"
                    onPress={handleConfirm}
                    style={styles.confirmationConfirmButton}
                />
            </View>
        </ThemedView>
    );

    return showConfirmation ? confirmationContent : mainContent;
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        maxHeight: '90%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A365D',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    infoContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#EBF8FF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1A365D',
    },
    infoText: {
        fontSize: 16,
        color: '#1A365D',
        textAlign: 'center',
        marginBottom: 4,
    },
    currentDayText: {
        fontWeight: 'bold',
        color: '#1A365D',
    },
    infoSubText: {
        fontSize: 14,
        color: '#1A365D',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A365D',
        marginBottom: 12,
    },
    daysGrid2col: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '48%',
        marginRight: '2%',
    },
    checkboxSimple: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#1A365D',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxSimpleChecked: {
        backgroundColor: '#1A365D',
        borderColor: '#1A365D',
    },
    dayNameSmall: {
        fontSize: 13,
        color: '#1A365D',
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.light.neutral.gray[100],
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E0',
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#4A5568',
        fontWeight: '600',
    },
    duplicateButton: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#1A365D',
        alignItems: 'center',
    },
    duplicateButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    duplicateButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Confirmation content styles
    confirmationHeader: {
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 16,
        paddingHorizontal: 24,
    },
    confirmationIcon: {
        marginBottom: 12,
    },
    confirmationTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A365D',
        textAlign: 'center',
    },
    confirmationBody: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    confirmationText: {
        fontSize: 16,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 22,
    },
    confirmationFooter: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    confirmationCancelButton: {
        flex: 1,
    },
    confirmationConfirmButton: {
        flex: 1,
    },
}); 
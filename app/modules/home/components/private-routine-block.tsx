import Ionicons from "@expo/vector-icons/Ionicons";
import { PrivateRoutineBlock as PrivateRoutineBlockType } from "../../private-routines/api/private-routine-block-api";
import ThemedText from "../../shared/components/themed-text";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import PrivateRoutineItem from "./private-routine-item";
import { colors } from "../../shared/theme/theme";
import usePrivateRoutineBlockApi from "../../private-routines/hooks/use-private-routine-block-api";
import { useState, useEffect, useRef } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQueryClient } from "@tanstack/react-query";
import { routineStateStyles } from '../../shared/utils/routine-state-styles';

interface PrivateRoutineBlockProps {
    block: PrivateRoutineBlockType;
}

export default function PrivateRoutineBlock({ block }: PrivateRoutineBlockProps) {
    const { updateStatusMutation } = usePrivateRoutineBlockApi();
    const status = block.status || 'NULL';
    const [showOptions, setShowOptions] = useState(status === 'NULL');
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const queryClient = useQueryClient();
    const style = routineStateStyles[status];

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleStatusUpdate = (newStatus: 'NULL' | 'VISUALIZED' | 'DONE') => {
        setIsLoading(true);
        updateStatusMutation.mutate({
            blockId: block.id,
            status: newStatus
        },
        {
            onSuccess: () => {
                setShowOptions(false);
                setIsLoading(false);
                queryClient.invalidateQueries({ queryKey: ['private-routines'] });
                queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
            },
            onError: (error) => {
                setIsLoading(false);
                console.error('Error updating status:', error);
            }
        });
    };

    const handleStatusButtonClick = () => {
        // Si ya está en DONE, no permitir más cambios
        if (status === 'DONE') return;
        setShowOptions(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setShowOptions(false);
            if (status === 'NULL') {
                handleStatusUpdate('VISUALIZED');
            }
        }, 3000);
    };

    const renderActionButtons = () => {
        // Si está en DONE, mostrar solo el botón de estado sin opción de cambio
        if (status === 'DONE') {
            return (
                <TouchableOpacity
                    style={[styles.statusButton, styles.doneButton]}
                    disabled={true}
                >
                    <Ionicons name="checkmark-circle-outline" size={15} color={colors.light.palette.blue[500]} />
                    <ThemedText style={styles.statusButtonText}>Completado</ThemedText>
                </TouchableOpacity>
            );
        }
        if (showOptions) {
            return (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleStatusUpdate('VISUALIZED')}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={15} color={colors.light.palette.blue[500]} />
                        ) : (
                            <MaterialCommunityIcons name="dumbbell" size={15} color={colors.light.palette.blue[500]} />
                        )}
                        <ThemedText style={styles.actionButtonText}>En progreso</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleStatusUpdate('DONE')}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={15} color={colors.light.palette.blue[500]} />
                        ) : (
                            <Ionicons name="checkmark-circle-outline" size={15} color={colors.light.palette.blue[500]} />
                        )}
                        <ThemedText style={styles.actionButtonText}>Completado</ThemedText>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        status === 'VISUALIZED' ? styles.visualizedButton : styles.nullButton
                    ]}
                    onPress={handleStatusButtonClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size={15} color={colors.light.palette.blue[500]} />
                    ) : status === 'NULL' ? (
                        <Ionicons name="eye-outline" size={15} color={colors.light.palette.blue[500]} />
                    ) : (
                        <MaterialCommunityIcons name="dumbbell" size={15} color={colors.light.palette.blue[500]} />
                    )}
                    <ThemedText style={styles.statusButtonText}>
                        {status === 'NULL' ? 'Pendiente' : 'En progreso'}
                    </ThemedText>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={[styles.block, { backgroundColor: style.backgroundColor }, status === 'NULL' ? { borderColor: '#90CDF4', borderWidth: 1 } : { borderColor: 'transparent', borderWidth: 0 }] }>
            {renderActionButtons()}
            <View style={styles.blockContent}>
                <ThemedText type="title" style={styles.blockTitle}>{block.title}</ThemedText>
                <PrivateRoutineItem description={block.description} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    blockTitle: {
        fontWeight: '600',
        fontSize: 12,
    },
    blockContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 5,
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 5,
        minWidth: 90,
        width: '25%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.palette.blue[100],
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.2,
        borderColor: colors.light.palette.blue[500],
    },
    actionButtonText: {
        marginLeft: 5,
        fontSize: 10,
        color: colors.light.palette.blue[500],
        fontWeight: '600',
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderWidth: 1.2,
        minWidth: 90,
        width: '25%',
        justifyContent: 'center',
        height: 24,
    },
    visualizedButton: {
        backgroundColor: colors.light.palette.blue[100],
        borderColor: colors.light.palette.blue[500],
    },
    doneButton: {
        backgroundColor: colors.light.palette.blue[100],
        borderColor: colors.light.palette.blue[500],
    },
    statusButtonText: {
        marginLeft: 5,
        fontSize: 10,
        color: colors.light.palette.blue[500],
        fontWeight: '600',
    },
    nullButton: {
        backgroundColor: colors.light.palette.blue[100],
        borderColor: colors.light.palette.blue[500],
    },
}); 

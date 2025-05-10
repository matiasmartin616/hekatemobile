import Ionicons from "@expo/vector-icons/Ionicons";
import { PrivateRoutineBlock as PrivateRoutineBlockType } from "../../private-routines/api/private-routine-block-api";
import ThemedText from "../../shared/components/themed-text";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import PrivateRoutineItem from "./private-routine-item";
import { colors } from "../../shared/theme/theme";
import usePrivateRoutineBlockApi from "../../private-routines/hooks/use-private-routine-block-api";
import { useState, useEffect, useRef } from "react";

interface PrivateRoutineBlockProps {
    block: PrivateRoutineBlockType;
}

export default function PrivateRoutineBlock({ block }: PrivateRoutineBlockProps) {
    const { updateStatusMutation } = usePrivateRoutineBlockApi();
    const [status, setStatus] = useState<null | 'DONE' | 'VISUALIZED'>(block.status || null);
    const [showOptions, setShowOptions] = useState(status === null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            // Clear timer on component unmount
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleStatusUpdate = (newStatus: 'DONE' | 'VISUALIZED') => {
        updateStatusMutation.mutate({
            blockId: block.id,
            status: newStatus
        },
            {
                onSuccess: () => {
                    setStatus(newStatus);
                    setShowOptions(false);
                },
                onError: (error) => {
                    console.error('Error updating status:', error);
                }
            });
    };

    const handleStatusButtonClick = () => {
        setShowOptions(true);

        // Automatically hide options after 3 seconds and default to VISUALIZED if nothing selected
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setShowOptions(false);
            if (!status) {
                handleStatusUpdate('VISUALIZED');
            }
        }, 3000);
    };

    const renderActionButtons = () => {
        if (showOptions) {
            return (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleStatusUpdate('VISUALIZED')}
                    >
                        <Ionicons name="eye-outline" size={15} color={colors.light.palette.blue[500]} />
                        <ThemedText style={styles.actionButtonText}>Visualizar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleStatusUpdate('DONE')}
                    >
                        <Ionicons name="help-circle-outline" size={15} color={colors.light.palette.blue[500]} />
                        <ThemedText style={styles.actionButtonText}>¿Hecha?</ThemedText>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        status === 'DONE' ? styles.doneButton : styles.visualizedButton
                    ]}
                    onPress={handleStatusButtonClick}
                >
                    <Ionicons name="checkmark" size={15} color={colors.light.palette.blue[500]} />
                    <ThemedText style={styles.statusButtonText}>
                        {status === 'DONE' ? 'Hecho' : 'Visualizado'}
                    </ThemedText>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.block}>
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
}); 

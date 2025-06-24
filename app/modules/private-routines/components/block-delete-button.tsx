import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { PrivateRoutineBlock } from '../api/private-routine-block-api';

interface BlockDeleteButtonProps {
    block: PrivateRoutineBlock;
    onDelete: (blockId: string) => void;
    isLoading: boolean;
}

export default function BlockDeleteButton({ block, onDelete, isLoading }: BlockDeleteButtonProps) {
    const handleDelete = () => {
        Alert.alert(
            'Eliminar rutina',
            '¿Estás seguro de que deseas eliminar esta rutina?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => onDelete(block.id)
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            style={styles.deleteRoutineButton}
            onPress={handleDelete}
            disabled={isLoading}
        >
            <Ionicons name="trash-outline" size={20} color="#1A365D" />
            <ThemedText style={styles.deleteRoutineButtonText}>Eliminar rutina</ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    deleteRoutineButton: {
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
        marginTop: 16,
        marginBottom: 8,
    },
    deleteRoutineButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A365D',
        marginLeft: 8,
        fontFamily: 'Inter',
    },
}); 
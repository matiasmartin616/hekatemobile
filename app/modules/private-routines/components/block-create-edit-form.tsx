import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { PrivateRoutineBlock, BlockStatus } from '../api/private-routine-block-api';
import BlockDeleteButton from './block-delete-button';
import colors from '../../shared/theme/theme';

interface BlockCreateEditFormProps {
    initialBlock: PrivateRoutineBlock;
    mode: 'add' | 'edit';
    isMutating: boolean;
    onSave: (block: PrivateRoutineBlock) => void;
    onCancel: () => void;
    onDelete?: (blockId: string) => void;
}

export default function BlockCreateEditForm({
    initialBlock,
    mode,
    isMutating,
    onSave,
    onCancel,
    onDelete,
}: BlockCreateEditFormProps) {
    const [block, setBlock] = useState<PrivateRoutineBlock>(initialBlock);

    useEffect(() => {
        setBlock(initialBlock);
    }, [initialBlock]);

    const weekDayNames: Record<string, string> = {
        MONDAY: 'lunes',
        TUESDAY: 'martes',
        WEDNESDAY: 'miércoles',
        THURSDAY: 'jueves',
        FRIDAY: 'viernes',
        SATURDAY: 'sábado',
        SUNDAY: 'domingo',
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <ThemedText style={styles.weekDayTitle}>
                    {mode === 'add' ? '' : `Rutina del ${block.weekDay ? weekDayNames[block.weekDay] : ''}`}
                </ThemedText>
                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Título de tu rutina</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={block.title}
                        onChangeText={text => setBlock({ ...block, title: text })}
                        placeholder="Comienzo el día"
                        placeholderTextColor="#888"
                        maxLength={60}
                    />
                </View>
                <View style={styles.formGroup}>
                    <ThemedText style={styles.label}>Descripción</ThemedText>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        value={block.description}
                        onChangeText={text => setBlock({ ...block, description: text })}
                        placeholder="Añade una descripción (presiona Enter para nueva línea)"
                        placeholderTextColor="#888"
                        multiline
                        maxLength={200}
                        textAlignVertical="top"
                    />
                    <ThemedText style={styles.descriptionHint}>
                        Cada línea se mostrará como un elemento de la lista
                    </ThemedText>
                </View>
                {/* Selector de estado */}
                <View style={styles.statusSelectorContainer}>
                    {[
                        { label: 'Sin estado', value: BlockStatus.NULL },
                        { label: 'Visualizada', value: BlockStatus.VISUALIZED },
                        { label: 'Realizada', value: BlockStatus.DONE },
                    ].map(option => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.statusPill, block.status === option.value && styles.statusPillSelected]}
                            onPress={() => setBlock({ ...block, status: option.value })}
                        >
                            <ThemedText style={[styles.statusPillText, block.status === option.value && styles.statusPillTextSelected]}>
                                {option.label}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
                {mode !== 'add' && onDelete && (
                    <BlockDeleteButton
                        block={block}
                        onDelete={onDelete}
                        isLoading={isMutating}
                    />
                )}
                <View style={{ height: 120 }} />
            </ScrollView>
            <View style={styles.buttonFooter}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={isMutating}
                >
                    <ThemedText style={styles.cancelButtonText}>Volver</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => onSave(block)}
                    disabled={isMutating}
                >
                    <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 160,
    },
    weekDayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 12,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: 18,
        maxWidth: 400,
        alignSelf: 'center',
        width: '90%',
    },
    label: {
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 6,
        marginTop: 12,
        color: '#222',
        textAlign: 'left',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 18,
        fontSize: 16,
        color: '#222',
        width: '100%',
    },
    inputMultiline: {
        minHeight: 120,
        borderRadius: 16,
        borderColor: '#153866',
        textAlignVertical: 'top',
        paddingTop: 12,
        paddingBottom: 12,
        lineHeight: 24,
    },
    statusSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    statusPill: {
        borderWidth: 1,
        borderColor: '#1A365D',
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        marginHorizontal: 4,
    },
    statusPillSelected: {
        backgroundColor: '#1A365D',
    },
    statusPillText: {
        color: '#1A365D',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusPillTextSelected: {
        color: '#fff',
    },
    descriptionHint: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    buttonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.light.palette.blue[100],
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingVertical: 32,
        paddingHorizontal: 18,
        paddingBottom: Platform.OS === 'android' ? 60 : 48,
        marginTop: 32,
        marginBottom: 0,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        gap: 16,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 24 : 0,
        zIndex: 100,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.light.palette.blue[100],
        borderWidth: 2,
        borderColor: '#153866',
        borderRadius: 999,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#153866',
        borderRadius: 999,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#153866',
        fontWeight: 'bold',
        fontSize: 15,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
}); 
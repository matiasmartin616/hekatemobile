import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import privateRoutinesApi from '../api/private-routines-api';
import { PrivateRoutineBlock } from '../api/private-routine-api';
import colors from '../../shared/theme/theme';
import ScreenHeader from '@/app/modules/shared/components/navigation/screen-header';
import { useQueryClient } from '@tanstack/react-query';

export default function EditRoutineScreen() {
  const { blockId, mode, routineDayId, weekDay, order } = useLocalSearchParams();
  const router = useRouter();
  const [block, setBlock] = useState<PrivateRoutineBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const weekDayNames: Record<string, string> = {
    MONDAY: 'lunes',
    TUESDAY: 'martes',
    WEDNESDAY: 'miércoles',
    THURSDAY: 'jueves',
    FRIDAY: 'viernes',
    SATURDAY: 'sábado',
    SUNDAY: 'domingo',
  };

  useEffect(() => {
    if (mode === 'add') {
      setBlock({
        id: '',
        title: '',
        description: '',
        color: '#4A90E2',
        order: typeof order === 'string' ? parseInt(order, 10) : 0,
        routineDayId: routineDayId as string || '',
        weekDay: weekDay as string || '',
        status: 'NULL',
      });
      setLoading(false);
      return;
    }
    async function fetchBlock() {
      setLoading(true);
      try {
        // Aquí deberías tener un endpoint para obtener un bloque por id
        const allRoutines = await privateRoutinesApi.getPrivateRoutine();
        let foundBlock = null;
        for (const day of allRoutines.days) {
          foundBlock = day.blocks.find((b: any) => b.id === blockId) || null;
          if (foundBlock) break;
        }
        setBlock(foundBlock);
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar la rutina');
      } finally {
        setLoading(false);
      }
    }
    if (blockId) fetchBlock();
  }, [blockId, mode]);

  const handleSave = async () => {
    if (!block) return;
    setSaving(true);
    try {
      if (mode === 'add') {
        const { id, ...blockData } = block;
        await privateRoutinesApi.addBlockDirectly(block.routineDayId, {
          ...blockData,
          status: 'NULL' as 'NULL' | 'VISUALIZED' | 'DONE',
        });
      } else {
        await privateRoutinesApi.updateBlockDirectly(block.id, block);
      }
      await queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      await queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la rutina');
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving || deleting) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.deletingOverlay} pointerEvents="auto">
          <View style={styles.deletingBox}>
            <ActivityIndicator size="large" color="#1A365D" />
            <ThemedText style={styles.deletingText}>
              {loading ? 'Cargando rutina...' : deleting ? 'Eliminando rutina...' : 'Guardando rutina...'}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }
  if (!block) {
    return <ThemedText>No se encontró la rutina</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title={mode === 'add' ? 'Añadir Rutina' : 'Editar rutina'} showBackButton onBack={router.back} />
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
            placeholder="Añade una descripción"
            placeholderTextColor="#888"
            multiline
            maxLength={200}
          />
        </View>
        {/* Selector de estado */}
        <View style={styles.statusSelectorContainer}>
          {[
            { label: 'Sin estado', value: 'NULL' },
            { label: 'Visualizada', value: 'VISUALIZED' },
            { label: 'Realizada', value: 'DONE' },
          ].map(option => (
            <TouchableOpacity
              key={option.value}
              style={[styles.statusPill, block.status === option.value && styles.statusPillSelected]}
              onPress={() => setBlock({ ...block, status: option.value as 'NULL' | 'VISUALIZED' | 'DONE' })}
            >
              <ThemedText style={[styles.statusPillText, block.status === option.value && styles.statusPillTextSelected]}>
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        {mode !== 'add' && (
          <TouchableOpacity style={styles.deleteRoutineButton} onPress={async () => {
            if (!block) return;
            Alert.alert(
              'Eliminar rutina',
              '¿Estás seguro de que deseas eliminar esta rutina?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar', style: 'destructive', onPress: async () => {
                    try {
                      setDeleting(true);
                      await privateRoutinesApi.deleteBlockDirectly(block.id);
                      await queryClient.invalidateQueries({ queryKey: ['private-routines'] });
                      await queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
                      router.back();
                    } catch (e) {
                      Alert.alert('Error', 'No se pudo eliminar la rutina');
                    } finally {
                      setDeleting(false);
                    }
                  }
                }
              ]
            );
          }}>
            <Ionicons name="trash-outline" size={20} color="#1A365D" />
            <ThemedText style={styles.deleteRoutineButtonText}>Eliminar rutina</ThemedText>
          </TouchableOpacity>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
      <View style={styles.buttonFooter}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={saving}>
          <ThemedText style={styles.cancelButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
    backgroundColor: '#F0F6FF',
    position: 'relative',
  },
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    minHeight: 48,
    borderRadius: 16,
    borderColor: '#153866',
    textAlignVertical: 'top',
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
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  deletingBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  deletingText: {
    marginTop: 16,
    color: '#1A365D',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
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
}); 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import { PrivateRoutineBlock, PrivateRoutineDay } from '@/app/modules/private-routines/api/private-routine-api';
import { useQueryClient } from '@tanstack/react-query';
import colors from '@/app/modules/shared/theme/theme';
import { Ionicons } from '@expo/vector-icons';
import privateRoutinesApi from '@/app/modules/private-routines/api/private-routines-api';
import { useLocalSearchParams, router } from 'expo-router';
import usePrivateRoutinesApi from '@/app/modules/private-routines/hooks/use-private-routines-api';

// Mapeo de weekday a nombre de día
const weekDayNames: Record<string, string> = {
  'MONDAY': 'Lunes',
  'TUESDAY': 'Martes',
  'WEDNESDAY': 'Miércoles',
  'THURSDAY': 'Jueves',
  'FRIDAY': 'Viernes',
  'SATURDAY': 'Sábado',
  'SUNDAY': 'Domingo'
};

export default function RoutineEditScreen() {
  // Obtener parámetros de la URL
  const { weekDay, routineId } = useLocalSearchParams<{ weekDay: string; routineId: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading } = usePrivateRoutinesApi();
  const [editableBlocks, setEditableBlocks] = useState<PrivateRoutineBlock[]>([]);

  useEffect(() => {
    if (data && weekDay) {
      const routine = data.days.find(
        (d: PrivateRoutineDay) => d.weekDay === weekDay
      );
      if (routine && routine.blocks) {
        setEditableBlocks(routine.blocks.map(b => ({ ...b })));
      }
    }
  }, [data, weekDay]);

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await privateRoutinesApi.deleteBlock(weekDay as string, blockId);
      queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      Alert.alert('Éxito', 'Bloque eliminado correctamente');
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setEditableBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el bloque');
    }
  };

  const handleAddBlock = async () => {
    // Implementar lógica para agregar bloque
    Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto');
  };

  const handleChangeBlock = (blockId: string, field: keyof PrivateRoutineBlock, value: string) => {
    setEditableBlocks(prev => prev.map(block => block.id === blockId ? { ...block, [field]: value } : block));
  };

  const handleSaveBlock = async (block: PrivateRoutineBlock) => {
    try {
      await privateRoutinesApi.updateBlock(weekDay as string, block.id, {
        title: block.title,
        description: block.description,
        color: block.color,
        order: block.order,
        status: block.status as 'DONE' | 'VISUALIZED' | undefined
      });
      queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      Alert.alert('Éxito', 'Bloque actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el bloque');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando rutina...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.neutral.black} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Editar Rutina - {weekDayNames[weekDay as string] || weekDay}
        </ThemedText>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {editableBlocks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.light.palette.blue[300]} />
            <ThemedText style={styles.emptyStateText}>No hay bloques para este día.</ThemedText>
            <TouchableOpacity style={styles.addButtonEmpty} onPress={handleAddBlock}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <ThemedText style={styles.addButtonEmptyText}>Agregar Bloque</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <>
            {editableBlocks.map((block) => (
              <View key={block.id} style={[styles.blockContainer, {borderLeftColor: block.color}]}>
                <View style={styles.blockHeader}>
                  <TextInput
                    style={styles.inputTitle}
                    value={block.title}
                    onChangeText={text => handleChangeBlock(block.id, 'title', text)}
                    placeholder="Título"
                  />
                  <TouchableOpacity 
                    onPress={() => handleDeleteBlock(block.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.light.palette.red[500]} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.inputDesc}
                  value={block.description}
                  onChangeText={text => handleChangeBlock(block.id, 'description', text)}
                  placeholder="Descripción"
                  multiline={true}
                  numberOfLines={2}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveBlock(block)}
                >
                  <Ionicons name="save-outline" size={20} color={colors.light.palette.blue[500]} />
                  <ThemedText style={styles.saveButtonText}>Guardar cambios</ThemedText>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddBlock}
            >
              <Ionicons name="add-circle-outline" size={22} color={colors.light.palette.blue[500]} />
              <ThemedText style={styles.addButtonText}>Agregar Nuevo Bloque</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.palette.blue[100],
    backgroundColor: colors.light.palette.blue[50],
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    marginTop: 12,
    marginBottom: 24,
    color: colors.light.palette.blue[400],
    textAlign: 'center',
  },
  blockContainer: {
    backgroundColor: colors.light.palette.blue[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: colors.light.palette.red[50],
    borderRadius: 20,
  },
  inputTitle: {
    backgroundColor: '#fff',
    borderColor: colors.light.palette.blue[200],
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  inputDesc: {
    backgroundColor: '#fff',
    borderColor: colors.light.palette.blue[200],
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    paddingTop: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.palette.blue[50],
    borderColor: colors.light.palette.blue[300],
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  saveButtonText: {
    marginLeft: 6,
    color: colors.light.palette.blue[500],
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: colors.light.palette.blue[500],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    marginLeft: 8,
    color: colors.light.palette.blue[500],
    fontWeight: '600',
    fontSize: 16,
  },
  addButtonEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light.palette.blue[500],
    borderRadius: 30,
  },
  addButtonEmptyText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
}); 
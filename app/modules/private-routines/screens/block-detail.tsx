import React from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedView from '@/app/modules/shared/components/themed-view';
import { PrivateRoutineBlock } from '../api/private-routine-block-api';
import { BlockStatus } from '../api/private-routine-block-api';
import ScreenHeader from '@/app/modules/shared/components/navigation/screen-header';
import usePrivateRoutinesData from '../hooks/use-private-routines-data';
import usePrivateRoutineCreate from '../hooks/use-private-routine-block-create';
import usePrivateRoutineUpdate from '../hooks/use-private-routine-block-update';
import usePrivateRoutineDelete from '../hooks/use-private-routine-block-delete';
import BlockCreateEditForm from '../components/block-create-edit-form';
import LoadingOverlay from '../components/loading-overlay';

export default function BlockDetailScreen() {
  const { blockId, routineDayId, weekDay, order } = useLocalSearchParams();
  const router = useRouter();
  const { data: routinesData, isLoading: loadingData } = usePrivateRoutinesData();
  const { createBlockMutation } = usePrivateRoutineCreate();
  const { updateBlockMutation } = usePrivateRoutineUpdate();
  const { deleteBlockMutation } = usePrivateRoutineDelete();

  const existingBlock = React.useMemo(() => {
    if (!blockId || !routinesData) return null;

    for (const day of routinesData.days) {
      const found = day.blocks.find((b: PrivateRoutineBlock) => b.id === blockId);
      if (found) return found;
    }
    return null;
  }, [blockId, routinesData]);

  const isEditMode = blockId !== undefined;

  const initialBlock = React.useMemo(() => {
    if (!isEditMode) {
      return {
        id: '',
        title: '',
        description: '',
        color: '#4A90E2',
        order: typeof order === 'string' ? parseInt(order, 10) : 0,
        routineDayId: routineDayId as string || '',
        weekDay: weekDay as string || '',
        status: BlockStatus.NULL,
      };
    }

    return existingBlock || {
      id: blockId as string,
      title: '',
      description: '',
      color: '#4A90E2',
      order: 0,
      routineDayId: '',
      weekDay: '',
      status: BlockStatus.NULL,
    };
  }, [isEditMode, existingBlock, blockId, order, routineDayId, weekDay]);

  // Determine if any mutation is currently running
  const isMutating = createBlockMutation.isPending || updateBlockMutation.isPending || deleteBlockMutation.isPending;

  const handleSave = (updatedBlock: PrivateRoutineBlock) => {
    if (isEditMode) {
      updateBlockMutation.mutate({
        blockId: updatedBlock.id,
        title: updatedBlock.title,
        description: updatedBlock.description,
        order: updatedBlock.order
      }, {
        onSuccess: () => {
          router.back();
        },
        onError: (error) => {
          console.error('Error creating routine:', error);
        }
      });
    } else {
      updateBlockMutation.mutate({
        blockId: updatedBlock.id,
        title: updatedBlock.title,
        description: updatedBlock.description,
        order: updatedBlock.order
      }, {
        onSuccess: () => {
          router.back();
        },
        onError: (error) => {
          console.error('Error updating routine:', error);
        }
      });
    }
  };

  const handleDelete = (blockId: string) => {
    deleteBlockMutation.mutate(blockId, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error('Error deleting routine:', error);
      }
    });
  };

  const getLoadingMessage = () => {
    if (createBlockMutation.isPending) return 'Creando rutina...';
    if (updateBlockMutation.isPending) return 'Actualizando rutina...';
    if (deleteBlockMutation.isPending) return 'Eliminando rutina...';
    return 'Cargando rutina...';
  };

  if (loadingData) {
    return (
      <ThemedView style={styles.container}>
        <LoadingOverlay visible={true} message="Cargando rutina..." />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader
        title={isEditMode ? 'Editar rutina' : 'Añadir rutina'}
        showBackButton
        onBack={router.back}
      />

      <LoadingOverlay visible={isMutating} message={getLoadingMessage()} />

      <BlockCreateEditForm
        initialBlock={initialBlock}
        mode={isEditMode ? 'edit' : 'add'}
        isMutating={isMutating}
        onSave={handleSave}
        onCancel={() => router.back()}
        onDelete={isEditMode ? handleDelete : undefined}
      />
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
}); 
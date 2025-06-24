import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { routineStateStyles } from '../../shared/utils/routine-state-styles';
import colors from '../../shared/theme/theme';
import { useQueryClient } from '@tanstack/react-query';
import usePrivateRoutineBlockApi from '../../private-routines/hooks/use-private-routine-block-status';
import PrivateRoutineItem from './private-routine-item';
import { BlockStatus } from '../../private-routines/api/private-routine-block-api';

interface PrivateRoutineBlockProps {
  block: {
    id: string;
    title: string;
    description: string;
    status: BlockStatus;
  };
}

export default function PrivateRoutineBlock({ block }: PrivateRoutineBlockProps) {
  const { updateStatusMutation } = usePrivateRoutineBlockApi();
  const status = block.status || BlockStatus.NULL;
  const [showOptions, setShowOptions] = useState(status === BlockStatus.NULL);
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

  const handleStatusUpdate = (newStatus: BlockStatus) => {
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
    if (status === BlockStatus.DONE) return;
    setShowOptions(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShowOptions(false);
      if (status === BlockStatus.NULL) {
        handleStatusUpdate(BlockStatus.VISUALIZED);
      }
    }, 3000);
  };

  const renderActionButtons = () => {
    if (status === BlockStatus.DONE) {
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
            onPress={() => handleStatusUpdate(BlockStatus.VISUALIZED)}
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
            onPress={() => handleStatusUpdate(BlockStatus.DONE)}
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
            status === BlockStatus.VISUALIZED ? styles.visualizedButton : styles.nullButton
          ]}
          onPress={handleStatusButtonClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={15} color={colors.light.palette.blue[500]} />
          ) : status === BlockStatus.NULL ? (
            <Ionicons name="eye-outline" size={15} color={colors.light.palette.blue[500]} />
          ) : (
            <MaterialCommunityIcons name="dumbbell" size={15} color={colors.light.palette.blue[500]} />
          )}
          <ThemedText style={styles.statusButtonText}>
            {status === BlockStatus.NULL ? 'Pendiente' : 'En progreso'}
          </ThemedText>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[styles.block, { backgroundColor: style.backgroundColor }, status === BlockStatus.NULL ? { borderColor: '#90CDF4', borderWidth: 1 } : { borderColor: 'transparent', borderWidth: 0 }] }>
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

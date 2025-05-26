import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedText from '@/app/modules/shared/components/themed-text';
import privateRoutineBlockApi, { BlockStatus } from '../api/private-routine-block-api';
import { useQueryClient } from '@tanstack/react-query';
import { routineStateStyles } from '../../shared/utils/routine-state-styles';
import { useRouter } from 'expo-router';

interface RoutineBlockItemProps {
  block: any;
  showEditButton?: boolean;
  onEdit?: (block: any) => void;
  stateIconCentered?: boolean;
}

function getNextRoutineState(current: BlockStatus): BlockStatus {
  if (current === BlockStatus.NULL) return BlockStatus.VISUALIZED;
  if (current === BlockStatus.VISUALIZED) return BlockStatus.DONE;
  return BlockStatus.DONE;
}

const styles = StyleSheet.create({
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 8,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 90,
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
  stateIconRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 12,
  },
});

const RoutineBlockItem = ({ block, showEditButton = true, onEdit, stateIconCentered = false }: RoutineBlockItemProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const status: BlockStatus = block.status || BlockStatus.NULL;
  const style = routineStateStyles[status];
  const activities = block.description
    ? block.description.split(/\n|\r|•/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  const handleStatusPress = async () => {
    if (status === BlockStatus.DONE) return;
    const nextStatus = getNextRoutineState(status);
    setIsLoading(true);
    try {
      await privateRoutineBlockApi.updateBlockStatus({
        blockId: block.id,
        status: nextStatus
      });
      await queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      await queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.routineCard,
        { backgroundColor: style.backgroundColor },
        status === BlockStatus.NULL
          ? { borderColor: '#90CDF4', borderWidth: 1 }
          : { borderColor: 'transparent', borderWidth: 0 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.cardTitle}>{block.title}</ThemedText>
        <View style={{ marginTop: 6 }}>
          {activities.map((act: string, idx: number) => (
            <ThemedText key={idx} style={styles.activityBullet}>• {act}</ThemedText>
          ))}
        </View>
      </View>
      {stateIconCentered ? (
        <View style={styles.stateIconRight}>
          <TouchableOpacity onPress={handleStatusPress} style={styles.iconButton} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={24} color={style.iconColor} />
            ) : status === BlockStatus.VISUALIZED ? (
              <MaterialCommunityIcons name="dumbbell" size={24} color={style.iconColor} />
            ) : (
              <Ionicons name={status === BlockStatus.DONE ? 'checkmark-circle-outline' : 'eye-outline'} size={24} color={style.iconColor} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={handleStatusPress} style={styles.iconButton} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={24} color={style.iconColor} />
            ) : status === BlockStatus.VISUALIZED ? (
              <MaterialCommunityIcons name="dumbbell" size={24} color={style.iconColor} />
            ) : (
              <Ionicons name={status === BlockStatus.DONE ? 'checkmark-circle-outline' : 'eye-outline'} size={24} color={style.iconColor} />
            )}
          </TouchableOpacity>
          {showEditButton && (
            <TouchableOpacity onPress={() => router.push({ pathname: '/modules/private-routines/screens/edit-routine', params: { blockId: block.id } })} style={styles.iconButton}>
              <Ionicons name={"pencil-outline" as const} size={22} color={style.iconColor} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default RoutineBlockItem; 
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedText from '@/app/modules/shared/components/themed-text';
import privateRoutineBlockApi, { BlockStatus } from '../api/private-routine-block-api';
import { useQueryClient } from '@tanstack/react-query';
import { routineStateStyles } from '../../shared/utils/routine-state-styles';
import { useRouter } from 'expo-router';
import { useReorderableDrag } from 'react-native-reorderable-list';

interface RoutineBlockItemProps {
  block: any;
  showEditButton?: boolean;
  stateIconCentered?: boolean;
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dragHandleContainer: {
    paddingHorizontal: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  routineCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#F7FAFC',
    borderColor: '#90CDF4',
    borderWidth: 1,
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
});

const RoutineBlockItem = React.memo(({ block, showEditButton = true, stateIconCentered = false }: RoutineBlockItemProps) => {
  const drag = useReorderableDrag();
  const router = useRouter();
  const activities = block.description
    ? block.description.split(/\n|\r|•/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPressIn={drag} style={styles.dragHandleContainer}>
        <MaterialCommunityIcons name="drag-vertical" size={24} color="#A0AEC0" />
      </TouchableOpacity>
      <View style={styles.routineCard}>
        <View style={{ flex: 1 }}>
          <View>
            <ThemedText style={styles.cardTitle}>{block.title}</ThemedText>
          </View>
          <View style={{ marginTop: 6 }}>
            {activities.map((act: string, idx: number) => (
              <ThemedText key={idx} style={styles.activityBullet}>• {act}</ThemedText>
            ))}
          </View>
        </View>
        {showEditButton && (
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(routes)/(private)/private-routine/block-detail',
              params: {
                blockId: block.id,
                routineDayId: block.routineDayId,
                weekDay: block.weekDay,
                order: block.order
              }
            })} style={styles.iconButton}>
              <Ionicons name="pencil-outline" size={22} color="#4A5568" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

export default RoutineBlockItem; 
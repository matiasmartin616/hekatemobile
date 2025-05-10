import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import usePrivateRoutinesApi from '@/app/modules/private-routines/hooks/use-private-routines-api';
import { PrivateRoutineBlock } from '@/app/modules/private-routines/api/private-routines-api';
import { router } from 'expo-router';
import PrivateRoutineList from './private-routine-list';
import colors from '../../shared/theme/theme';

export default function PrivateRoutineSection() {
    const { todayData, todayLoading } = usePrivateRoutinesApi();
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

    const handleToggleCompleted = (taskId: string) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handleVisualizeTask = (task: PrivateRoutineBlock) => {
        console.log('Visualizing task:', task);
    };

    const blocks = todayData?.blocks || [];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.title}>Mi día</ThemedText>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push("/(routes)/(private)/(tabs)/routine")}
                >
                    <ThemedText style={styles.editButtonText}>Editar rutinas</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {todayLoading ? (
                <View style={styles.loadingContainer}>
                    <ThemedText>Cargando rutinas...</ThemedText>
                </View>
            ) : blocks.length > 0 ? (
                <PrivateRoutineList
                    blocks={blocks}
                    onVisualize={handleVisualizeTask}
                    onToggleComplete={handleToggleCompleted}
                    completedTasks={completedTasks}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <ThemedText>No hay rutinas para hoy</ThemedText>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderRadius: 16,
        padding: 15,
        backgroundColor: colors.light.palette.blue[50],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        color: colors.light.palette.blue[500],
        fontWeight: '500',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    }
});
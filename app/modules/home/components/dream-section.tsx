import { useState } from 'react';
import { StyleSheet, Alert, FlatList } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import useDreamsApiFetching from '../../dreams/hooks/use-dreams-api';
import DreamCard from './dream-card';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import { useRouter } from 'expo-router';

export default function DreamSection() {
    const theme = useTheme();
    const router = useRouter();
    const { dreams, isLoading, refetch, visualizeDream } = useDreamsApiFetching();
    const [visualizingDreamId, setVisualizingDreamId] = useState<string | null>(null);

    const handleSeeDreamDetail = (dreamId: string) => {
        router.push(`/dreams/${dreamId}`);
    };

    const handleVisualize = async (dreamId: string) => {
        setVisualizingDreamId(dreamId);
        visualizeDream.mutate(
            { dreamId },
            {
                onSuccess: () => {
                    refetch();
                    setVisualizingDreamId(null);
                },
                onError: () => {
                    setVisualizingDreamId(null);
                    Alert.alert('Error', 'No se pudo visualizar el sueño. Inténtalo de nuevo.');
                }
            }
        );
    };

    if (isLoading) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.primary.main }]}>Cargando sueños...</ThemedText>;
    }
    if (dreams && dreams.length === 0) {
        return <ThemedText style={[styles.loadingText, { color: theme.colors.primary.main }]}>No hay sueños disponibles</ThemedText>;
    }

    return (
        <FlatList
            data={dreams}
            keyExtractor={item => item.id}
            style={styles.flatList}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingVertical: theme.spacing.sm,
                paddingLeft: theme.spacing.sm
            }}
            renderItem={({ item }) => (
                <DreamCard
                    title={item.title}
                    description={item.text}
                    images={[require('@assets/images/dream-carousel-default-image.png'), require('@assets/images/dream-carousel-default-image.png')]}
                    onViewComplete={() => handleSeeDreamDetail(item.id)}
                    onAddImage={() => { }}
                    onVisualize={() => handleVisualize(item.id)}
                    isVisualized={!item.canVisualize || item.slotVisualized}
                    isVisualizing={visualizingDreamId === item.id}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        padding: 16,
        textAlign: 'center',
    },
    flatList: {
        width: '100%',
        marginLeft: -4,
        marginTop: 8
    }
}); 
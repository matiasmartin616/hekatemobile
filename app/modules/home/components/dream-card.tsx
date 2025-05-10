import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/app/modules/shared/theme/theme';
import { useModal } from '../../shared/context/modal-context';
import useDreamsApi from '../../dreams/hooks/use-dreams-api';
import { useQueryClient } from '@tanstack/react-query';

export interface DreamCardProps {
    id: string;
    title: string;
    description: string;
    images: string[];
    canVisualize: boolean;
    slotVisualized: boolean;
    onViewComplete?: () => void;
    onAddImage?: () => void;
}

export default function DreamCard({
    id,
    title,
    description,
    images,
    canVisualize,
    slotVisualized,
    onViewComplete,
    onAddImage,
}: DreamCardProps) {
    /** Limitamos a 2 miniaturas + botón "add" */
    const imageData = images.slice(0, 2);
    imageData.push('add');

    const { openModal } = useModal();
    const { visualizeDream, refetch } = useDreamsApi();
    const queryClient = useQueryClient();
    const [isVisualizing, setIsVisualizing] = useState(false);

    // Determine if the dream is visualized from props
    const isVisualized = !canVisualize || slotVisualized;

    const handleImagePress = (image: string) => {
        const screenWidth = Dimensions.get('window').width;
        const imageSize = screenWidth * 0.8; // 80% del ancho de pantalla

        openModal(
            <Image
                source={{ uri: image }}
                style={{ width: imageSize, height: imageSize }}
                resizeMode="contain"
            />,
            true
        );
    };

    const handleVisualize = async () => {
        if (isVisualized || isVisualizing) return;

        setIsVisualizing(true);

        // Perform optimistic update
        queryClient.setQueryData(['dreams', false], (oldData: any) => {
            if (!oldData) return oldData;

            return oldData.map((dream: any) =>
                dream.id === id
                    ? { ...dream, slotVisualized: true, canVisualize: false }
                    : dream
            );
        });

        visualizeDream.mutate(
            { dreamId: id },
            {
                onSuccess: () => {
                    setIsVisualizing(false);
                },
                onError: () => {
                    // Revert the optimistic update on error
                    queryClient.setQueryData(['dreams', false], (oldData: any) => {
                        if (!oldData) return oldData;

                        return oldData.map((dream: any) =>
                            dream.id === id
                                ? { ...dream, slotVisualized: false, canVisualize: true }
                                : dream
                        );
                    });

                    setIsVisualizing(false);
                    Alert.alert('Error', 'No se pudo visualizar el sueño. Inténtalo de nuevo.');
                },
                onSettled: () => {
                    // Always refetch after error or success to ensure we're showing the correct server state
                    refetch();
                }
            }
        );
    };

    return (
        <View style={styles.card}>

            <View style={styles.headerRow}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onViewComplete}>
                    <Text style={styles.viewComplete}>
                        Ver completo{' '}
                        <Ionicons name="arrow-forward" size={14} color="#1253AA" />
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {description}
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageList}
                contentContainerStyle={styles.imageListContent}
            >
                {imageData.map((item, i) =>
                    item === 'add' ? (
                        <TouchableOpacity
                            key={i}
                            style={styles.addImage}
                            onPress={onAddImage}
                        >
                            <Ionicons name="add" size={28} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleImagePress(item)} key={i}>
                            <Image
                                source={{ uri: item }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )
                )}
            </ScrollView>

            {/* Botón Visualizar */}
            <TouchableOpacity
                style={[
                    styles.visualizeBtn,
                    isVisualized && styles.visualizedBtn,
                    isVisualizing && styles.visualizingBtn
                ]}
                onPress={handleVisualize}
                disabled={isVisualized || isVisualizing}
            >
                {isVisualizing ? (
                    <>
                        <ActivityIndicator
                            size="small"
                            color={colors.light.palette.blue[500]}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.visualizeText}>
                            Cargando...
                        </Text>
                    </>
                ) : (
                    <>
                        <Ionicons
                            name={isVisualized ? "checkmark" : "eye-outline"}
                            size={18}
                            color={isVisualized ? colors.light.palette.blue[700] : colors.light.palette.blue[500]}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={[
                            styles.visualizeText,
                            isVisualized && styles.visualizedText
                        ]}>
                            {isVisualized ? "Visualizado" : "Visualizar"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.light.palette.blue[50],
        borderRadius: 16,
        padding: 14,
        marginRight: 16,
        width: 300,
        shadowColor: colors.light.palette.blue[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        elevation: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.light.neutral.black,
        flex: 1,
    },
    viewComplete: {
        color: colors.light.neutral.black,
        fontWeight: '600',
        fontSize: 13,
    },
    description: {
        color: colors.light.neutral.black,
        fontSize: 13,
        marginBottom: 8,
    },
    imageList: {
        marginBottom: 12,
        maxHeight: THUMB_SIZE,      // límite vertical para evitar apilado
    },
    imageListContent: {
        alignItems: 'center',
        paddingRight: 10,
    },
    image: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: colors.light.palette.blue[100],
    },
    addImage: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 12,
        backgroundColor: colors.light.palette.blue[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    visualizeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.light.palette.blue[500],
        borderRadius: 20,
        paddingVertical: 6,
        justifyContent: 'center',
    },
    visualizeText: {
        color: colors.light.palette.blue[500],
        fontWeight: 'bold',
        fontSize: 15,
    },
    visualizedBtn: {
        borderColor: colors.light.palette.blue[700],
        backgroundColor: colors.light.palette.blue[100],
    },
    visualizedText: {
        color: colors.light.palette.blue[700],
    },
    visualizingBtn: {
        borderColor: colors.light.palette.blue[300],
        backgroundColor: colors.light.palette.blue[50],
    },
});

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/app/modules/shared/theme/theme';
import { useModal } from '../../shared/context/modal-context';
import useDreamsApi from '../../dreams/hooks/use-dreams-api';
import useDreamImagesApi from '../../dreams/hooks/use-dream-images-api';
import { useQueryClient } from '@tanstack/react-query';
import ImageCarousel from '@/app/modules/shared/components/image-carousel';

export interface DreamCardProps {
    id: string;
    title: string;
    description: string;
    canVisualize: boolean;
    slotVisualized: boolean;
    onViewComplete?: () => void;
}

export default function DreamCard({
    id,
    title,
    description,
    canVisualize,
    slotVisualized,
    onViewComplete,
}: DreamCardProps) {
    const { openModal } = useModal();
    const { visualizeDream, refetch } = useDreamsApi();
    const { uploadDreamImage } = useDreamImagesApi(id);
    const queryClient = useQueryClient();
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const { images } = useDreamImagesApi(id);
    // Determine if the dream is visualized from props
    const isVisualized = !canVisualize || slotVisualized;

    const handleAddImage = () => {
        if (isUploadingImage) return;

        // Show options to take photo or choose from gallery
        Alert.alert(
            'Añadir imagen',
            'Selecciona una opción',
            [
                {
                    text: 'Tomar foto',
                    onPress: () => takePhoto(),
                },
                {
                    text: 'Galería',
                    onPress: () => pickImage(),
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería de fotos');
                return;
            }

            // Open image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                const selectedUri = result.assets[0].uri;
                await uploadImage(selectedUri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
        }
    };

    const takePhoto = async () => {
        try {
            // Request camera permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu cámara');
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                const selectedUri = result.assets[0].uri;
                await uploadImage(selectedUri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Ocurrió un error al tomar la foto');
        }
    };

    const uploadImage = async (imageUri: string) => {
        try {
            setIsUploadingImage(true);

            await uploadDreamImage.mutateAsync({
                dreamId: id,
                image: imageUri
            });

        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Ocurrió un error al subir la imagen');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImagePress = (imageUri: string) => {
        const screenWidth = Dimensions.get('window').width;
        const imageSize = screenWidth * 0.8; // 80% del ancho de pantalla

        openModal(
            <Image
                source={{ uri: imageUri }}
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
                    // Forzar una actualización limpia del contador
                    queryClient.resetQueries({ queryKey: ['visualizations-history'] });
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

            <ImageCarousel
                images={images?.map(image => image.signedUrl || image.storageUrl) || []}
                onImagePress={handleImagePress}
                onAddPress={handleAddImage}
                maxImages={7}
                thumbSize={64}
                style={styles.imageList}
                isLoading={isUploadingImage}
            />

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
        maxHeight: THUMB_SIZE,
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

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Dimensions, ViewStyle } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import ThemedText from '../themed-text';
import colors from '../../theme/theme';
import ImageCarousel from '../image-carousel';
import { useModal } from '../../context/modal-context';
import { Image } from 'react-native';

interface ImageCarouselInputProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues, any>;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    maxImages?: number;
    thumbSize?: number;
    style?: ViewStyle;
}

export default function ImageCarouselInput<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    maxImages = 5,
    thumbSize = 64,
    style,
}: ImageCarouselInputProps<TFieldValues>) {
    const { openModal, closeModal } = useModal();
    const { field, fieldState } = useController<TFieldValues>({
        name,
        control,
        rules: {
            required: required ? 'Se requieren imágenes' : false,
        },
    });


    // Initialize field value as array if not already
    if (!field.value) {
        field.onChange([]);
    }

    const imageUrls = Array.isArray(field.value) ? field.value : [];

    const handleImagePress = (imageUri: string) => {
        const screenWidth = Dimensions.get('window').width;
        const imageSize = screenWidth * 0.8; // 80% del ancho de pantalla

        openModal(
            <View style={styles.modalContainer}>
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: imageSize, height: imageSize }}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        // Remove image and close modal
                        const newImages = imageUrls.filter(uri => uri !== imageUri);
                        field.onChange(newImages);
                        closeModal();
                    }}
                >
                    <ThemedText style={styles.deleteButtonText}>Eliminar imagen</ThemedText>
                </TouchableOpacity>
            </View>,
            true
        );
    };

    const handleAddImage = async () => {
        if (disabled) return;

        // Check if we can add more images
        if (imageUrls.length >= maxImages) {
            Alert.alert('Límite excedido', `Solo puedes seleccionar hasta ${maxImages} imágenes`);
            return;
        }

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
                allowsEditing: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                const selectedUri = result.assets[0].uri;

                // Add the new image to existing ones
                field.onChange([...imageUrls, selectedUri]);
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
                allowsEditing: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                const selectedUri = result.assets[0].uri;

                // Add the new image to existing ones
                field.onChange([...imageUrls, selectedUri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Ocurrió un error al tomar la foto');
        }
    };

    return (
        <View style={[styles.container, style]}>
            {label && (
                <ThemedText style={styles.label}>
                    {label} {required && <ThemedText style={styles.required}>*</ThemedText>}
                </ThemedText>
            )}

            <View style={[
                styles.carouselContainer,
                fieldState.error && styles.containerError
            ]}>
                <ImageCarousel
                    images={imageUrls}
                    onImagePress={handleImagePress}
                    onAddPress={handleAddImage}
                    maxImages={maxImages}
                    thumbSize={thumbSize}
                    showAddButton={!disabled}
                />
            </View>

            {fieldState.error && (
                <ThemedText style={styles.errorText}>
                    {fieldState.error?.message}
                </ThemedText>
            )}

            {imageUrls.length === 0 && (
                <TouchableOpacity
                    onPress={handleAddImage}
                    disabled={disabled}
                    style={styles.emptyStateButton}
                >
                    <ThemedText style={styles.emptyStateText}>
                        Añade imágenes a tu sueño
                    </ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: colors.light.primary.main,
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    carouselContainer: {
        backgroundColor: colors.light.neutral.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[200],
        padding: 12,
        minHeight: 88, // Accommodate thumb size + padding
    },
    containerError: {
        borderWidth: 2,
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        fontFamily: 'Inter',
        textAlign: 'left',
        paddingLeft: 15,
    },
    emptyStateButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    emptyStateText: {
        color: colors.light.palette.blue[500],
        fontSize: 14,
    },
    modalContainer: {
        alignItems: 'center',
    },
    deleteButton: {
        marginTop: 16,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
}); 
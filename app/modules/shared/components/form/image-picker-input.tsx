import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import ThemedText from '../themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../theme/theme';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerInputProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues, any>;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    maxImages?: number;
}

export default function ImagePickerInput<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    multiple = false,
    maxImages = 5
}: ImagePickerInputProps<TFieldValues>) {
    const [isFocused, setIsFocused] = useState(false);
    const { field, fieldState } = useController<TFieldValues>({
        name,
        control,
        rules: {
            required: required ? 'Se requieren imágenes' : false,
        },
    });

    // Initialize field value as array if not already
    if (!field.value && multiple) {
        field.onChange([]);
    }

    const imageUrls = multiple
        ? (field.value || [])
        : field.value ? [field.value] : [];

    const handleSelectImages = async () => {
        if (disabled) return;

        try {
            // Request permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería de fotos');
                return;
            }

            // Open image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: !multiple,
                allowsMultipleSelection: multiple,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                if (multiple) {
                    // For multiple images
                    const selectedAssets = result.assets;
                    const selectedUris = selectedAssets.map(asset => asset.uri);

                    // Check if adding these would exceed the maximum
                    if (imageUrls.length + selectedUris.length > maxImages) {
                        Alert.alert('Límite excedido', `Solo puedes seleccionar hasta ${maxImages} imágenes`);
                        return;
                    }

                    // Add new images to existing ones
                    field.onChange([...imageUrls, ...selectedUris]);
                } else {
                    // For single image
                    field.onChange(result.assets[0].uri);
                }
            }
        } catch (error) {
            console.error('Error selecting images:', error);
            Alert.alert('Error', 'Ocurrió un error al seleccionar imágenes');
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        if (disabled) return;

        if (multiple) {
            const newImages = [...imageUrls];
            newImages.splice(indexToRemove, 1);
            field.onChange(newImages);
        } else {
            field.onChange(undefined);
        }
    };

    const handleTakePhoto = async () => {
        if (disabled) return;

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
                if (multiple) {
                    // Check if adding this would exceed the maximum
                    if (imageUrls.length + 1 > maxImages) {
                        Alert.alert('Límite excedido', `Solo puedes seleccionar hasta ${maxImages} imágenes`);
                        return;
                    }

                    field.onChange([...imageUrls, result.assets[0].uri]);
                } else {
                    field.onChange(result.assets[0].uri);
                }
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Ocurrió un error al tomar la foto');
        }
    };

    const getContainerStyle = () => {
        if (fieldState.error) return [styles.imagePickerContainer, styles.containerError];
        return isFocused ? [styles.imagePickerContainer, styles.containerFocused] : styles.imagePickerContainer;
    };

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText style={styles.label}>
                    {label} {required && <ThemedText style={styles.required}>*</ThemedText>}
                </ThemedText>
            )}

            <View style={getContainerStyle()}>
                {imageUrls.length > 0 ? (
                    <View style={styles.imagesContainer}>
                        {imageUrls.map((uri, index) => (
                            <View key={`${uri}-${index}`} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveImage(index)}
                                    disabled={disabled}
                                >
                                    <Ionicons name="close-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {multiple && imageUrls.length < maxImages && (
                            <TouchableOpacity
                                style={styles.addMoreButton}
                                onPress={handleSelectImages}
                                disabled={disabled}
                            >
                                <Ionicons name="add" size={24} color={colors.light.primary.main} />
                                <ThemedText style={styles.addButtonText}>Añadir más</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View style={styles.placeholderContainer}>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={handleSelectImages}
                            disabled={disabled}
                        >
                            <Ionicons name="images-outline" size={24} color={colors.light.primary.main} />
                            <ThemedText style={styles.buttonText}>Seleccionar de la galería</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handleTakePhoto}
                            disabled={disabled}
                        >
                            <Ionicons name="camera-outline" size={24} color={colors.light.primary.main} />
                            <ThemedText style={styles.buttonText}>Tomar foto</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {fieldState.error && (
                <ThemedText style={styles.errorText}>
                    {fieldState.error?.message}
                </ThemedText>
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
    imagePickerContainer: {
        backgroundColor: colors.light.neutral.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[200],
        overflow: 'hidden',
        minHeight: 120,
    },
    containerFocused: {
        borderWidth: 2,
        borderColor: colors.light.palette.blue[300],
    },
    containerError: {
        borderWidth: 2,
        borderColor: 'red',
    },
    placeholderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        height: 120,
    },
    selectButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    cameraButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: colors.light.palette.blue[100],
        marginHorizontal: 10,
    },
    buttonText: {
        color: colors.light.primary.main,
        marginTop: 8,
        textAlign: 'center',
        fontSize: 13,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    imageWrapper: {
        position: 'relative',
        margin: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addMoreButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.light.palette.blue[200],
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    addButtonText: {
        fontSize: 12,
        color: colors.light.primary.main,
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        fontFamily: 'Inter',
        textAlign: 'left',
        paddingLeft: 15,
    },
}); 
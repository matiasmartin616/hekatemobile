import { Alert, Image, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import ThemedView from "../../shared/components/themed-view";
import ThemedText from "../../shared/components/themed-text";
import ThemedButton from "../../shared/components/themed-button";
import { Ionicons } from "@expo/vector-icons";
import { useModal } from "../../shared/context/modal-context";
import colors from "@shared/theme/theme";
import useDreamImagesApi from "../../dreams/hooks/use-dream-images-api";

export default function useDreamImageDetail(id: string) {
    const { openModal, closeModal } = useModal();
    const { deleteDreamImage } = useDreamImagesApi(id);
    const { images } = useDreamImagesApi(id);

    const handleImagePress = (imageUri: string) => {
        const screenWidth = Dimensions.get('window').width;
        const imageSize = screenWidth * 0.8; // 80% del ancho de pantalla

        // Find the image object that matches this URI
        const imageObject = images?.find(img =>
            (img.signedUrl === imageUri || img.storageUrl === imageUri)
        );

        if (!imageObject) {
            // If image object not found, just show the image
            openModal(
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: imageSize, height: imageSize }}
                    resizeMode="contain"
                />,
                true
            );
            return;
        }

        openModal(
            <ThemedView style={styles.imageModalContainer}>
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: imageSize, height: imageSize }}
                    resizeMode="contain"
                />
                <ThemedView style={styles.deleteButtonContainer}>
                    <ThemedButton
                        onPress={() => {
                            Alert.alert(
                                "Eliminar imagen",
                                "¿Estás seguro que quieres eliminar esta imagen?",
                                [
                                    {
                                        text: "Cancelar",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Eliminar",
                                        style: "destructive",
                                        onPress: () => {
                                            deleteDreamImage.mutate(imageObject.id, {
                                                onSuccess: () => {
                                                    closeModal();
                                                },
                                                onError: (error) => {
                                                    Alert.alert("Error", "No se pudo eliminar la imagen");
                                                    console.error("Error deleting image:", error);
                                                }
                                            });
                                        }
                                    }
                                ]
                            );
                        }}
                        title=""
                        icon={<Ionicons name="trash-outline" size={18} color={colors.light.palette.red[500]} />}
                        variant="outline"
                        size="small"
                        style={styles.deleteImageButton}
                        iconOnly={true}
                    />
                </ThemedView>
            </ThemedView>,
            true
        );
    };

    return {
        handleImagePress,
    }
}

const styles = StyleSheet.create({
    imageModalContainer: {
        alignItems: 'center',
        paddingBottom: 10,
        marginTop: 40,
        width: '100%',
    },
    deleteButtonContainer: {
        alignSelf: 'flex-start',
        marginTop: 16,
    },
    deleteImageButton: {
        borderColor: colors.light.palette.red[300],
        backgroundColor: 'transparent',
    },
});
import { Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import useDreamImagesApi from "../../dreams/hooks/use-dream-images-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDreamImageCreate(id: string) {
  const queryClient = useQueryClient();
  const { uploadDreamImage } = useDreamImagesApi(id);

  const uploadImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      return await uploadDreamImage.mutateAsync({
        dreamId: id,
        image: imageUri
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`dreams-images-${id}`] });
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Ocurrió un error al subir la imagen');
    }
  });

  const handleAddImage = () => {
    if (uploadImageMutation.isPending) return;

    Alert.alert(
      "Añadir imagen",
      "Selecciona una opción",
      [
        {
          text: "Tomar foto",
          onPress: () => takePhoto(),
        },
        {
          text: "Galería",
          onPress: () => pickImage(),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permisos para acceder a tu galería de fotos"
        );
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
        uploadImageMutation.mutate(selectedUri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Ocurrió un error al seleccionar la imagen");
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permisos para acceder a tu cámara"
        );
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
        uploadImageMutation.mutate(selectedUri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Ocurrió un error al tomar la foto");
    }
  };

  return {
    handleAddImage,
    isUploadingImage: uploadImageMutation.isPending,
  };
}

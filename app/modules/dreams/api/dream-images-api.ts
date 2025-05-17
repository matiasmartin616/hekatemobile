import { api } from '@shared/services/api';

export interface DreamImage {
    id: string;
    dreamId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageUrl: string;
    signedUrl: string;
    createdAt: string;
}

export interface DreamImagesResponse {
    images: DreamImage[];
}

export interface UploadImageResponse {
    success: boolean;
    filePath: string;
}

export interface UploadMultipleImagesResponse {
    success: boolean;
    count: number;
    filePaths: string[];
}

export const dreamImagesApi = {
    /**
     * Get all images for a specific dream
     */
    getDreamImages: async (dreamId: string): Promise<DreamImage[]> => {
        try {
            const response = await api.get<DreamImagesResponse>(`/dream-images/${dreamId}`);
            return response.images;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al obtener las imágenes de sueños');
        }
    },
    
    /**
     * Get a specific dream image URL by ID
     */
    getDreamImageUrl: async (imageId: string): Promise<string> => {
        try {
            const response = await api.get<{url: string}>(`/dream-images/image/${imageId}`);
            return response.url;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al obtener la URL de imagen del sueño');
        }
    },
    
    /**
     * Get a specific dream image URL by file path
     */
    getDreamImageUrlByPath: async (filePath: string): Promise<string> => {
        try {
            const response = await api.get<{url: string}>(`/dream-images/path/${filePath}`);
            return response.url;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al obtener la URL de imagen del sueño');
        }
    },
    
    /**
     * Upload a single image for a dream
     * @param dreamId ID of the dream
     * @param imageUri Local URI of the image on the device
     */
    uploadDreamImage: async (dreamId: string, imageUri: string) => {
        const form = new FormData();
        const name = imageUri.split('/').pop() ?? 'photo.jpg';
        const ext  = /\.(\w+)$/.exec(name)?.[1] ?? 'jpeg';
        form.append('image', {
          uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`, // Android requires file://
          name,
          type: `image/${ext}`,
        } as any);
      
        // 2. Call – without Content-Type
        const response = await api.post<UploadImageResponse>(
          `/dream-images/${dreamId}`,
          form
        );
      
        return response.filePath;
    },
    
    /**
     * Upload multiple images for a dream
     * @param dreamId ID of the dream
     * @param imageUris Array of local URIs of the images on the device
     */
    uploadMultipleDreamImages: async (dreamId: string, imageUris: string[]): Promise<string[]> => {
        try {
            // Create FormData for multipart request
            const formData = new FormData();
            
            // Add each image to the formData
            imageUris.forEach((imageUri, index) => {
                const fileName = imageUri.split('/').pop() || `image${index}.jpg`;
                const match = /\.(\w+)$/.exec(fileName);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                // For each image, append to the 'images' field (matching the server expectation)
                formData.append('images', {
                    uri: imageUri,   // Local path on the device
                    name: fileName,  // Name for the server
                    type: type,      // MIME type
                } as any);
            });
            
            // Send multipart form request with all the files
            const response = await api.post<UploadMultipleImagesResponse>(
                `/dream-images/${dreamId}/multiple`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            return response.filePaths;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al subir múltiples imágenes del sueño');
        }
    },
    
    /**
     * Delete a dream image
     */
    deleteDreamImage: async (imageId: string): Promise<void> => {
        try {
            await api.delete(`/dream-images/${imageId}`);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al eliminar la imagen del sueño');
        }
    }
};

export default dreamImagesApi; 
import { api } from "@shared/services/api";
import { DreamImage } from "./dream-images-api";
import { useQueryClient } from "@tanstack/react-query";

export interface Dream {
  id: string;
  title: string;
  text: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  visualizations: Visualization[];
  images: DreamImage[];
  _count: {
    visualizations: number;
    images: number;
  };
  todayVisualizations: number;
  slotVisualized: boolean; // If the dream was visualized in the temporal slot today
  canVisualize: boolean; // If the dream can be visualized in the temporal slot today
}

export interface CreateDreamRequest {
  title: string;
  text: string;
  images?: File[] | string[]; // Allow file paths for React Native
}

export interface UpdateDreamRequest {
  title?: string;
  text?: string;
  images?: File[] | string[]; // Allow file paths for React Native
  keepImageIds?: string[]; // IDs of existing images to keep
}

export interface Visualization {
  id: string;
  dreamId: string;
  createdAt: string;
}

export type DreamVisualizationHistory = Visualization[];

export const dreamsApi = {
  /**
   * Get all dreams with optional archived filter
   */
  getDreams: async (archived: boolean = false): Promise<Dream[]> => {
    try {
      return await api.get<Dream[]>(`/dreams?archived=${archived}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al obtener los sueños");
    }
  },

  /**
   * Create a new dream
   */
  createDream: async (dream: CreateDreamRequest): Promise<Dream> => {
    try {
      // Handle with or without images
      if (!dream.images || dream.images.length === 0) {
        return await api.post<Dream>("/dreams", dream);
      }

      // Create FormData for multipart request with images
      const formData = new FormData();
      formData.append("title", dream.title);
      formData.append("text", dream.text);

      // Add each image to form data
      dream.images.forEach((image) => {
        if (typeof image === "string") {
          // Handle image URI (React Native)
          const fileName = image.split("/").pop() || "image.jpg";
          const match = /\.(\w+)$/.exec(fileName);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("images", {
            uri: image,
            name: fileName,
            type,
          } as any);
        }
      });

      return await api.post<Dream>("/dreams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al crear el sueño");
    }
  },

  /**
   * Update an existing dream
   */
  updateDream: async (
    dreamId: string,
    dream: UpdateDreamRequest
  ): Promise<Dream> => {
    try {
      // Handle with or without images
      if (!dream.images || dream.images.length === 0) {
        // If we have images to keep but no new images to upload
        if (
          "keepImageIds" in dream &&
          Array.isArray(dream.keepImageIds) &&
          dream.keepImageIds.length > 0
        ) {
          // Create FormData to pass the keepImageIds
          const formData = new FormData();
          if (dream.title) formData.append("title", dream.title);
          if (dream.text) formData.append("text", dream.text);

          // Add image IDs to keep
          dream.keepImageIds.forEach((imageId) => {
            formData.append("keepImageIds", imageId);
          });

          return await api.patch<Dream>(`/dreams/${dreamId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        // No images to upload or keep, just update text fields
        return await api.patch<Dream>(`/dreams/${dreamId}`, dream);
      }

      // Create FormData for multipart request with images
      const formData = new FormData();
      if (dream.title) formData.append("title", dream.title);
      if (dream.text) formData.append("text", dream.text);

      // Add existing image IDs to keep
      if ("keepImageIds" in dream && Array.isArray(dream.keepImageIds)) {
        dream.keepImageIds.forEach((imageId) => {
          formData.append("keepImageIds", imageId);
        });
      }

      // Add each new image to form data
      dream.images.forEach((image) => {
        if (typeof image === "string") {
          // Handle image URI (React Native)
          const fileName = image.split("/").pop() || "image.jpg";
          const match = /\.(\w+)$/.exec(fileName);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("images", {
            uri: image,
            name: fileName,
            type,
          } as any);
        } else {
          // Handle File object (Web)
          formData.append("images", image);
        }
      });

      return await api.patch<Dream>(`/dreams/${dreamId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al actualizar el sueño");
    }
  },

  /**
   * Archive a dream
   */
  archiveDream: async (dreamId: string): Promise<Dream> => {
    try {
      return await api.post<Dream>(`/dreams/${dreamId}/archive`, {});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al archivar el sueño");
    }
  },

  /**
   * Visualize a dream
   */
  visualizeDream: async (dreamId: string): Promise<Visualization> => {
    try {
      return await api.post<Visualization>(`/dreams/${dreamId}/visualize`, {});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al visualizar el sueño");
    }
  },

  /**
   * Get visualization history for a specific dream
   */
  getDreamHistory: async (
    dreamId: string
  ): Promise<DreamVisualizationHistory> => {
    try {
      return await api.get<DreamVisualizationHistory>(
        `/dreams/${dreamId}/history`
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al obtener el historial del sueño");
    }
  },

  /**
   * Get all visualizations history
   */
  getAllVisualizationsHistory: async (): Promise<Visualization[]> => {
    try {
      return await api.get<Visualization[]>("/dreams/visualizations/history");
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al obtener el historial de visualizaciones");
    }
  },

  /**
   * Delete a dream
   */
  deleteDream: async (dreamId: string): Promise<void> => {
    try {
      await api.post(`/dreams/${dreamId}/archive`, {});
    } catch (error) {
      console.error("API Delete Error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al eliminar el sueño");
    }
  },

  completeDream: async (dreamId: string): Promise<Dream> => {
    try {
      return await api.post<Dream>(`/dreams/${dreamId}/complete`, {});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al completar el sueño");
    }
  },
};

export default dreamsApi;

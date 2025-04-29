import { api } from '@shared/services/api';

export interface Dream {
  id: string;
  title: string;
  text: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  visualizations: Visualization[];
  _count: {
    visualizations: number;
  };
  todayVisualizations: number;
  slotVisualized: boolean;
  canVisualize: boolean;
}

export interface CreateDreamRequest {
  title: string;
  text: string;
  maxDaily: number;
}

export interface UpdateDreamRequest {
  title?: string;
  text?: string;
  maxDaily?: number;
}

export interface Visualization {
  id: string;
  dreamId: string;
  createdAt: string;
}

export interface ArchiveDreamRequest {
  reason?: string;
  archivedAt?: string;
  // otros campos relevantes para archivar
}

export interface VisualizeDreamRequest {
  duration?: number;
  notes?: string;
  // otros campos relevantes para la visualización
}

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
      throw new Error('Error al obtener los sueños');
    }
  },

  /**
   * Create a new dream
   */
  createDream: async (dream: CreateDreamRequest): Promise<Dream> => {
    try {
      return await api.post<Dream>('/dreams', dream);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al crear el sueño');
    }
  },

  /**
   * Update an existing dream
   */
  updateDream: async (dreamId: string, dream: UpdateDreamRequest): Promise<Dream> => {
    try {
      return await api.patch<Dream>(`/dreams/${dreamId}`, dream);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al actualizar el sueño');
    }
  },

  /**
   * Archive a dream
   */
  archiveDream: async (dreamId: string, data?: ArchiveDreamRequest): Promise<Dream> => {
    try {
      return await api.post<Dream>(`/dreams/${dreamId}/archive`, data || {});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al archivar el sueño');
    }
  },

  /**
   * Visualize a dream
   */
  visualizeDream: async (dreamId: string, data?: VisualizeDreamRequest): Promise<Visualization> => {
    try {
      return await api.post<Visualization>(`/dreams/${dreamId}/visualize`, data || {});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al visualizar el sueño');
    }
  },

  /**
   * Get visualization history for a specific dream
   */
  getDreamHistory: async (dreamId: string): Promise<Visualization[]> => {
    try {
      return await api.get<Visualization[]>(`/dreams/${dreamId}/history`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener el historial del sueño');
    }
  },

  /**
   * Get all visualizations history
   */
  getAllVisualizationsHistory: async (): Promise<Visualization[]> => {
    try {
      return await api.get<Visualization[]>('/dreams/visualizations/history');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener el historial de visualizaciones');
    }
  },

  /**
   * Delete a dream
   */
  deleteDream: async (dreamId: string): Promise<void> => {
    try {
      await api.delete(`/dreams/${dreamId}`);
    } catch (error) {
      console.error('API Delete Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al eliminar el sueño');
    }
  }
};

export default dreamsApi;
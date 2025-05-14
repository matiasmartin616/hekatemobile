import { api } from '@shared/services/api';

export interface DailyReading {
  id: string;
  title: string;
  content: string;
  timeMinutes: number;
  day: number;
  month: number;
  year: number;
}


export const readingApi = {
  /**
   * Get all dreams with optional archived filter
   */
  getDailyReading: async (): Promise<DailyReading> => {
    try {
      return await api.get<DailyReading>(`/daily-reads`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener la lectura diaria');
    }
  },
};

export default readingApi;
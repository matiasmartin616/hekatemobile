import { api } from '@shared/services/api';
import { PrivateRoutineBlock } from './private-routine-block-api';

export interface PrivateRoutine {
  id: string;
  routineId: string;
  weekDay: string;
  blocks: PrivateRoutineBlock[];
  day: number;
  month: number;
  year: number;
}

export const privateRoutinesApi = {
  /**
   * Get all dreams with optional archived filter
   */
  getPrivateRoutine: async (): Promise<PrivateRoutine> => {
    try {
      return await api.get<PrivateRoutine>(`/private-routines`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener la lectura diaria');
    }
  },
  getTodayPrivateRoutine: async (): Promise<PrivateRoutine> => {
    try {
      return await api.get<PrivateRoutine>(`/private-routines/today`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener la lectura diaria');
    }
  },
};

export default privateRoutinesApi;
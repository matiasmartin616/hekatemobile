import { api } from '@shared/services/api';


export interface PrivateRoutineBlock{
  id: string;
  routineDayId: string;
  weekDay: string;
  title: string;
  description: string;
  color: string;
  order: number;
  status: 'DONE' | 'VISUALIZED';
}

export interface UpdateBlockStatusRequest {
  blockId: string;
  status: 'DONE' | 'VISUALIZED';
}

export const privateRoutineBlockApi = {
  /**
   * Get all dreams with optional archived filter
   */
  updateBlockStatus: async (request: UpdateBlockStatusRequest) => {
    try {
      return await api.put(`/private-routines/blocks/${request.blockId}/status`, { status: request.status });
    } catch (error) {
      throw new Error('Error al actualizar el estado del bloque');
    }
  },
};

export default privateRoutineBlockApi;
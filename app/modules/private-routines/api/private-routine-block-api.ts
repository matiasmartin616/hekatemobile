import { api } from '@shared/services/api';

export enum BlockStatus {
  NULL = 'NULL',
  VISUALIZED = 'VISUALIZED',
  DONE = 'DONE'
}

export interface PrivateRoutineBlock {
  id: string;
  routineDayId: string;
  weekDay: string;
  title: string;
  description: string;
  color: string;
  order: number;
  status: BlockStatus;
}

export interface UpdateBlockStatusRequest {
  blockId: string;
  status: BlockStatus;
}

export const privateRoutineBlockApi = {
  /**
   * Get all dreams with optional archived filter
   */
  updateBlockStatus: async (request: UpdateBlockStatusRequest) => {
    try {
      // Send the status as a string value without toString()
      return await api.put(`/private-routines/blocks/${request.blockId}/status`, {
        status: request.status
      });
    } catch (error) {
      console.error('Error updating block status:', error);
      throw new Error('Error al actualizar el estado del bloque');
    }
  },
};

export default privateRoutineBlockApi;
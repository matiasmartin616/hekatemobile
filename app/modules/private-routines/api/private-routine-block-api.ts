import { api } from "@shared/services/api";

export enum BlockStatus {
  NULL = "NULL",
  VISUALIZED = "VISUALIZED",
  DONE = "DONE",
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

export interface UpdateBlockRequest {
  blockId: string;
  title?: string;
  description?: string;
  order?: number;
}

export interface CreateBlockRequest {
  title: string;
  description: string;
  order: number;
}

export const privateRoutineBlockApi = {
  /**
   * Get all dreams with optional archived filter
   */
  updateBlockStatus: async (request: UpdateBlockStatusRequest) => {
    try {
      // Send the status as a string value without toString()
      return await api.put(
        `/private-routines/blocks/${request.blockId}/status`,
        {
          status: request.status,
        }
      );
    } catch (error) {
      console.error("Error updating block status:", error);
      throw new Error("Error al actualizar el estado del bloque");
    }
  },

  deleteBlock: async (blockId: string): Promise<void> => {
    await api.delete(`/private-routines/blocks/${blockId}`);
  },

  createBlock: async (
    routineDayId: string,
    block: Omit<PrivateRoutineBlock, "id">
  ): Promise<PrivateRoutineBlock> => {
    return await api.post<PrivateRoutineBlock>(
      `/private-routines/blocks/${routineDayId}`,
      block
    );
  },

  updateBlock: async (
    blockId: string,
    data: Partial<PrivateRoutineBlock>
  ): Promise<PrivateRoutineBlock> => {
    // Ensure status is sent as a string value
    const updateData = {
      ...data,
      status: data.status
        ? data.status.toString()
        : BlockStatus.NULL.toString(),
    };
    return await api.put<PrivateRoutineBlock>(
      `/private-routines/blocks/${blockId}`,
      updateData
    );
  },

  reorderBlocks: async (
    routineDayId: string,
    blockIds: string[]
  ): Promise<void> => {
    await api.put(`/private-routines/days/${routineDayId}/reorder`, {
      blockIds,
    });
  },
};

export default privateRoutineBlockApi;

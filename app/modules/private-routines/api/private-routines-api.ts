import { PrivateRoutine } from '@modules/private-routines/api/private-routine-api';
import { PrivateRoutineBlock, BlockStatus } from '@modules/private-routines/api/private-routine-block-api';
import { api } from '@shared/services/api';

const privateRoutinesApi = {
    getPrivateRoutine: async (): Promise<PrivateRoutine> => {
        return await api.get<PrivateRoutine>('/private-routines');
    },

    getTodayPrivateRoutine: async (): Promise<PrivateRoutine> => {
        return await api.get<PrivateRoutine>('/private-routines/today');
    },

    updateRoutine: async (weekDay: string, data: Partial<PrivateRoutine>): Promise<PrivateRoutine> => {
        return await api.put<PrivateRoutine>(`/private-routines/${weekDay}`, data);
    },

    deleteBlock: async (weekDay: string, blockId: string): Promise<void> => {
        await api.delete(`/private-routines/${weekDay}/blocks/${blockId}`);
    },
    
    deleteBlockDirectly: async (blockId: string): Promise<void> => {
        await api.delete(`/private-routines/blocks/${blockId}`);
    },

    addBlock: async (weekDay: string, block: Omit<PrivateRoutineBlock, 'id'>): Promise<PrivateRoutineBlock> => {
        return await api.post<PrivateRoutineBlock>(`/private-routines/${weekDay}/blocks`, block);
    },

    addBlockDirectly: async (routineDayId: string, block: Omit<PrivateRoutineBlock, 'id'>): Promise<PrivateRoutineBlock> => {
        return await api.post<PrivateRoutineBlock>(`/private-routines/blocks/${routineDayId}`, block);
    },

    updateBlock: async (weekDay: string, blockId: string, data: Partial<PrivateRoutineBlock>): Promise<PrivateRoutineBlock> => {
        return await api.put<PrivateRoutineBlock>(`/private-routines/${weekDay}/blocks/${blockId}`, data);
    },
    
    updateBlockDirectly: async (blockId: string, data: Partial<PrivateRoutineBlock>): Promise<PrivateRoutineBlock> => {
        // Ensure status is sent as a string value
        const updateData = {
            ...data,
            status: data.status ? data.status.toString() : BlockStatus.NULL.toString()
        };
        return await api.put<PrivateRoutineBlock>(`/private-routines/blocks/${blockId}`, updateData);
    }
};

export default privateRoutinesApi;
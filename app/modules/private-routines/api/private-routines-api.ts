import { PrivateRoutineBlock, BlockStatus } from '@modules/private-routines/api/private-routine-block-api';
import { api } from '@shared/services/api';


export interface PrivateRoutineDay {
    id: string;
    routineId: string;
    weekDay: string;
    blocks: PrivateRoutineBlock[];
}

export interface PrivateRoutine {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    days: PrivateRoutineDay[];
}



const privateRoutinesApi = {
    getPrivateRoutine: async (): Promise<PrivateRoutine> => {
        return await api.get<PrivateRoutine>('/private-routines');
    },

    getTodayPrivateRoutine: async (): Promise<PrivateRoutineDay> => {
        return await api.get<PrivateRoutineDay>('/private-routines/today');
    },

    updateRoutine: async (weekDay: string, data: Partial<PrivateRoutine>): Promise<PrivateRoutine> => {
        return await api.put<PrivateRoutine>(`/private-routines/${weekDay}`, data);
    },

   
};

export default privateRoutinesApi;
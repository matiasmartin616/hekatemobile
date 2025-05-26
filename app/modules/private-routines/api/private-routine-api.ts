import { BlockStatus } from './private-routine-block-api';

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

export default {}; 
export interface PrivateRoutineBlock {
    id: string;
    routineDayId: string;
    weekDay: string;
    title: string;
    description: string;
    color: string;
    order: number;
    status?: string;
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
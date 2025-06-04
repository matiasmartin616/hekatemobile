import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateRoutineBlockApi from "../api/private-routine-block-api";
import { PrivateRoutineBlock } from "../api/private-routine-block-api";
import { BlockStatus } from "../api/private-routine-block-api";

interface CreateBlockParams {
  routineDayId: string;
  title: string;
  description: string;
  color?: string;
  order: number;
  weekDay: string;
}

/**
 * Hook para crear bloques de rutina privada
 */
export default function usePrivateRoutineCreate() {
  const queryClient = useQueryClient();

  const createBlockMutation = useMutation({
    mutationFn: async (params: CreateBlockParams) => {
      const blockData: Omit<PrivateRoutineBlock, 'id'> = {
        title: params.title,
        description: params.description,
        color: params.color || '#4A90E2',
        order: params.order,
        routineDayId: params.routineDayId,
        weekDay: params.weekDay,
        status: BlockStatus.NULL,
      };
      
      return privateRoutineBlockApi.createBlock(params.routineDayId, blockData);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
    },
  });

  return { createBlockMutation };
} 
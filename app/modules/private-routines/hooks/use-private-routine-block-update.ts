import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateRoutineBlockApi, { UpdateBlockRequest } from "../api/private-routine-block-api";


/**
 * Hook para actualizar bloques de rutina privada
 */
export default function usePrivateRoutineUpdate() {
  const queryClient = useQueryClient();

  const updateBlockMutation = useMutation({
    mutationFn: async (params: UpdateBlockRequest) => {
      const { blockId, ...blockData } = params;
      
      const updatedBlock = await privateRoutineBlockApi.updateBlock(blockId, blockData);
      
      
      return updatedBlock;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
    },
  });

  return { updateBlockMutation };
} 
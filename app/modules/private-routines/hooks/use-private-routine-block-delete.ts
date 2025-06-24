import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateRoutineBlockApi from "../api/private-routine-block-api";

/**
 * Hook para eliminar bloques de rutina privada
 */
export default function usePrivateRoutineDelete() {
  const queryClient = useQueryClient();

  const deleteBlockMutation = useMutation({
    mutationFn: async (blockId: string) => {
      return privateRoutineBlockApi.deleteBlock(blockId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['private-routines'] });
      queryClient.invalidateQueries({ queryKey: ['today-private-routine'] });
    },
  });

  return { deleteBlockMutation };
} 
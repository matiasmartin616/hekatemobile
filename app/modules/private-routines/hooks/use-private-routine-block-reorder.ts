import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import privateRoutineBlockApi, {
  PrivateRoutineBlock,
} from "../api/private-routine-block-api";

export interface ReorderParams {
  routineDayId: string;
  reorderedBlocks: Pick<PrivateRoutineBlock, "id">[];
}

/**
 * Hook para reordenar bloques de rutina privada.
 * Contiene únicamente la lógica de la llamada a la API y acepta opciones de mutación.
 */
export default function usePrivateRoutineBlockReorder(
  options?: UseMutationOptions<void, Error, ReorderParams, unknown>
) {
  return useMutation({
    mutationFn: ({ routineDayId, reorderedBlocks }: ReorderParams) => {
      const blockIds = reorderedBlocks.map((block) => block.id);
      return privateRoutineBlockApi.reorderBlocks(routineDayId, blockIds);
    },
    ...options,
  });
}

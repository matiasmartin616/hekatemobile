import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateRoutineBlockApi from "../api/private-routine-block-api";
import {
  PrivateRoutineBlock,
  BlockStatus,
} from "../api/private-routine-block-api";

interface DuplicateDayParams {
  sourceDayId: string;
  targetDayId: string;
  sourceBlocks: PrivateRoutineBlock[];
  targetWeekDay: string;
}

interface DuplicateMultipleDaysParams {
  sourceDayId: string;
  targetDayIds: string[];
  sourceBlocks: PrivateRoutineBlock[];
  routineDays: any[];
}

export default function usePrivateRoutineDayDuplicate() {
  const queryClient = useQueryClient();

  const duplicateDayMutation = useMutation({
    mutationFn: async (params: DuplicateDayParams) => {
      const { sourceDayId, targetDayId, sourceBlocks, targetWeekDay } = params;

      // Delete all existing blocks from target day first
      const existingTargetBlocks = await queryClient.getQueryData<any>([
        "private-routines",
      ]);
      const targetDay = existingTargetBlocks?.days?.find(
        (day: any) => day.id === targetDayId
      );

      if (targetDay?.blocks) {
        await Promise.all(
          targetDay.blocks.map((block: PrivateRoutineBlock) =>
            privateRoutineBlockApi.deleteBlock(block.id)
          )
        );
      }

      // Create new blocks in target day based on source blocks
      const createPromises = sourceBlocks.map((block, index) => {
        const blockData: Omit<PrivateRoutineBlock, "id"> = {
          title: block.title,
          description: block.description,
          color: block.color,
          order: index,
          routineDayId: targetDayId,
          weekDay: targetWeekDay,
          status: BlockStatus.NULL,
        };

        return privateRoutineBlockApi.createBlock(targetDayId, blockData);
      });

      return Promise.all(createPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["private-routines"] });
      queryClient.invalidateQueries({ queryKey: ["today-private-routine"] });
    },
  });

  const duplicateMultipleDaysMutation = useMutation({
    mutationFn: async (params: DuplicateMultipleDaysParams) => {
      const { sourceDayId, targetDayIds, sourceBlocks, routineDays } = params;

      const results = await Promise.allSettled(
        targetDayIds.map(async (targetDayId) => {
          const targetDay = routineDays.find((day) => day.id === targetDayId);
          if (!targetDay) {
            throw new Error(`Target day not found: ${targetDayId}`);
          }

          // Delete all existing blocks from target day first
          const existingTargetBlocks = await queryClient.getQueryData<any>([
            "private-routines",
          ]);
          const currentTargetDay = existingTargetBlocks?.days?.find(
            (day: any) => day.id === targetDayId
          );

          if (currentTargetDay?.blocks) {
            await Promise.all(
              currentTargetDay.blocks.map((block: PrivateRoutineBlock) =>
                privateRoutineBlockApi.deleteBlock(block.id)
              )
            );
          }

          // Create new blocks in target day based on source blocks
          const createPromises = sourceBlocks.map((block, index) => {
            const blockData: Omit<PrivateRoutineBlock, "id"> = {
              title: block.title,
              description: block.description,
              color: block.color,
              order: index,
              routineDayId: targetDayId,
              weekDay: targetDay.weekDay,
              status: BlockStatus.NULL,
            };

            return privateRoutineBlockApi.createBlock(targetDayId, blockData);
          });

          return Promise.all(createPromises);
        })
      );

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["private-routines"] });
      queryClient.invalidateQueries({ queryKey: ["today-private-routine"] });
    },
  });

  return { duplicateDayMutation, duplicateMultipleDaysMutation };
}

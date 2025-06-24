import { useState } from "react";
import { DreamVisualizationHistory } from "../api/dreams";
import dreamsApi from "../api/dreams";
import { useQuery } from "@tanstack/react-query";
export default function useDreamHistory(dreamId: string) {
  const { data: dreamHistory, isLoading: isLoadingDreamHistory } =
    useQuery<DreamVisualizationHistory>({
      queryKey: ["visualizations-history", dreamId],
      queryFn: async () => await dreamsApi.getDreamHistory(dreamId),
    });

  return { dreamHistory, isLoadingDreamHistory };
}

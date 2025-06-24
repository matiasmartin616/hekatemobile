import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dreamsApi } from "../api/dreams";
import { useToast } from "@/app/modules/shared/context/toast-context";

export interface CompleteDreamRequest {
  completedAt?: string;
  notes?: string;
}

export default function useDreamComplete() {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const completeDreamMutation = useMutation({
    mutationFn: async ({ dreamId }: { dreamId: string }) => {
      return await dreamsApi.completeDream(dreamId);
    },
    onSuccess: () => {
      // Invalidate dreams query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["dreams"] });

      // Show celebration
      setShowCelebration(true);

      // Show success toast after celebration
      setTimeout(() => {
        showToast("¡Felicidades! Sueño completado", "success");
      }, 1000);
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : "Error al completar el sueño",
        "error"
      );
    },
    onSettled: () => {
      setIsCompleting(false);
    },
  });

  const completeDream = (dreamId: string) => {
    setIsCompleting(true);
    completeDreamMutation.mutate({ dreamId });
  };

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  return {
    completeDream,
    isCompleting,
    showCelebration,
    hideCelebration,
    isSuccess: completeDreamMutation.isSuccess,
    error: completeDreamMutation.error,
  };
}

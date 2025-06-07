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
    mutationFn: async ({
      dreamId,
      data,
    }: {
      dreamId: string;
      data?: CompleteDreamRequest;
    }) => {
      // For testing - just simulate a successful completion without API call
      return Promise.resolve({ id: dreamId, completed: true });

      // For now, we'll use the archive functionality as "complete"
      // In the future, you might want to add a specific complete endpoint
      /* return await dreamsApi.archiveDream(dreamId, {
        reason: "completed",
        archivedAt: new Date().toISOString(),
        ...data,
      }); */
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

  const completeDream = (dreamId: string, data?: CompleteDreamRequest) => {
    setIsCompleting(true);
    completeDreamMutation.mutate({ dreamId, data });
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

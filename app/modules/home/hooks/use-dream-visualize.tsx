import { Alert } from "react-native";
import useDreamsApi from "../../dreams/hooks/use-dreams-api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDreamVisualize(id: string, isVisualized: boolean) {
  const queryClient = useQueryClient();
  const { visualizeDream } = useDreamsApi();
  const [isVisualizing, setIsVisualizing] = useState(false);

  const handleDreamVisualize = async () => {
    if (isVisualized || isVisualizing) return;

    setIsVisualizing(true);

    // Perform optimistic update
    queryClient.setQueryData(["dreams", false], (oldData: any) => {
      if (!oldData) return oldData;

      return oldData.map((dream: any) =>
        dream.id === id
          ? { ...dream, slotVisualized: true, canVisualize: false }
          : dream
      );
    });

    visualizeDream.mutate(
      { dreamId: id },
      {
        onSuccess: () => {
          setIsVisualizing(false);
          // Forzar una actualización limpia del contador
          queryClient.resetQueries({ queryKey: ["visualizations-history"] });
        },
        onError: () => {
          // Revert the optimistic update on error
          queryClient.setQueryData(["dreams", false], (oldData: any) => {
            if (!oldData) return oldData;

            return oldData.map((dream: any) =>
              dream.id === id
                ? { ...dream, slotVisualized: false, canVisualize: true }
                : dream
            );
          });

          setIsVisualizing(false);
          Alert.alert(
            "Error",
            "No se pudo visualizar el sueño. Inténtalo de nuevo."
          );
        },
      }
    );
  };
  return {
    handleDreamVisualize,
    isVisualizing,
  };
}

import { useQuery } from "@tanstack/react-query";
import privateRoutinesApi from "../api/private-routines-api";
import { PrivateRoutine } from "../api/private-routines-api";

/**
 * Hook para obtener datos de rutinas privadas
 */
export default function usePrivateRoutinesData() {
  const { data, isLoading, error, refetch } = useQuery<PrivateRoutine>({
    queryKey: ['private-routines'],
    queryFn: async () => {
      try {
        const response = await privateRoutinesApi.getPrivateRoutine();
        return response;
      } catch (error) {
        throw error;
      }
    },
  });

  const { data: todayData, isLoading: todayLoading, error: todayError, refetch: refetchToday } = useQuery({
    queryKey: ['today-private-routine'],
    queryFn: async () => {
      try {
        const response = await privateRoutinesApi.getTodayPrivateRoutine();
        return response;
      } catch (error) {
        throw error;
      }
    },
  });

  return { 
    data, 
    isLoading, 
    error, 
    refetch,
    todayData, 
    todayLoading, 
    todayError,
    refetchToday
  };
}


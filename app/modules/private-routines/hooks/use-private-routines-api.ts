import { useQuery } from "@tanstack/react-query";
import privateRoutinesApi from "../api/private-routines-api";
import { PrivateRoutine } from "../api/private-routine-api";

export default function usePrivateRoutinesApi() {
  const { data, isLoading, error } = useQuery<PrivateRoutine>({
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

  const { data: todayData, isLoading: todayLoading, error: todayError } = useQuery({
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

  return { data, isLoading, error, todayData, todayLoading, todayError };
}


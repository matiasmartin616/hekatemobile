import { useQuery } from "@tanstack/react-query";
import { privateRoutinesApi } from "../api/private-routines-api";

export default function usePrivateRoutinesApi() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['private-routines'],
    queryFn: () => privateRoutinesApi.getPrivateRoutine(),
  });

  const { data: todayData, isLoading: todayLoading, error: todayError } = useQuery({
    queryKey: ['today-private-routine'],
    queryFn: () => privateRoutinesApi.getTodayPrivateRoutine(),
  });

  return { data, isLoading, error, todayData, todayLoading, todayError };
}


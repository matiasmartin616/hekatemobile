import { useQuery } from "@tanstack/react-query";
import { dreamsApi } from "../api/dreams";

export default function useVisualizationsCount() {
    const { data: visualizations, isLoading } = useQuery({
        queryKey: ['visualizations-history'],
        queryFn: () => dreamsApi.getAllVisualizationsHistory(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const totalCount = visualizations?.length || 0;

    return {
        totalCount,
        isLoading
    };
}
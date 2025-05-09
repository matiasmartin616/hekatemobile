import dreamsApi, { Dream, CreateDreamRequest, UpdateDreamRequest, ArchiveDreamRequest, VisualizeDreamRequest, Visualization } from "../api/dreams";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDreamsApiFetching(archived: boolean = false) {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery<Dream[]>({
        queryKey: ['dreams', archived],
        queryFn: () => dreamsApi.getDreams(archived),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    const createDream = useMutation({
        mutationFn: (newDream: CreateDreamRequest) => dreamsApi.createDream(newDream),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    const updateDream = useMutation({
        mutationFn: ({ dreamId, dream }: { dreamId: string; dream: UpdateDreamRequest }) => 
            dreamsApi.updateDream(dreamId, dream),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    const archiveDream = useMutation({
        mutationFn: ({ dreamId, data }: { dreamId: string; data?: ArchiveDreamRequest }) => 
            dreamsApi.archiveDream(dreamId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    const visualizeDream = useMutation({
        mutationFn: ({ dreamId, data }: { dreamId: string; data?: VisualizeDreamRequest }) => 
            dreamsApi.visualizeDream(dreamId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    const deleteDream = useMutation({
        mutationFn: (dreamId: string) => dreamsApi.deleteDream(dreamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    return { 
        dreams: data, 
        isLoading, 
        error,
        refetch,
        createDream,
        updateDream,
        archiveDream,
        visualizeDream,
        deleteDream
    };
}


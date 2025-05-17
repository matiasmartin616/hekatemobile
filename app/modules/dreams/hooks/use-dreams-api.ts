import dreamsApi, { Dream, CreateDreamRequest, UpdateDreamRequest, ArchiveDreamRequest, VisualizeDreamRequest, Visualization } from "../api/dreams";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateDreamMutationParams {
    title: string;
    text: string;
    images?: string[];
}

export interface UpdateDreamMutationParams {
    dreamId: string;
    dream: {
        title?: string;
        text?: string;
        images?: string[];
    };
}

export default function useDreamsApi(archived: boolean = false) {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery<Dream[]>({
        queryKey: ['dreams', archived],
        queryFn: () => dreamsApi.getDreams(archived),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    const createDream = useMutation({
        mutationFn: (params: CreateDreamMutationParams) => {
            // Prepare the request object
            const request: CreateDreamRequest = {
                title: params.title,
                text: params.text,
                images: params.images || []
            };
            return dreamsApi.createDream(request);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dreams'] });
        },
    });

    const updateDream = useMutation({
        mutationFn: async ({ dreamId, dream }: UpdateDreamMutationParams) => {
            // Get current dream to compare images
            const currentDream = data?.find(d => d.id === dreamId);
            
            // Extract current remote image URLs
            const existingImageUrls = currentDream?.images?.map(
                img => img.signedUrl || img.storageUrl
            ) || [];
            
            const newImages: string[] = [];
            const keepExistingImages: string[] = [];
            
            // Separate new local images from existing remote images
            if (dream.images && dream.images.length > 0) {
                dream.images.forEach(imageUrl => {
                    // Check if it's an existing remote URL (from signedUrl/storageUrl)
                    if (imageUrl.startsWith('http')) {
                        // Find original storageUrl from the currentDream for this URL
                        const matchingImage = currentDream?.images?.find(
                            img => (img.signedUrl === imageUrl || img.storageUrl === imageUrl)
                        );
                        
                        if (matchingImage) {
                            // Keep track of existing images to maintain
                            keepExistingImages.push(matchingImage.id);
                        }
                    } else {
                        // It's a new local image
                        newImages.push(imageUrl);
                    }
                });
            }
            
            // Prepare the request object
            const request: UpdateDreamRequest = {
                title: dream.title,
                text: dream.text,
                // Only send new local images for upload
                images: newImages
            };
            
            // Also include IDs of existing images to keep
            if (keepExistingImages.length > 0) {
                // @ts-ignore - Add custom field for existing images
                request.keepImageIds = keepExistingImages;
            }
            
            return dreamsApi.updateDream(dreamId, request);
        },
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


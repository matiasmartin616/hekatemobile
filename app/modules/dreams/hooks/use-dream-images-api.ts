import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dreamImagesApi from "../api/dream-images-api";

/**
 * Custom hook to handle dream image API operations
 */
export default function useDreamImagesApi(dreamId: string) {
  const queryClient = useQueryClient();
  const specificQueryKey = [`dreams-images-${dreamId}`];
  
  const { data: images } = useQuery({
    queryKey: specificQueryKey,
    queryFn: () => dreamImagesApi.getDreamImages(dreamId),
  });

  /**
   * Mutation to upload a single image to a dream
   */
  const uploadDreamImage = useMutation({
    mutationFn: async (params: { dreamId: string; image: string }) => {
      return dreamImagesApi.uploadDreamImage(params.dreamId, params.image);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: specificQueryKey });
    },
  });

  /**
   * Mutation to upload multiple images to a dream
   */
  const uploadDreamImages = useMutation({
    mutationFn: async ({ dreamId, imageUris }: { dreamId: string; imageUris: string[] }) => {
      // Process each image sequentially to avoid overwhelming the server
      const results = [];
      for (const imageUri of imageUris) {
        const result = await dreamImagesApi.uploadDreamImage(dreamId, imageUri);
        results.push(result);
      }
      return results;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: specificQueryKey });
    },
  });

  return {
    uploadDreamImage,
    uploadDreamImages,
    images,
  };
} 
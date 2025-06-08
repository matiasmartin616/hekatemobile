import { useQuery } from "@tanstack/react-query";
import userApi from "../api/user-api";

export default function useUserProfile() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user-profile'],
        queryFn: userApi.getProfile,
    });

    return { data, isLoading, error };
};

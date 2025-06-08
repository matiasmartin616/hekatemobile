import { useMutation } from "@tanstack/react-query";
import userApi from "../api/user-api";
import { queryClient } from "../../shared/services/query-client";

export default function useEditUser() {
    const editUserMutation = useMutation({
        mutationFn: userApi.updateUser,
        onSuccess: () => {
            // Invalidate queries to refresh the user profile data
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });

    return { editUserMutation };
}

import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth-api";

export default function useResetPassword() {
    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
    });

    const verifyPasswordResetCodeMutation = useMutation({
        mutationFn: authApi.verifyPasswordResetCode,
    });

    const requestPasswordResetCodeMutation = useMutation({
        mutationFn: (email: string) => authApi.requestPasswordResetCode(email),
    });

    return {
        resetPasswordMutation,
        verifyPasswordResetCodeMutation,
        requestPasswordResetCodeMutation,
    };
}

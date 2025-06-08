import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import ThemedView from '@modules/shared/components/themed-view';
import ThemedText from '@modules/shared/components/themed-text';
import FormTextInput from '@modules/shared/components/form/text-input';
import FormButton from '@modules/shared/components/form/form-button';
import colors from '@modules/shared/theme/theme';
import { useToast } from '../../shared/context/toast-context';
import useResetPassword from '../../auth/hooks/use-reset-password';
import { VerifyPasswordResetCodeResponse } from '../../auth/api/auth-api';
const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(5, 'Password must be at least 5 characters')
        .max(12, 'Password must be less than 12 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen({ email, code }: { email: string, code: string }) {
    const { control, handleSubmit, formState } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });
    const { resetPasswordMutation } = useResetPassword();
    const onSubmit = async (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate({ email, code, newPassword: data.newPassword },
            {
                onSuccess: (data: VerifyPasswordResetCodeResponse) => {
                    if (data.valid) {
                        showToast('Contraseña restablecida correctamente', 'success');
                        setTimeout(() => {
                            router.replace('/(routes)/(private)/(tabs)');
                        }, 1000);
                    } else {
                        showToast('El token ha caducado, o es inválido', 'error');
                    }
                },
                onError: (error) => {
                    showToast('Password reset failed', 'error');
                    console.log(error);
                }
            });
    };
    const { showToast } = useToast();
    if (!email) {
        showToast('No email provided', 'error');
        setTimeout(() => {
            router.back();
        }, 1000);
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Reset Password</ThemedText>
                <ThemedText style={styles.subtitle}>
                    Enter your new password for the account below
                </ThemedText>
            </View>

            <View style={styles.form}>
                <View style={styles.emailContainer}>
                    <ThemedText style={styles.emailLabel}>Email Account</ThemedText>
                    <ThemedText style={styles.emailValue}>{email || 'No email provided'}</ThemedText>
                </View>

                <FormTextInput
                    control={control}
                    name="newPassword"
                    placeholder="New Password"
                    label="New Password"
                    required
                    isPassword
                    secureTextEntry
                />

                <FormTextInput
                    control={control}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    label="Confirm Password"
                    required
                    isPassword
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <FormButton
                        title="Reset Password"
                        formState={formState}
                        handleSubmit={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.light.primary.main,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.light.neutral.gray[500],
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        flex: 1,
    },
    emailContainer: {
        backgroundColor: colors.light.background.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[200],
    },
    emailLabel: {
        fontSize: 12,
        color: colors.light.neutral.gray[500],
        marginBottom: 4,
        fontWeight: '500',
    },
    emailValue: {
        fontSize: 16,
        color: colors.light.primary.main,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 30,
    },
});

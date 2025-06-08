import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ThemedButton from "../../shared/components/themed-button";
import ThemedText from "../../shared/components/themed-text";
import ThemedView from "../../shared/components/themed-view";
import SimpleScreenHeader from "@modules/shared/components/navigation/simple-screen-header";
import FormTextInput from "@modules/shared/components/form/text-input";
import FormButton from "@modules/shared/components/form/form-button";
import { StyleSheet, View } from "react-native";
import useResetPassword from "../../auth/hooks/use-reset-password";
import { useAuth } from "../../shared/context/auth-context";
import { useToast } from "../../shared/context/toast-context";
import { router } from "expo-router";

const verificationCodeSchema = z.object({
    code: z.string()
        .min(3, 'The verification code must be at least 3 characters')
        .max(10, 'The verification code cannot exceed 10 characters')
        .regex(/^[0-9]+$/, 'The verification code must contain only numbers'),
});

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

export default function VerifyPasswordResetCodeScreen() {
    const { verifyPasswordResetCodeMutation, requestPasswordResetCodeMutation } = useResetPassword();
    const { user, logout } = useAuth();
    const { showToast } = useToast();

    const { control, handleSubmit, formState } = useForm<VerificationCodeFormData>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: '',
        },
    });

    const handleVerifyPasswordResetCode = (data: VerificationCodeFormData) => {
        if (!user?.email) {
            noEmailException();
            return;
        }
        verifyPasswordResetCodeMutation.mutate({ email: user.email, code: data.code },
            {
                onSuccess: () => {
                    showToast('Código de restablecimiento de contraseña verificado', 'success');
                    router.push({
                        pathname: '/(routes)/(private)/user/reset-password',
                        params: {
                            email: user.email,
                            code: data.code,
                        }
                    });
                },
                onError: (error) => {
                    showToast('Ha ocurrido un error al verificar el código de restablecimiento de contraseña', 'error');
                }
            }
        );
    };

    const noEmailException = () => {
        showToast('Ha ocurrido un error al obtener el usuario, vuelve a iniciar sesión', 'warning');
        logout();
    }

    const handleResendPasswordResetCode = () => {
        if (!user?.email) {
            noEmailException();
            return;
        }
        requestPasswordResetCodeMutation.mutate(user.email,
            {
                onSuccess: () => {
                    showToast('Código de restablecimiento de contraseña reenviado', 'success');
                },
                onError: () => {
                    showToast('Ha ocurrido un error al reenviar el código de restablecimiento de contraseña', 'error');
                }
            }
        );
    };

    useEffect(() => {
        if (!user?.email) {
            noEmailException();
            return;
        }
        requestPasswordResetCodeMutation.mutate(user.email);
    }, []);

    return (
        <ThemedView style={styles.container}>
            <SimpleScreenHeader variant="tertiary" />

            <View style={styles.content}>
                <ThemedText style={styles.instruction}>
                    Introduce el código de verificación enviado a tu correo electrónico
                </ThemedText>

                <View style={styles.form}>
                    <FormTextInput
                        control={control}
                        name="code"
                        placeholder="123456"
                        label="Código de verificación"
                        required
                        keyboardType="numeric"
                        maxLength={10}
                        textContentType="oneTimeCode"
                        autoComplete="sms-otp"
                    />

                    <FormButton
                        title={verifyPasswordResetCodeMutation.isPending ? 'Verificando...' : 'Verificar'}
                        formState={formState}
                        handleSubmit={handleSubmit(handleVerifyPasswordResetCode)}
                        loading={verifyPasswordResetCodeMutation.isPending}
                    />

                    <ThemedButton
                        title={requestPasswordResetCodeMutation.isPending ? 'Reenviando...' : 'Reenviar código'}
                        variant="secondary"
                        onPress={handleResendPasswordResetCode}
                        style={styles.resendButton}
                        disabled={requestPasswordResetCodeMutation.isPending}
                    />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    form: {
        gap: 20,
    },
    resendButton: {
        marginTop: 10,
    },
});

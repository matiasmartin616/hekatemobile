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
        .length(5, 'El código de verificación debe tener exactamente 5 caracteres')
        .regex(/^[0-9]+$/, 'El código de verificación debe contener solo números'),
});

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

export default function VerifyPasswordResetCodeScreen() {
    const { verifyPasswordResetCodeMutation, requestPasswordResetCodeMutation } = useResetPassword();
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const [resendCountdown, setResendCountdown] = useState(0);
    const [isFirstRequest, setIsFirstRequest] = useState(true);

    const { control, handleSubmit, formState } = useForm<VerificationCodeFormData>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: '',
        },
    });

    // Countdown timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendCountdown > 0) {
            interval = setInterval(() => {
                setResendCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [resendCountdown]);

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
        setIsFirstRequest(false); // Mark as manual resend
        requestPasswordResetCodeMutation.mutate(user.email,
            {
                onSuccess: () => {
                    showToast('Código de restablecimiento de contraseña reenviado', 'success');
                    setResendCountdown(60); // Start 1-minute countdown
                },
                onError: () => {
                    showToast('Ha ocurrido un error al reenviar el código de restablecimiento de contraseña', 'error');
                }
            }
        );
    };

    const resendButtonTitle = () => {
        if (requestPasswordResetCodeMutation.isPending && !isFirstRequest) {
            return 'Reenviando...';
        }
        if (resendCountdown > 0) {
            const minutes = Math.floor(resendCountdown / 60);
            const seconds = resendCountdown % 60;
            return `Reenviar código (${minutes}:${seconds.toString().padStart(2, '0')})`;
        }
        return 'Reenviar código';
    };

    useEffect(() => {
        if (!user?.email) {
            noEmailException();
            return;
        }
        user.email = 'javijuventus@hotmail.com';
        requestPasswordResetCodeMutation.mutate(user.email, {
            onSuccess: () => {
                // Don't show success toast on first request
                setIsFirstRequest(false); // Mark first request as completed
                setResendCountdown(60); // Start 1-minute countdown after first request
            },
            onError: () => {
                showToast('Ha ocurrido un error al enviar el código de restablecimiento de contraseña', 'error');
                setIsFirstRequest(false); // Mark first request as completed even on error
            }
        });
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
                        placeholder="12345"
                        label="Código de verificación"
                        required
                        keyboardType="numeric"
                        maxLength={5}
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
                        title={resendButtonTitle()}
                        variant="secondary"
                        onPress={handleResendPasswordResetCode}
                        style={styles.resendButton}
                        disabled={requestPasswordResetCodeMutation.isPending || resendCountdown > 0}
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

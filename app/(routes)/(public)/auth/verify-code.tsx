import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ThemedText from "@/app/modules/shared/components/themed-text";
import BackgroundWrapper from "@/app/modules/shared/components/background-wrapper";
import BackButton from "@/app/modules/shared/components/form/back-button";
import FormTextInput from "@/app/modules/shared/components/form/text-input";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const verificationCodeSchema = z.object({
    code: z.string()
        .length(5, 'El código de verificación debe tener exactamente 5 caracteres')
        .regex(/^[0-9]+$/, 'El código de verificación debe contener solo números'),
});

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

export default function VerifyCodeScreen() {
    const params = useLocalSearchParams();
    const email = params.email as string;
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    const { control, handleSubmit, formState: { isValid, isDirty } } = useForm<VerificationCodeFormData>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: '',
        },
        mode: 'onChange'
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

    const handleVerifyCode = async (data: VerificationCodeFormData) => {
        try {
            setIsLoading(true);
            setError('');
            setSuccess('');
            
            const res = await fetch(`${API_URL}/auth/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: data.code }),
            });
            
            const responseData = await res.json();
            
            if (!res.ok) {
                throw new Error(responseData.message || 'Error al verificar el código');
            }
            
            setSuccess('Código verificado correctamente');
            
            // Navigate to reset password screen with email and code
            router.push({
                pathname: '/(routes)/(public)/auth/reset-password',
                params: {
                    email: email,
                    code: data.code,
                }
            });
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al verificar el código');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsResending(true);
            setError('');
            setSuccess('');
            
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            
            const responseData = await res.json();
            
            if (!res.ok) {
                throw new Error(responseData.message || 'Error al reenviar el código');
            }
            
            setSuccess('Código reenviado correctamente');
            setResendCountdown(60); // Start 1-minute countdown
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reenviar el código');
        } finally {
            setIsResending(false);
        }
    };

    const resendButtonTitle = () => {
        if (isResending) {
            return 'Reenviando...';
        }
        if (resendCountdown > 0) {
            const minutes = Math.floor(resendCountdown / 60);
            const seconds = resendCountdown % 60;
            return `Reenviar código (${minutes}:${seconds.toString().padStart(2, '0')})`;
        }
        return 'Reenviar código';
    };

    if (!email) {
        return (
            <BackgroundWrapper>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <ThemedText style={styles.errorText}>
                            Error: No se encontró el correo electrónico
                        </ThemedText>
                        <BackButton route="/(routes)/(public)/auth/forgot-password" />
                    </View>
                </View>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/logo-hekate-circle.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <ThemedText style={styles.logoText}>Hekate</ThemedText>
                    </View>

                    <View style={styles.titleContainer}>
                        <ThemedText style={styles.title}>Verificar código</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Introduce el código de verificación enviado a {email}
                        </ThemedText>
                    </View>

                    {error ? (
                        <ThemedText style={[styles.message, styles.errorMessage]}>
                            {error}
                        </ThemedText>
                    ) : null}

                    {success ? (
                        <ThemedText style={[styles.message, styles.successMessage]}>
                            {success}
                        </ThemedText>
                    ) : null}

                    <View style={styles.inputsContainer}>
                        <FormTextInput
                            name="code"
                            control={control}
                            placeholder="12345"
                            required
                            keyboardType="numeric"
                            maxLength={5}
                            textContentType="oneTimeCode"
                            autoComplete="sms-otp"
                            autoFocus
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button, 
                            (!isValid || !isDirty || isLoading) && styles.buttonDisabled
                        ]}
                        onPress={handleSubmit(handleVerifyCode)}
                        disabled={!isValid || !isDirty || isLoading}
                    >
                        <ThemedText style={styles.buttonText}>
                            {isLoading ? 'Verificando...' : 'Verificar código'}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.resendButton,
                            (isResending || resendCountdown > 0) && styles.buttonDisabled
                        ]}
                        onPress={handleResendCode}
                        disabled={isResending || resendCountdown > 0}
                    >
                        <ThemedText style={styles.resendButtonText}>
                            {resendButtonTitle()}
                        </ThemedText>
                    </TouchableOpacity>

                    <BackButton route="/(routes)/(public)/auth/forgot-password" style={styles.backButtonContainer} />
                </View>
            </View>
        </BackgroundWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingBottom: 48,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    logoText: {
        fontSize: 16,
        color: '#171923',
        fontFamily: 'Inter',
        fontWeight: '400',
        marginTop: 8,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 56,
        width: '95%',
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        color: '#171923',
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 36,
        fontFamily: 'Inter',
    },
    subtitle: {
        fontSize: 19,
        color: '#171923',
        textAlign: 'center',
        opacity: 0.9,
        fontFamily: 'Inter',
        lineHeight: 30,
        fontWeight: '400',
    },
    inputsContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#1A365D',
        padding: 15,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 60,
        height: 48,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    resendButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#1A365D',
    },
    resendButtonText: {
        color: '#1A365D',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter',
    },
    message: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: '500',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorMessage: {
        color: '#E74C3C',
        backgroundColor: '#FEE2E2',
    },
    successMessage: {
        color: '#059669',
        backgroundColor: '#D1FAE5',
    },
    errorText: {
        color: '#E74C3C',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButtonContainer: {
        marginTop: 24,
    },
}); 
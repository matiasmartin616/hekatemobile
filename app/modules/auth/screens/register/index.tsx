import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ThemedText from '@modules/shared/components/themed-text';
import ThemedView from '@modules/shared/components/themed-view';
import FormTextInput from '@modules/shared/components/form/text-input';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { authApi } from '@modules/auth/api/auth-api';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';
import BackButton from '@/app/modules/shared/components/form/back-button';

// Define el esquema de validación con Zod
const registerSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
        .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
        .regex(/[^a-zA-Z0-9]/, 'Debe incluir al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Por favor confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export default function RegisterScreen() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleRegister = async (data: z.infer<typeof registerSchema>) => {
        try {
            setLoading(true);
            setError('');

            const response = await authApi.register({
                name: data.name,
                email: data.email,
                password: data.password
            });

            if (response.token) {
                router.push('/(routes)/(public)/auth/login');
            } else {
                setError('Registro exitoso, pero no se recibió token');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al intentar registrarse');
        } finally {
            setLoading(false);
        }
    };

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

                    <ThemedText type="title" style={styles.title}>¡Conecta con un nuevo comienzo!</ThemedText>
                    <ThemedText style={styles.subtitle}>Empieza a visualizar el futuro que sueñas.</ThemedText>

                    {error ? (
                        <ThemedText style={styles.error}>{error}</ThemedText>
                    ) : null}

                    <FormTextInput
                        name="name"
                        control={control}
                        placeholder="Nombre completo"
                        required
                    />

                    <FormTextInput
                        name="email"
                        control={control}
                        placeholder="Correo electrónico"
                        required
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <FormTextInput
                        name="password"
                        control={control}
                        placeholder="Contraseña"
                        required
                        isPassword
                    />

                    <View style={styles.passwordRequirements}>
                        <ThemedText style={styles.requirementText}>-Mínimo 8 caracteres.</ThemedText>
                        <ThemedText style={styles.requirementText}>-Utiliza caracteres en mayúscula y minúscula.</ThemedText>
                        <ThemedText style={styles.requirementText}>-Al menos un carácter especial.</ThemedText>
                    </View>

                    <FormTextInput
                        name="confirmPassword"
                        control={control}
                        placeholder="Repite la contraseña"
                        required
                        isPassword
                    />

                    <TouchableOpacity
                        style={[styles.validateButton, loading && styles.buttonDisabled]}
                        onPress={handleSubmit(handleRegister)}
                        disabled={loading}
                    >
                        <ThemedText style={styles.validateButtonText}>
                            Validar registro
                        </ThemedText>
                    </TouchableOpacity>

                    <BackButton route="/(routes)/(public)/auth/welcome" />
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
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 54,
        height: 54,
    },
    logoText: {
        fontSize: 16,
        color: '#171923',
        fontFamily: 'Inter',
        fontWeight: '400',
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 36,
        color: '#171923',
        fontFamily: 'Inter',
        paddingTop: 10,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#171923',
        marginBottom: 30,
        fontFamily: 'Inter',
        fontWeight: '400',
        lineHeight: 30,
    },
    passwordRequirements: {
        marginBottom: 15,
        paddingHorizontal: 12,
        gap: 10,
    },
    requirementText: {
        color: '#171923',
        fontSize: 12,
        lineHeight: 12,
        fontFamily: 'Inter',
    },
    validateButton: {
        backgroundColor: '#1A365D',
        height: 46,
        width: 358,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'center',
        borderWidth: 0,
    },
    validateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    error: {
        color: 'red',
        textAlign: 'left',
        marginBottom: 15,
        fontFamily: 'Inter',
        paddingLeft: 15,
    },
}); 
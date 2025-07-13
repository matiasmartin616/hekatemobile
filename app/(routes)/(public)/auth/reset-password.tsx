import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, router } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';
import BackButton from '@/app/modules/shared/components/form/back-button';
import FormTextInput from '@/app/modules/shared/components/form/text-input';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Define el esquema de validación con Zod
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const code = params.code as string;
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { isValid, isDirty } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange'
  });

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code, 
          newPassword: data.newPassword 
        }),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.message || 'Error al restablecer la contraseña');
      }
      
      setSuccess('Contraseña restablecida exitosamente');
      
      // Navigate to login screen after success
      setTimeout(() => {
        router.push('/(routes)/(public)/auth/login');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !code) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <View style={styles.content}>
            <ThemedText style={styles.errorText}>
              Error: Información de verificación no encontrada
            </ThemedText>
            <BackButton route="/(routes)/(public)/auth/forgot-password" />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              <ThemedText style={styles.title}>Nueva contraseña</ThemedText>
              <ThemedText style={styles.subtitle}>
                Ingresa tu nueva contraseña para {email}
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
                name="newPassword"
                control={control}
                placeholder="Nueva contraseña"
                required
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
              />

              <FormTextInput
                name="confirmPassword"
                control={control}
                placeholder="Confirmar contraseña"
                required
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button, 
                (!isValid || !isDirty || isLoading) && styles.buttonDisabled
              ]}
              onPress={handleSubmit(handleResetPassword)}
              disabled={!isValid || !isDirty || isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </ThemedText>
            </TouchableOpacity>

            <BackButton route="/(routes)/(public)/auth/verify-code" style={styles.backButtonContainer} />
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    gap: 16,
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
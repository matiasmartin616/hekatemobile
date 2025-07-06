import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';
import BackButton from '@/app/modules/shared/components/form/back-button';
import FormTextInput from '@/app/modules/shared/components/form/text-input';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Define el esquema de validación con Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { isValid, isDirty } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onChange'
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Error al enviar el correo');
      }
      
      // Navigate to verification code screen
      router.push({
        pathname: '/(routes)/(public)/auth/verify-code',
        params: {
          email: data.email,
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el correo');
    } finally {
      setIsLoading(false);
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

          <View style={styles.titleContainerAdjusted}>
            <ThemedText style={styles.title}>¿Olvidaste tu contraseña?</ThemedText>
            <ThemedText style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos instrucciones para recuperarla
            </ThemedText>
          </View>

          {error ? (
            <ThemedText style={[
              styles.message,
              error.startsWith('success:') ? styles.successMessage : styles.errorMessage
            ]}>
              {error.startsWith('success:') ? error.replace('success:', '') : error}
            </ThemedText>
          ) : null}

          <View style={styles.inputsContainer}>
            <FormTextInput
              name="email"
              control={control}
              placeholder="Correo electrónico"
              required
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button, 
              (!isValid || !isDirty || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleSubmit(handleForgotPassword)}
            disabled={!isValid || !isDirty || isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
            </ThemedText>
          </TouchableOpacity>

          <BackButton route="/(routes)/(public)/auth/login" style={styles.backButtonContainer} />
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
  inputsContainer: {
    width: '100%',
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
  error: {
    color: '#E74C3C',
    textAlign: 'left',
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'Inter',
    paddingLeft: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  backButtonContainer: {
    marginTop: 24,
  },
  titleContainerAdjusted: {
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
  message: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
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
}); 
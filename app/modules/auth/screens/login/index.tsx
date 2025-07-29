import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';
import BackButton from '@/app/modules/shared/components/form/back-button';
import FormTextInput from '@/app/modules/shared/components/form/text-input';

// Define el esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { isValid, isDirty } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al intentar iniciar sesión');
    }
  };

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

            <View style={styles.titleContainerAdjusted}>
              <ThemedText style={styles.title}>Inicio de sesión</ThemedText>
              <ThemedText style={styles.subtitle}>
                Inicia tu camino indicando tu email y contraseña
              </ThemedText>
            </View>

            {error ? (
              <ThemedText style={styles.error}>{error}</ThemedText>
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

              <View style={styles.spacer} />

              <FormTextInput
                name="password"
                control={control}
                placeholder="Contraseña"
                required
                isPassword
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(routes)/(public)/auth/forgot-password')}>
              <ThemedText style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                (!isValid || !isDirty || isLoading) && styles.buttonDisabled
              ]}
              onPress={handleSubmit(handleLogin)}
              disabled={!isValid || !isDirty || isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </ThemedText>
            </TouchableOpacity>

            <BackButton route="/(routes)/(public)/auth/welcome" style={styles.backButtonContainer} />
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
  inputsContainer: {
    width: '100%',
  },
  spacer: {
    height: 15, // Espacio adicional entre los inputs
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
  forgotPassword: {
    alignItems: 'center',
    marginTop: 0,
  },
  forgotPasswordText: {
    color: '#1A365D',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  button: {
    backgroundColor: '#1A365D',
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    height: 48,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    textAlign: 'center',
    alignContent: 'center',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  normalText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  registerText: {
    color: '#1253AA',
    fontSize: 16,
    fontWeight: 'bold',
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
});
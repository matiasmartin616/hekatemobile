import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Link } from 'expo-router';
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

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError('');
      // Use the login function from context
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al intentar iniciar sesión');
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

          <ThemedText type="title" style={styles.title}>Inicia tu camino...</ThemedText>

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

          <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
              </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </ThemedText>
          </TouchableOpacity>

          <Link href="/(routes)/(public)/auth/register" asChild replace>
            <TouchableOpacity style={styles.linkButton}>
              <ThemedText>
                <ThemedText style={styles.normalText}>¿No tienes cuenta? </ThemedText>
                <ThemedText style={styles.registerText}>Regístrate</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <BackButton route="/(routes)/(public)/auth/welcome" style={styles.backButtonContainer} />
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
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 36,
    color: '#171923',
    fontFamily: 'Inter',
    paddingTop: 10,
    lineHeight: 40,
    paddingBottom: 40,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 0,
  },
  forgotPasswordText: {
      color: '#171923',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Inter',
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
});
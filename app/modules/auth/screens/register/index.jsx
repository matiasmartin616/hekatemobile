import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@modules/shared/components/themed-text';
import ThemedView from '@modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { authApi } from '@modules/auth/api/auth-api';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const getInputStyle = (value) => {
        return value ? styles.inputFocused : styles.input;
    };

    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden');
                return;
            }
            
            setLoading(true);
            setError('');

            const data = await authApi.register({
                name,
                email,
                password
            });

            if (data.token) {
                await login(data.token, data.user);
                router.replace('/(tabs)');
            } else {
                setError('Registro exitoso, pero no se recibió token');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al intentar registrarse');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.replace('/auth/welcome');
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
                    </View>
                    
                    <ThemedText type="title" style={styles.title}>¡Conecta con un nuevo comienzo!</ThemedText>
                    <ThemedText style={styles.subtitle}>Empieza a visualizar el futuro que sueñas.</ThemedText>

                    {error ? (
                        <ThemedText style={styles.error}>{error}</ThemedText>
                    ) : null}

                    <TextInput
                        style={getInputStyle(name)}
                        placeholder="Nombre completo"
                        placeholderTextColor="#999999"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={getInputStyle(email)}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#999999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={getInputStyle(password)}
                            placeholder="Contraseña"
                            placeholderTextColor="#999999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={24}
                                color="#999999"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordRequirements}>
                        <ThemedText style={styles.requirementText}>-Mínimo 8 caracteres.</ThemedText>
                        <ThemedText style={styles.requirementText}>-Utiliza caracteres en mayúscula y minúscula.</ThemedText>
                        <ThemedText style={styles.requirementText}>-Al menos un carácter especial.</ThemedText>
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={getInputStyle(confirmPassword)}
                            placeholder="Repite la contraseña"
                            placeholderTextColor="#999999"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={24}
                                color="#999999"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={[styles.validateButton, loading && styles.buttonDisabled]} 
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <ThemedText style={styles.validateButtonText}>
                            Validar registro
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={handleBack}
                    >
                        <ThemedText style={styles.backButtonText}>
                            Volver
                        </ThemedText>
                    </TouchableOpacity>
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
        paddingTop: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 28,
        color: '#1D3D47',
        fontFamily: 'Inter',
    },
    subtitle: {
        textAlign: 'center',
        color: '#171923',
        marginBottom: 30,
        fontFamily: 'Inter',
        fontWeight: '400',

    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontFamily: 'Inter',
        textDecorationLine: 'none',
        color: '#000000EB',
    },
    inputFocused: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#171923',
        fontFamily: 'Inter',
        textDecorationLine: 'none',
        color: '#000000EB',
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    passwordRequirements: {
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    requirementText: {
        color: '#171923',
        fontSize: 14,
        marginBottom: 2,
        fontFamily: 'Inter',
    },
    validateButton: {
        backgroundColor: '#1A365D',
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
        borderWidth: 0,
    },
    validateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
    backButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#1A365D',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'Inter',
    },
});
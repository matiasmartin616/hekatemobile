import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Link, router } from 'expo-router';
import ThemedText from '@modules/shared/components/themed-text';
import ThemedView from '@modules/shared/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { authApi } from '@modules/auth/api/auth-api';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleRegister = async () => {
        try {
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

    return (
        <ThemedView style={styles.container}>
            {/* Círculos decorativos */}
            <View style={styles.circlesContainer}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <View style={styles.content}>
                <ThemedText type="title" style={styles.title}>Conecta con un nuevo comienzo</ThemedText>
                <ThemedText style={styles.subtitle}>Empieza a diseñar el presente que sueñas</ThemedText>

                {error ? (
                    <ThemedText style={styles.error}>{error}</ThemedText>
                ) : null}

                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#999999"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={styles.input}
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

                <View style={styles.registerOptions}>
                    <ThemedText style={styles.registerWithText}>Registrarse con:</ThemedText>
                    <TouchableOpacity style={styles.googleButton}>
                        <Ionicons name="logo-google" size={24} color="#1253AA" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <ThemedText style={styles.buttonText}>Registrarse</ThemedText>
                </TouchableOpacity>

                <Link href="/auth/login" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <ThemedText>
                            <ThemedText style={styles.normalText}>¿Ya tienes una cuenta? </ThemedText>
                            <ThemedText style={styles.loginText}>Inicia sesión</ThemedText>
                        </ThemedText>
                    </TouchableOpacity>
                </Link>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F4FF',
        justifyContent: 'center',
    },
    circlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 200,
        backgroundColor: '#1253AA',
    },
    circle1: {
        width: 200,
        height: 200,
        top: -110,
        left: -20,
        opacity: 0.7,
        transform: [{ rotate: '-15deg' }],
    },
    circle2: {
        width: 200,
        height: 200,
        top: -50,
        left: -90,
        opacity: 0.7,
        backgroundColor: '#1253AA',
        transform: [{ rotate: '15deg' }],
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 28,
        color: '#1D3D47',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    registerOptions: {
        alignItems: 'center',
        marginVertical: 20,
    },
    registerWithText: {
        marginBottom: 10,
        color: '#666',
    },
    googleButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        backgroundColor: '#1253AA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    normalText: {
        color: '#000000',
        fontSize: 16,
    },
    loginText: {
        color: '#1253AA',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 12,
    },
});
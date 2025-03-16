import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@shared/components/ThemedText';
import { ThemedView } from '@shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            if (data.success) {
                router.replace('/(tabs)');
            }
        } catch (err) {
            setError('Error al intentar registrarse');
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
                <ThemedText type="title" style={styles.title}>¡Conecta con un nuevo comienzo!</ThemedText>
                <ThemedText style={styles.subtitle}>Empieza a diseñar el presente que sueñas</ThemedText>

                {error ? (
                    <ThemedText style={styles.error}>{error}</ThemedText>
                ) : null}

                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirma contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <View style={styles.registerOptions}>
                    <ThemedText style={styles.registerWithText}>Registrarse con:</ThemedText>
                    <TouchableOpacity style={styles.googleButton}>
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <ThemedText style={styles.buttonText}>Registrarse</ThemedText>
                </TouchableOpacity>

                <Link href="/auth/login" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <ThemedText style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</ThemedText>
                    </TouchableOpacity>
                </Link>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },
    circlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
    },
    circle: {
        position: 'absolute',
        borderRadius: 200,
        backgroundColor: '#A1CEDC',
    },
    circle1: {
        width: 300,
        height: 300,
        top: -150,
        left: -100,
    },
    circle2: {
        width: 200,
        height: 200,
        top: -50,
        right: -50,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
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
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
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
        backgroundColor: '#1D3D47',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
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
    linkText: {
        color: '#0a7ea4',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
});
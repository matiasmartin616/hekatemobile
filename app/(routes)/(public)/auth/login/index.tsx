import LoginScreen from "@/app/modules/auth/screens/login";
import { ErrorBoundaryProps } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error en la pantalla de login</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
            <TouchableOpacity style={styles.errorButton} onPress={retry}>
                <Text style={styles.errorButtonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function LoginRoute() {
    console.log('LoginRoute iniciado');
    return (
        <LoginScreen />
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    errorButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
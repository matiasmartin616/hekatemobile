import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormTextInput from './text-input';
import ThemedText from '../themed-text';

// Define el esquema de validación con Zod
const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Tipo inferido del esquema
type LoginFormData = z.infer<typeof loginSchema>;

export default function FormExample() {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        console.log('Form submitted:', data);
        // Aquí puedes manejar el envío del formulario
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Iniciar sesión</ThemedText>

            <FormTextInput
                name="email"
                control={control}
                label="Correo electrónico"
                placeholder="tu@email.com"
                required
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <FormTextInput
                name="password"
                control={control}
                label="Contraseña"
                placeholder="Tu contraseña"
                required
                isPassword
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
            >
                <ThemedText style={styles.buttonText}>Iniciar sesión</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1A365D',
        height: 46,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
}); 
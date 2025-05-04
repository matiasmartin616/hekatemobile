import { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, TouchableOpacity, TextInputProps } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import ThemedText from '../themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FormTextInputProps<TFieldValues extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    secureTextEntry?: boolean;
    isPassword?: boolean;
}

export default function FormTextInput<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required = false,
    placeholder,
    disabled = false,
    secureTextEntry,
    isPassword = false,
    ...rest
}: FormTextInputProps<TFieldValues>) {
    const [showPassword, setShowPassword] = useState(false);
    const { field, fieldState } = useController<TFieldValues>({
        name,
        control,
        rules: { required: required ? 'Este campo es requerido' : false },
    });

    const hasError = !!fieldState.error;
    const showSecureEntry = isPassword ? !showPassword : !!secureTextEntry;

    const getInputStyle = () => {
        if (hasError) return styles.inputError;
        return field.value ? styles.inputFocused : styles.input;
    };

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText style={styles.label}>
                    {label} {required && <ThemedText style={styles.required}>*</ThemedText>}
                </ThemedText>
            )}

            <View style={styles.inputContainer}>
                <RNTextInput
                    style={getInputStyle()}
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    editable={!disabled}
                    secureTextEntry={showSecureEntry}
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    autoCorrect={false}
                    {...rest}
                />

                {isPassword && (
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
                )}
            </View>

            {hasError && (
                <ThemedText style={styles.errorText}>
                    {fieldState.error?.message}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#171923',
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontFamily: 'Inter',
        color: '#000000EB',
        height: 46,
        width: '100%',
    },
    inputFocused: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#171923',
        fontFamily: 'Inter',
        color: '#000000EB',
        height: 46,
        width: '100%',
    },
    inputError: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'red',
        fontFamily: 'Inter',
        color: '#000000EB',
        height: 46,
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 11,
        top: 11,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        fontFamily: 'Inter',
        textAlign: 'left',
        paddingLeft: 15,
    },
});

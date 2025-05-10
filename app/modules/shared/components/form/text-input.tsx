import { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, TouchableOpacity, TextInputProps } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import ThemedText from '../themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../theme/theme';

interface FormTextInputProps<TFieldValues extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues, any>;
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
    const [isFocused, setIsFocused] = useState(false);
    const { field, fieldState } = useController<TFieldValues>({
        name,
        control,
        rules: { required: required ? 'Este campo es requerido' : false },
    });

    const showSecureEntry = isPassword ? !showPassword : !!secureTextEntry;
    const hasValue = field.value && field.value.length > 0;

    const getInputStyle = () => {
        if (fieldState.error) return styles.inputError;
        return isFocused ? styles.inputFocused : styles.input;
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
                    onBlur={() => {
                        setIsFocused(false);
                        field.onBlur();
                    }}
                    onFocus={() => setIsFocused(true)}
                    editable={!disabled}
                    secureTextEntry={showSecureEntry}
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    autoCorrect={false}
                    {...rest}
                />

                {isPassword && hasValue && (
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

            {fieldState.error && (
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
        color: colors.light.primary.main,
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    input: {
        backgroundColor: colors.light.neutral.white,
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[200],
        fontFamily: 'Inter',
        color: colors.light.primary.main,
        height: 46,
        width: '100%',
        flex: 1,
    },
    inputFocused: {
        backgroundColor: colors.light.neutral.white,
        paddingHorizontal: 15,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 2,
        borderColor: colors.light.palette.blue[200],
        fontFamily: 'Inter',
        color: colors.light.primary.main,
        height: 46,
        width: '100%',
        flex: 1,
    },
    inputError: {
        backgroundColor: colors.light.neutral.white,
        paddingHorizontal: 15,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'red',
        fontFamily: 'Inter',
        color: colors.light.primary.main,
        height: 46,
        width: '100%',
        flex: 1,
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

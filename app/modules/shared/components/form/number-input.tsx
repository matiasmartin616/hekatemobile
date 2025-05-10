import { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, TextInputProps } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import ThemedText from '../themed-text';

interface FormNumberInputProps<TFieldValues extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues, any>;
    label?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    decimalPlaces?: number;
}

export default function FormNumberInput<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required = false,
    placeholder,
    disabled = false,
    decimalPlaces = 0,
    ...rest
}: FormNumberInputProps<TFieldValues>) {
    const [isFocused, setIsFocused] = useState(false);

    const { field, fieldState } = useController<TFieldValues>({
        name,
        control,
        rules: { required: required ? 'Este campo es requerido' : false },
    });

    const getInputStyle = () => {
        if (fieldState.error) return styles.inputError;
        return isFocused ? styles.inputFocused : styles.input;
    };

    const handleChangeText = (text: string) => {
        // Allow empty string
        if (text === '') {
            field.onChange('');
            return;
        }

        // Allow only numeric input based on decimal places
        const regex = decimalPlaces > 0
            ? new RegExp(`^-?\\d*\\.?\\d{0,${decimalPlaces}}$`)
            : /^-?\d*$/;

        if (regex.test(text)) {
            // Convert to number before passing to field.onChange
            const numValue = decimalPlaces > 0 ? parseFloat(text) : parseInt(text, 10);
            field.onChange(isNaN(numValue) ? '' : numValue);
        }
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
                    onChangeText={handleChangeText}
                    onBlur={() => {
                        setIsFocused(false);
                        field.onBlur();
                    }}
                    onFocus={() => setIsFocused(true)}
                    editable={!disabled}
                    keyboardType="numeric"
                    autoComplete="off"
                    autoCorrect={false}
                    {...rest}
                />
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
        color: '#171923',
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
        flex: 1,
        paddingTop: 12,
        paddingBottom: 12,
        textAlignVertical: 'center',
    },
    inputFocused: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#3182CE', // blue[500]
        fontFamily: 'Inter',
        color: '#000000EB',
        height: 46,
        width: '100%',
        flex: 1,
        textAlignVertical: 'center',
    },
    inputError: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'red',
        fontFamily: 'Inter',
        color: '#000000EB',
        height: 46,
        width: '100%',
        flex: 1,
        textAlignVertical: 'center',
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

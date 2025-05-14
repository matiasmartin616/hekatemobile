import React from 'react';
import { TouchableOpacity, StyleSheet, Text, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import colors from '../theme/theme';
import ThemedText from './themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ThemedButtonProps {
    onPress: () => void;
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

/**
 * A reusable button component that follows the app's design system
 */
export default function ThemedButton({
    onPress,
    title,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
    iconPosition = 'left',
}: ThemedButtonProps) {
    const getButtonStyle = () => {
        let buttonStyle = [styles.button, styles[`${size}Button`]];

        switch (variant) {
            case 'primary':
                buttonStyle.push(styles.primaryButton);
                break;
            case 'secondary':
                buttonStyle.push(styles.secondaryButton);
                break;
            case 'outline':
                buttonStyle.push(styles.outlineButton);
                break;
        }

        if (disabled) {
            buttonStyle.push(styles.disabledButton);
        }

        return buttonStyle;
    };

    const getTextStyle = () => {
        let textStyleArray = [styles.buttonText, styles[`${size}Text`]];

        switch (variant) {
            case 'primary':
                textStyleArray.push(styles.primaryText);
                break;
            case 'secondary':
                textStyleArray.push(styles.secondaryText);
                break;
            case 'outline':
                textStyleArray.push(styles.outlineText);
                break;
        }

        if (disabled) {
            textStyleArray.push(styles.disabledText);
        }

        return textStyleArray;
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? colors.light.primary.main : '#fff'}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <ThemedText style={[...getTextStyle(), textStyle]}>
                        {title}
                    </ThemedText>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        gap: 8,
    },
    smallButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        minWidth: 80,
    },
    mediumButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        minWidth: 120,
    },
    largeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 150,
    },
    primaryButton: {
        backgroundColor: colors.light.primary.main,
    },
    secondaryButton: {
        backgroundColor: colors.light.palette.blue[50],
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.light.primary.main,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontWeight: '500',
    },
    smallText: {
        fontSize: 12,
    },
    mediumText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 16,
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: colors.light.neutral.black,
    },
    outlineText: {
        color: colors.light.primary.main,
    },
    disabledText: {
        opacity: 0.8,
    },
}); 
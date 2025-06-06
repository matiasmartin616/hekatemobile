import React from 'react';
import { TouchableOpacity, StyleSheet, Text, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import colors from '../theme/theme';
import ThemedText from './themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonRadius = 'none' | 'small' | 'medium' | 'large' | 'pill';

interface ThemedButtonProps {
    onPress: () => void;
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    radius?: ButtonRadius;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

/**
 * A reusable button component that follows the app's design system
 */
export default function ThemedButton({
    onPress,
    title,
    variant = 'primary',
    size = 'medium',
    radius = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
    iconPosition = 'left',
    fullWidth = false,
}: ThemedButtonProps) {
    const getButtonStyle = (): StyleProp<ViewStyle>[] => {
        const buttonStyle: StyleProp<ViewStyle>[] = [
            styles.button,
            styles[`${size}Button`],
            styles[`${radius}Radius`]
        ];

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
            case 'danger':
                buttonStyle.push(styles.dangerButton);
                break;
            case 'success':
                buttonStyle.push(styles.successButton);
                break;
            case 'warning':
                buttonStyle.push(styles.warningButton);
                break;
            case 'info':
                buttonStyle.push(styles.infoButton);
                break;
            case 'light':
                buttonStyle.push(styles.lightButton);
                break;
            case 'dark':
                buttonStyle.push(styles.darkButton);
                break;
            case 'link':
                buttonStyle.push(styles.linkButton);
                break;
        }

        if (disabled) {
            buttonStyle.push(styles.disabledButton);
        }

        if (fullWidth) {
            buttonStyle.push(styles.fullWidthButton);
        }

        return buttonStyle;
    };

    const getTextStyle = (): StyleProp<TextStyle>[] => {
        const textStyleArray: StyleProp<TextStyle>[] = [
            styles.buttonText,
            styles[`${size}Text`]
        ];

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
            case 'danger':
                textStyleArray.push(styles.dangerText);
                break;
            case 'success':
                textStyleArray.push(styles.successText);
                break;
            case 'warning':
                textStyleArray.push(styles.warningText);
                break;
            case 'info':
                textStyleArray.push(styles.infoText);
                break;
            case 'light':
                textStyleArray.push(styles.lightText);
                break;
            case 'dark':
                textStyleArray.push(styles.darkText);
                break;
            case 'link':
                textStyleArray.push(styles.linkText);
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
                    color={getLoadingColor(variant)}
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

const getLoadingColor = (variant: ButtonVariant): string => {
    switch (variant) {
        case 'outline':
        case 'light':
        case 'link':
            return colors.light.primary.main;
        default:
            return '#fff';
    }
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    xlargeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minWidth: 180,
    },
    noneRadius: {
        borderRadius: 0,
    },
    smallRadius: {
        borderRadius: 4,
    },
    mediumRadius: {
        borderRadius: 8,
    },
    largeRadius: {
        borderRadius: 16,
    },
    pillRadius: {
        borderRadius: 999,
    },
    primaryButton: {
        backgroundColor: colors.light.primary.mainBlue,
    },
    secondaryButton: {
        backgroundColor: colors.light.palette.blue[50],
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.light.primary.main,
    },
    dangerButton: {
        backgroundColor: colors.light.palette.red[500],
    },
    successButton: {
        backgroundColor: colors.light.palette.green[500],
    },
    warningButton: {
        backgroundColor: colors.light.palette.yellow[500],
    },
    infoButton: {
        backgroundColor: colors.light.palette.blue[300],
    },
    lightButton: {
        backgroundColor: colors.light.palette.blue[50],
        borderWidth: 1,
        borderColor: colors.light.palette.blue[100],
    },
    darkButton: {
        backgroundColor: colors.light.neutral.black,
    },
    linkButton: {
        backgroundColor: 'transparent',
    },
    disabledButton: {
        opacity: 0.6,
    },
    fullWidthButton: {
        width: '100%',
    },
    buttonText: {
        fontWeight: '500',
        color: colors.light.primary.mainBlue,
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
    xlargeText: {
        fontSize: 18,
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
    dangerText: {
        color: '#fff',
    },
    successText: {
        color: '#fff',
    },
    warningText: {
        color: colors.light.neutral.black,
    },
    infoText: {
        color: '#fff',
    },
    lightText: {
        color: colors.light.neutral.black,
    },
    darkText: {
        color: '#fff',
    },
    linkText: {
        color: colors.light.primary.main,
        textDecorationLine: 'underline',
    },
    disabledText: {
        opacity: 0.8,
    },
}); 
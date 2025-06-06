import { FormState } from "react-hook-form";
import ThemedButton, { ButtonVariant, ButtonSize, ButtonRadius } from "../themed-button";
import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface FormButtonProps {
    formState: FormState<any>;
    handleSubmit: () => void;
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    radius?: ButtonRadius;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export default function FormButton({
    formState,
    handleSubmit,
    title,
    variant = 'primary',
    size = 'medium',
    radius = 'pill',
    style,
    textStyle,
    icon,
    iconPosition,
    fullWidth = true
}: FormButtonProps) {
    const { isValid, isDirty, isSubmitting } = formState;
    const isDisabled = !isValid || !isDirty || isSubmitting;

    return (
        <ThemedButton
            title={title}
            onPress={handleSubmit}
            disabled={isDisabled}
            loading={isSubmitting}
            variant={variant}
            size={size}
            radius={radius}
            style={style}
            textStyle={textStyle}
            icon={icon}
            iconPosition={iconPosition}
            fullWidth={fullWidth}
        />
    );
}
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../../theme/theme";
import { FormState } from "react-hook-form";
interface FormButtonProps {
    formState: FormState<any>;
    handleSubmit: (data: any) => void;
    children: React.ReactNode;
}

export default function FormButton({ formState, handleSubmit, children }: FormButtonProps) {
    const { isValid, isDirty, isSubmitting } = formState;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                (!isValid || !isDirty || isSubmitting) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isValid || !isDirty || isSubmitting}
        >
            {children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.light.palette.blue[500],
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});
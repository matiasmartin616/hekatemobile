import ResetPasswordScreen from "@modules/user/screens/reset-password";
import { useLocalSearchParams } from "expo-router";
export default function ResetPassword() {
    const { email, code } = useLocalSearchParams<{ email: string, code: string }>();

    return <ResetPasswordScreen email={email} code={code} />;
}
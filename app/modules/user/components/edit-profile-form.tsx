import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ThemedView from "../../shared/components/themed-view";
import ThemedText from "../../shared/components/themed-text";
import ThemedButton from "../../shared/components/themed-button";
import { z } from "zod";
import FormTextInput from "../../shared/components/form/text-input";
import FormButton from "../../shared/components/form/form-button";
import { StyleSheet, View } from "react-native";
import { colors } from "../../shared/theme/theme";
import { useAuth } from "../../shared/context/auth-context";
import useEditUser from "../hooks/use-edit-user";
import { useToast } from "../../shared/context/toast-context";
import { useState } from "react";
import { router } from "expo-router";

export default function EditProfileForm() {
    const { user, isLoading } = useAuth();
    const { editUserMutation } = useEditUser();
    const formSchema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
    });

    const { control, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
        },
        mode: 'onChange'
    });

    const toast = useToast();
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await editUserMutation.mutateAsync(data.name);
            toast.showToast('Profile updated successfully', 'success');
        } catch (error) {
            toast.showToast('Error updating profile', 'error');
        }
    };

    const handleChangePassword = () => {
        router.push('/(routes)/(private)/user/verify-password-reset-code');
    };

    if (isLoading) {
        return (
            <ThemedView style={styles.form}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.form}>
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>

                <FormTextInput
                    control={control}
                    name="name"
                    placeholder="Name"
                    label="Name"
                />

                <View style={styles.readOnlyField}>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <ThemedText style={styles.value}>{user?.email}</ThemedText>
                </View>

                <View style={styles.readOnlyField}>
                    <ThemedText style={styles.label}>Role</ThemedText>
                    <ThemedText style={styles.value}>{user?.role}</ThemedText>
                </View>

                <View style={styles.readOnlyField}>
                    <ThemedText style={styles.label}>Account Created</ThemedText>
                    <ThemedText style={styles.value}>
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </ThemedText>
                </View>
            </View>

            <View style={styles.section}>
                <FormButton
                    title="Save Changes"
                    formState={formState}
                    handleSubmit={handleSubmit(onSubmit)}
                />

                <ThemedButton
                    title="Change Password"
                    onPress={handleChangePassword}
                    variant="secondary"
                    fullWidth={true}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: colors.light.primary.mainBlue,
    },
    readOnlyField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: colors.light.neutral.gray[600],
    },
    value: {
        fontSize: 16,
        padding: 12,
        backgroundColor: colors.light.background.secondary,
        borderRadius: 8,
        color: colors.light.primary.main,
    },
});

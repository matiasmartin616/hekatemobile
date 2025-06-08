import SimpleScreenHeader from "../../shared/components/navigation/simple-screen-header";
import ThemedText from "../../shared/components/themed-text";
import ThemedView from "../../shared/components/themed-view";
import { StyleSheet } from "react-native";
import EditProfileForm from "../components/edit-profile-form";
import { colors } from "../../shared/theme/theme";

export default function EditProfileScreen() {
    return (
        <ThemedView style={styles.container}>
            <SimpleScreenHeader variant="tertiary" />

            <ThemedView variant="main" style={styles.container}>
                <ThemedText style={styles.title}>Edit Profile</ThemedText>
                <EditProfileForm />
            </ThemedView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color: colors.light.primary.mainBlue,
        textAlign: 'center',
    },
});



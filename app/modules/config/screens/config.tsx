import ThemedText from "../../shared/components/themed-text";
import ThemedView from "../../shared/components/themed-view";
import SimpleScreenHeader from "../../shared/components/navigation/simple-screen-header";
import { StyleSheet } from "react-native";

export default function ConfigScreen() {
    return (
        <ThemedView style={styles.container}>
            <SimpleScreenHeader variant="tertiary" />
            <ThemedText>Config</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

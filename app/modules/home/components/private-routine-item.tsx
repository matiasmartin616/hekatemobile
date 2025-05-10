import { View } from "react-native";
import ThemedText from "../../shared/components/themed-text";
import { StyleSheet } from "react-native";

interface RoutineItemProps {
    description: string;
}

export default function PrivateRoutineItem({ description }: RoutineItemProps) {
    return (
        <View key={description} style={styles.routineItem}>
            <ThemedText style={styles.bulletPoint}>•</ThemedText>
            <ThemedText style={styles.routineText}>{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    routineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    bulletPoint: {
        fontSize: 16,
        lineHeight: 20,
        marginRight: 5,
    },
    routineText: {
        fontSize: 14,
        lineHeight: 20,
    },
});

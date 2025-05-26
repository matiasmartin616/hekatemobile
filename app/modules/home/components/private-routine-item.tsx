import { View } from "react-native";
import ThemedText from "../../shared/components/themed-text";
import { StyleSheet } from "react-native";

interface RoutineItemProps {
    description: string;
}

export default function PrivateRoutineItem({ description }: RoutineItemProps) {
    const items = description
        ? description.split(/\n|\r|•/).map((s: string) => s.trim()).filter(Boolean)
        : [];

    return (
        <View style={styles.container}>
            {items.map((item, index) => (
                <View key={index} style={styles.routineItem}>
                    <ThemedText style={styles.bulletPoint}>•</ThemedText>
                    <ThemedText style={styles.routineText}>{item}</ThemedText>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
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
        flex: 1,
    },
});

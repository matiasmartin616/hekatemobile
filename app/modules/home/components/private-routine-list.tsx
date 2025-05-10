import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { PrivateRoutineBlock } from "../../private-routines/api/private-routine-block-api";
import PrivateRoutineTimeBlock from "./private-routine-block";
import colors from "../../shared/theme/theme";
interface RoutineListProps {
    blocks: PrivateRoutineBlock[];
}

export default function PrivateRoutineList({ blocks }: RoutineListProps) {
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

    return (
        <ScrollView>
            {sortedBlocks.map((block, index) => (
                <View key={block.id} style={styles.group}>
                    <PrivateRoutineTimeBlock
                        block={block}
                    />
                    {index < sortedBlocks.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    group: {
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: colors.light.neutral.gray[200],
        marginVertical: 10,
    },
});

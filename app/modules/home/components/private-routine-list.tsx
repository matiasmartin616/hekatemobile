import { ScrollView, View, StyleSheet } from "react-native";
import { PrivateRoutineBlock } from "../../private-routines/api/private-routine-block-api";
import RoutineBlockItem from '@/app/modules/private-routines/components/routine-block-item';
import colors from "../../shared/theme/theme";

interface RoutineListProps {
    blocks: PrivateRoutineBlock[];
}

export default function PrivateRoutineList({ blocks }: RoutineListProps) {
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

    return (
        <ScrollView>
            {sortedBlocks.map((block) => (
                <View key={block.id} style={styles.group}>
                    <RoutineBlockItem block={block} showEditButton={false} stateIconCentered={true} />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    group: {
        marginBottom: 0,
    },
    divider: {
        height: 1,
        backgroundColor: colors.light.neutral.gray[200],
        marginVertical: 10,
    },
});

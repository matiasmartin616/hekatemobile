import Ionicons from "@expo/vector-icons/Ionicons";
import { PrivateRoutineBlock as PrivateRoutineBlockType } from "../../private-routines/api/private-routines-api";
import ThemedText from "../../shared/components/themed-text";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import PrivateRoutineItem from "./private-routine-item";
import { colors } from "../../shared/theme/theme";

interface PrivateRoutineBlockProps {
    block: PrivateRoutineBlockType;
    onVisualize: (block: PrivateRoutineBlockType) => void;
    onToggleComplete: (id: string) => void;
    isCompleted: boolean;
}

export default function PrivateRoutineBlock({ block, onVisualize, onToggleComplete, isCompleted }: PrivateRoutineBlockProps) {
    return (
        <View style={styles.block}>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onVisualize(block)}
                >
                    <Ionicons name="eye-outline" size={15} color={colors.light.palette.blue[500]} />
                    <ThemedText style={styles.actionButtonText}>Visualizar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onToggleComplete(block.id)}
                >
                    <Ionicons name="help-circle-outline" size={15} color={colors.light.palette.blue[500]} />
                    <ThemedText style={styles.actionButtonText}>¿Hecha?</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.blockContent}>
                <ThemedText type="title" style={styles.blockTitle}>{block.title}</ThemedText>
                <PrivateRoutineItem description={block.description} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    blockTitle: {
        fontWeight: '600',
        fontSize: 12,
    },
    blockContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 5,
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 5,
        minWidth: 90,
        width: '25%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.palette.blue[100],
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.2,
        borderColor: colors.light.palette.blue[500],
    },
    actionButtonText: {
        marginLeft: 5,
        fontSize: 10,
        color: colors.light.palette.blue[500],
        fontWeight: '600',
    },

}); 

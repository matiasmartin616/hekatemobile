import { View, StyleSheet, ScrollView } from "react-native";
import DreamCardImageCarousel from "./3d-dream-card-image-carousel";
import ThemedText from "../../shared/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../shared/theme/theme";
import { Dream } from "@modules/dreams/api/dreams";
import { DreamImage } from "@modules/dreams/api/dream-images-api";
import { useMemo } from "react";
import { spacing } from "../../shared/theme/theme";
import { LinearGradient } from 'expo-linear-gradient';
import ThemedView from "../../shared/components/themed-view";
import useDreamHistory from "../hooks/use-dream-history";
import LoadingSpinner from "../../shared/components/loading-spinner";

interface ReadDreamProps {
    dream: Dream;
    images: DreamImage[];
}

export default function ReadDream({ dream, images }: ReadDreamProps) {

    const formattedDate = useMemo(() =>
        new Date(dream?.createdAt || Date.now()).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }), [dream?.createdAt]
    );
    const { dreamHistory, isLoadingDreamHistory } = useDreamHistory(dream.id);

    return (
        <>
            <LinearGradient
                colors={[colors.light.palette.blue[500], colors.light.palette.blue[100], colors.light.background.main]}
                start={{ x: 0, y: -0.7 }}
                end={{ x: 0, y: 0.7 }}
                style={styles.titleGradient}
            >
                <ThemedText style={styles.title}>{dream?.title}</ThemedText>
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.cardFrontSideBody}
            >
                <View style={styles.imageContainer}>
                    <DreamCardImageCarousel images={images || []} />
                </View>

                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Descripción</ThemedText>
                    <ThemedText style={styles.description} numberOfLines={4}>
                        {dream?.text}
                    </ThemedText>
                </View>

                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Estadísticas</ThemedText>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={18} color={colors.light.palette.blue[500]} />
                            {isLoadingDreamHistory ? (
                                <LoadingSpinner style={{ width: 5, height: 5, marginHorizontal: spacing.xs }} size="small" />
                            ) : (
                                <ThemedText style={styles.statText}>{dreamHistory?.length} visualizaciones</ThemedText>
                            )}
                        </View>

                        <View style={styles.statItem}>
                            <Ionicons name="calendar-outline" size={18} color={colors.light.palette.blue[500]} />
                            <ThemedText style={styles.statText}>Creado el {formattedDate}</ThemedText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 20,
    },
    cardFrontSideBody: {
        flexGrow: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    imageContainer: {
        marginTop: -spacing.xs,
        marginBottom: spacing.md,
    },
    titleGradient: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        textAlign: 'center',
    },
    sectionContainer: {
        backgroundColor: colors.light.palette.blue[50],
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.light.neutral.gray[100],
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 14,
        color: colors.light.neutral.gray[700],
        lineHeight: 20,
    },
    statsContainer: {
        gap: spacing.sm,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statText: {
        fontSize: 14,
        color: colors.light.neutral.gray[600],
        fontWeight: '500',
    },
});

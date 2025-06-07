import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Dream } from '../api/dreams';
// Theme imports
import colors, { shadows, spacing } from '@/app/modules/shared/theme/theme';
import ThemedText from '@/app/modules/shared/components/themed-text';

// Components
import DreamCardImageCarousel from './3d-dream-card-image-carousel';
import useDreamImagesApi from '../hooks/use-dream-images-api';
import LoadingSpinner from '@/app/modules/shared/components/loading-spinner';
import { useCardFlip } from '../hooks/use-card-flip';

// Constants
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const HEKATE_LOGO = require('@/assets/images/logo-hekate-circle.png');

const INSPIRATIONAL_QUOTE = "Los sueños son el camino hacia tu verdadero ser";

interface ThreeDDreamCardProps {
    dream: Dream;
}

export default function ThreeDDreamCard({
    dream,
}: ThreeDDreamCardProps) {
    const { images, loading: loadingImages } = useDreamImagesApi(dream.id);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { flipProgress, flipCard, flipInstructionOpacity } = useCardFlip(isImageLoaded);

    useEffect(() => {
        if (images && images.length > 0 && !loadingImages) {
            setIsImageLoaded(true);
        }
    }, [images, loadingImages]);

    const formattedDate = useMemo(() =>
        new Date(dream?.createdAt || Date.now()).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }), [dream?.createdAt]
    );

    const visualizationCount = useMemo(() =>
        dream?.visualizations ? dream.visualizations.length : 0,
        [dream?.visualizations]
    );

    const panGesture = Gesture.Pan()
        .onEnd((event) => {
            if (Math.abs(event.translationX) > 50) {
                runOnJS(flipCard)();
            }
        });

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1200 },
            { rotateY: `${flipProgress.value * 180}deg` },
            { scale: 1 - (0.05 * flipProgress.value) },
        ],
        opacity: flipProgress.value >= 0.5 ? 0 : 1,
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1200 },
            { rotateY: `${(flipProgress.value * 180) + 180}deg` },
            { scale: 0.95 + (0.05 * flipProgress.value) },
        ],
        opacity: flipProgress.value >= 0.5 ? 1 : 0,
    }));

    const flipInstructionStyle = useAnimatedStyle(() => ({
        opacity: flipInstructionOpacity.value
    }));

    if (loadingImages) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingSpinner size="large" color={colors.light.palette.blue[500]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.flipInstruction, flipInstructionStyle]}>
                <Ionicons name="swap-horizontal" size={18} color={colors.light.palette.blue[600]} />
                <ThemedText style={styles.flipText}>Desliza para girar</ThemedText>
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <View style={styles.cardWrapper}>
                    {/* Sophisticated Shadow Wrapper */}
                    <View style={styles.shadowWrapper}>
                        {/* FRONT SIDE */}
                        <Animated.View style={[styles.cardFrontSide, frontAnimatedStyle]}>
                            <ThemedText style={styles.title}>{dream?.title}</ThemedText>
                            <View style={styles.cardFrontSideBody}>
                                <DreamCardImageCarousel images={images || []} />

                                <ThemedText style={styles.sectionTitle}>Descripción</ThemedText>
                                <ThemedText style={styles.description} numberOfLines={4}>
                                    {dream?.text}
                                </ThemedText>

                                <ThemedText style={styles.sectionTitle}>Estadísticas</ThemedText>
                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <View style={styles.statIconWrapper}>
                                            <Ionicons name="eye-outline" size={20} color={colors.light.palette.blue[600]} />
                                        </View>
                                        <ThemedText style={styles.statValue}>{visualizationCount}</ThemedText>
                                        <ThemedText style={styles.statLabel}>Visualizaciones</ThemedText>
                                    </View>

                                    <View style={styles.statDivider} />

                                    <View style={styles.statItem}>
                                        <View style={styles.statIconWrapper}>
                                            <Ionicons name="calendar-outline" size={20} color={colors.light.palette.blue[600]} />
                                        </View>
                                        <ThemedText style={styles.statValue}>{formattedDate}</ThemedText>
                                        <ThemedText style={styles.statLabel}>Creado el</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>

                        {/* BACK SIDE */}
                        <Animated.View style={[styles.cardBackSide, backAnimatedStyle]}>
                            <LinearGradient
                                colors={[colors.light.palette.blue[100], colors.light.palette.blue[200]]}
                                style={styles.cardBack}
                            >
                                <Image source={HEKATE_LOGO} style={styles.logo} resizeMode="contain" />
                                <ThemedText style={styles.quote}>"{INSPIRATIONAL_QUOTE}"</ThemedText>
                                <View style={styles.brandInfo}>
                                    <ThemedText style={styles.brandTitle}>HEKATE</ThemedText>
                                    <ThemedText style={styles.brandSubtitle}>Visualiza, Manifiesta</ThemedText>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    loadingContainer: {
        width: CARD_WIDTH,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    flipInstruction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    flipText: {
        fontSize: 14,
        marginLeft: 8,
        color: colors.light.palette.blue[600],
    },
    cardWrapper: {
        width: CARD_WIDTH,
        height: 570,
        position: 'relative',
    },
    shadowWrapper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 20,
        shadowColor: 'rgba(255, 255, 255, 0.4)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 25,
    },
    cardFrontSide: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.light.neutral.white,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: colors.light.palette.blue[200],
        backfaceVisibility: 'hidden',
        shadowColor: 'rgba(59, 130, 246, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 8,
    },
    cardFrontSideBody: {
        padding: spacing.md,
    },
    cardBackSide: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.light.neutral.white,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: colors.light.palette.blue[200],
        padding: 3,
        backfaceVisibility: 'hidden',
        shadowColor: 'rgba(59, 130, 246, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        textAlign: 'center',
        marginBottom: spacing.sm,
        backgroundColor: colors.light.palette.blue[50],
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: spacing.md,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: 14,
        color: colors.light.neutral.gray[700],
        lineHeight: 20,
        marginBottom: spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: spacing.sm,
        marginHorizontal: -spacing.xs,
        paddingVertical: spacing.sm,
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.palette.blue[100],
    },
    statItem: {
        alignItems: 'center',
        gap: 6,
    },
    statIconWrapper: {
        width: 32,
        height: 32,
        backgroundColor: colors.light.palette.blue[100],
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
        marginTop: 4,
    },
    statLabel: {
        fontSize: 11,
        color: colors.light.palette.blue[500],
        fontWeight: '500',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.light.palette.blue[200],
    },
    cardBack: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: 15,
    },
    logo: {
        width: 80,
        height: 80,
    },
    quote: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        fontStyle: 'italic',
        color: colors.light.palette.blue[800],
        paddingHorizontal: spacing.md,
    },
    brandInfo: {
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.light.palette.blue[700],
    },
    brandSubtitle: {
        fontSize: 14,
        color: colors.light.palette.blue[600],
        marginTop: 4,
    },
});

import React, { useState, useEffect } from 'react';
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
import colors, { spacing } from '@/app/modules/shared/theme/theme';
import ThemedText from '@/app/modules/shared/components/themed-text';

// Components
import useDreamImagesApi from '../hooks/use-dream-images-api';
import LoadingSpinner from '@/app/modules/shared/components/loading-spinner';
import { useCardFlip } from '../hooks/use-card-flip';
import ReadDream from './read-dream';
import EditDreamForm from './edit-dream-form';

// Constants
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const HEKATE_LOGO = require('@/assets/images/logo-hekate-circle.png');

const INSPIRATIONAL_QUOTE = "Los sueños son el camino hacia tu verdadero ser";

interface ThreeDDreamCardProps {
    dream: Dream;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

export default function ThreeDDreamCard({
    dream,
    isEditing,
    setIsEditing,
}: ThreeDDreamCardProps) {
    const { images, loading: loadingImages } = useDreamImagesApi(dream.id);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { flipProgress, flipCard, flipInstructionOpacity } = useCardFlip(isImageLoaded, isEditing);

    useEffect(() => {
        if (images && images.length > 0 && !loadingImages) {
            setIsImageLoaded(true);
        }
    }, [images, loadingImages]);

    const panGesture = Gesture.Pan()
        .enabled(!isEditing)
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
                            {isEditing ? (
                                <EditDreamForm dream={dream} setIsEditing={setIsEditing} />
                            ) : (
                                <ReadDream dream={dream} images={images || []} />
                            )}
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
        backgroundColor: colors.light.background.main,
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
        backgroundColor: colors.light.background.main,
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

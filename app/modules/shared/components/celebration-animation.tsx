import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    runOnJS,
    interpolate,
    Easing,
    withRepeat,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/app/modules/shared/theme/theme';

const { width, height } = Dimensions.get('window');

interface CelebrationAnimationProps {
    isVisible: boolean;
    onAnimationComplete?: () => void;
}

// Custom Rocket Component
const CustomRocket = ({ size = 'large' }: { size?: 'large' | 'small' }) => {
    const isLarge = size === 'large';
    const scale = isLarge ? 1 : 0.6;

    return (
        <View style={[styles.customRocket, { transform: [{ scale }] }]}>
            {/* Rocket Tip */}
            <View style={styles.rocketTip} />

            {/* Rocket Body */}
            <View style={styles.rocketBody}>
                {/* Windows/Details */}
                <View style={styles.rocketWindow} />
                <View style={[styles.rocketWindow, { marginTop: 8 }]} />
            </View>

            {/* Rocket Fins */}
            <View style={styles.rocketFins}>
                <View style={styles.rocketFinLeft} />
                <View style={styles.rocketFinRight} />
            </View>
        </View>
    );
};

// Particle component
const Particle = ({ index, rocketY }: { index: number; rocketY: Animated.SharedValue<number> }) => {
    const particleX = useSharedValue(0);
    const particleY = useSharedValue(0);
    const particleOpacity = useSharedValue(0);
    const particleScale = useSharedValue(0.5);

    useEffect(() => {
        // Random particle behavior
        const delay = Math.random() * 1000;
        const duration = 1500 + Math.random() * 1000;

        particleX.value = withDelay(delay, withTiming(
            (Math.random() - 0.5) * 200,
            { duration }
        ));

        particleY.value = withDelay(delay, withTiming(
            -100 - Math.random() * 50,
            { duration }
        ));

        particleOpacity.value = withDelay(delay, withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: duration - 200 })
        ));

        particleScale.value = withDelay(delay, withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0.2, { duration: duration - 200 })
        ));
    }, []);

    const particleStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: particleX.value },
            { translateY: particleY.value + rocketY.value },
            { scale: particleScale.value },
        ],
        opacity: particleOpacity.value,
    }));

    return (
        <Animated.View style={[styles.particle, particleStyle]}>
            <Ionicons
                name="star"
                size={8}
                color={colors.light.palette.blue[300]}
            />
        </Animated.View>
    );
};

// Small rocket component
const SmallRocket = ({ delay, direction }: { delay: number; direction: number }) => {
    const smallRocketY = useSharedValue(height + 50);
    const smallRocketX = useSharedValue(0);
    const smallRocketOpacity = useSharedValue(1);

    useEffect(() => {
        smallRocketY.value = withDelay(delay, withTiming(
            -150,
            { duration: 2800, easing: Easing.out(Easing.quad) }
        ));

        smallRocketX.value = withDelay(delay, withTiming(
            direction * 50,
            { duration: 2800 }
        ));

        smallRocketOpacity.value = withDelay(delay + 2300, withTiming(0, { duration: 700 }));
    }, []);

    const smallRocketStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: smallRocketY.value },
            { translateX: smallRocketX.value },
        ],
        opacity: smallRocketOpacity.value,
    }));

    return (
        <Animated.View style={[styles.smallRocket, smallRocketStyle]}>
            <CustomRocket size="small" />
        </Animated.View>
    );
};

export default function CelebrationAnimation({
    isVisible,
    onAnimationComplete
}: CelebrationAnimationProps) {
    const rocketY = useSharedValue(height + 100);
    const rocketScale = useSharedValue(1);
    const fadeOut = useSharedValue(1);
    const rocketGlow = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            // Reset values
            rocketY.value = height + 100;
            rocketScale.value = 1;
            fadeOut.value = 1;
            rocketGlow.value = 0;

            // Start rocket animation
            rocketY.value = withSequence(
                withTiming(-200, {
                    duration: 3500,
                    easing: Easing.out(Easing.quad)
                }),
                withTiming(-300, {
                    duration: 800
                })
            );

            // Rocket scale effect
            rocketScale.value = withSequence(
                withDelay(3200, withTiming(1.3, { duration: 300 })),
                withTiming(0.7, { duration: 400 })
            );

            // Rocket glow effect
            rocketGlow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(0.5, { duration: 400 })
                ),
                8,
                true
            );

            // Fade out everything
            fadeOut.value = withDelay(4800,
                withTiming(0, {
                    duration: 700
                }, () => {
                    if (onAnimationComplete) {
                        runOnJS(onAnimationComplete)();
                    }
                })
            );
        }
    }, [isVisible]);

    const rocketAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: rocketY.value },
            { scale: rocketScale.value },
        ],
        opacity: fadeOut.value,
    }));

    const rocketGlowStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: rocketY.value },
            { scale: rocketScale.value * (1 + rocketGlow.value * 0.4) },
        ],
        opacity: fadeOut.value * rocketGlow.value * 0.2,
    }));

    if (!isVisible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Rocket Glow Effect */}
            <Animated.View style={[styles.rocketGlow, rocketGlowStyle]}>
                <CustomRocket />
            </Animated.View>

            {/* Main Rocket */}
            <Animated.View style={[styles.rocket, rocketAnimatedStyle]}>
                <CustomRocket />
            </Animated.View>

            {/* Particles */}
            {Array.from({ length: 15 }, (_, i) => (
                <Particle key={i} index={i} rocketY={rocketY} />
            ))}

            {/* Small Rockets */}
            <SmallRocket delay={300} direction={-1} />
            <SmallRocket delay={600} direction={1} />
            <SmallRocket delay={900} direction={-0.5} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    rocket: {
        position: 'absolute',
        left: width / 2 - 20,
        zIndex: 1001,
    },
    rocketGlow: {
        position: 'absolute',
        left: width / 2 - 20,
        zIndex: 1000,
    },
    // Custom Rocket Styles
    customRocket: {
        alignItems: 'center',
        width: 40,
        height: 60,
    },
    rocketTip: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.light.palette.blue[700],
        marginBottom: -2,
    },
    rocketBody: {
        width: 20,
        height: 35,
        backgroundColor: colors.light.palette.blue[600],
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.light.palette.blue[800],
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
    },
    rocketWindow: {
        width: 8,
        height: 4,
        backgroundColor: colors.light.palette.blue[200],
        borderRadius: 2,
        marginTop: 3,
    },
    rocketFins: {
        flexDirection: 'row',
        width: 40,
        height: 10,
        marginTop: -2,
    },
    rocketFinLeft: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderRightWidth: 10,
        borderTopColor: colors.light.palette.blue[500],
        borderRightColor: 'transparent',
        marginRight: 20,
    },
    rocketFinRight: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderLeftWidth: 10,
        borderTopColor: colors.light.palette.blue[500],
        borderLeftColor: 'transparent',
    },
    particle: {
        position: 'absolute',
        left: width / 2 - 4,
        zIndex: 999,
    },
    smallRocket: {
        position: 'absolute',
        left: width / 2 - 12,
        zIndex: 997,
    },
}); 
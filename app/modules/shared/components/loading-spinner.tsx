import React from 'react';
import { View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import colors from '../theme/theme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
    fullscreen?: boolean;
    backgroundColor?: string;
}

export default function LoadingSpinner({
    size = 'large',
    color = colors.light.palette.blue[500],
    style,
    fullscreen = false,
    backgroundColor = 'rgba(255, 255, 255, 0.8)'
}: LoadingSpinnerProps) {

    if (fullscreen) {
        return (
            <View style={[styles.fullscreenContainer, { backgroundColor }, style]}>
                <ActivityIndicator size={size} color={color} />
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    }
}); 
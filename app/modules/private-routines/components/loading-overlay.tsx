import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export default function LoadingOverlay({ visible, message = 'Cargando...' }: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#1A365D" />
                <ThemedText style={styles.loadingText}>{message}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    loadingBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    loadingText: {
        marginTop: 16,
        color: '#1A365D',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter',
    },
}); 
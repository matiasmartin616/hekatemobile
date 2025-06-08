import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../themed-view';
import { VariantType } from '../themed-view';

interface SimpleScreenHeaderProps {
    children?: React.ReactNode;
    variant?: VariantType;
}

export default function SimpleScreenHeader({
    children,
    variant = 'main'
}: SimpleScreenHeaderProps) {
    return (
        <ThemedView style={styles.header} variant={variant}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            {children}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 10,
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 45 : 25,
        position: 'relative',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
});

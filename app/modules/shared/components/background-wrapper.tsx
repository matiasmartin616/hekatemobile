import { ImageBackground, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

interface BackgroundWrapperProps {
    children: React.ReactNode;
}

// Precargar la imagen una sola vez a nivel de módulo
const backgroundImage = require('@/assets/images/app-main-background.png');

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
    // Ya no necesitamos estado local aquí porque la imagen se precarga en _layout.tsx
    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.content}>
                {children}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
}); 
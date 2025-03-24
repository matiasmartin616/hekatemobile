import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../ThemedText';
import useThemeColor from '@shared/hooks/useThemeColor';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const backgroundColor = useThemeColor({}, 'background');

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    return (
        <>
            {visible && (
                <TouchableOpacity 
                    style={styles.overlay} 
                    activeOpacity={1} 
                    onPress={onClose}
                />
            )}
            <Animated.View 
                style={[
                    styles.sideMenu,
                    {
                        transform: [{ translateX: slideAnim }],
                        backgroundColor,
                    }
                ]}
            >
                <View style={styles.sideMenuContent}>
                    <TouchableOpacity style={styles.sideMenuItem}>
                        <Ionicons name="home-outline" size={24} color="#FFFFFF" />
                        <ThemedText style={[styles.sideMenuItemText, { color: '#FFFFFF' }]}>Inicio</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sideMenuItem}>
                        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                        <ThemedText style={[styles.sideMenuItemText, { color: '#FFFFFF' }]}>Configuración</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sideMenuItem}>
                        <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
                        <ThemedText style={[styles.sideMenuItemText, { color: '#FFFFFF' }]}>Ayuda</ThemedText>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
    },
    sideMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 300,
        zIndex: 1000,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    sideMenuContent: {
        paddingTop: 120,
        paddingHorizontal: 16,
    },
    sideMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    sideMenuItemText: {
        marginLeft: 16,
        fontSize: 16,
    },
}); 
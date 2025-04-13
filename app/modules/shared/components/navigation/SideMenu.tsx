import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import ThemedText from '../../components/ThemedText';
import useThemeColor from '../../hooks/useThemeColor';

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
    }, [visible, slideAnim]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.overlay} onPress={onClose} />
            <Animated.View 
                style={[
                    styles.sideMenu,
                    {
                        transform: [{ translateX: slideAnim }],
                        backgroundColor,
                    }
                ]}
            >
                <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.menuItems}>
                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="home-outline" size={24} color="#FFFFFF" />
                            <ThemedText style={styles.menuItemText}>Inicio</ThemedText>
                        </TouchableOpacity>
                    </Link>
                    <Link href="../settings" asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                            <ThemedText style={styles.menuItemText}>Configuración</ThemedText>
                        </TouchableOpacity>
                    </Link>
                    <Link href="../help" asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
                            <ThemedText style={styles.menuItemText}>Ayuda</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sideMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 300,
        paddingTop: 20,
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
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    closeButton: {
        padding: 8,
    },
    menuItems: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    menuItemText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#FFFFFF',
    },
}); 
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import ThemedText from '../themed-text';
import { useAuth } from '../../context/auth-context';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const { user, logout } = useAuth();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, slideAnim]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.overlay} onPress={onClose} />
            <Animated.View
                style={[
                    styles.sideMenu,
                    {
                        transform: [{ translateX: slideAnim }],
                    }
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Menú</ThemedText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#1A365D" />
                    </TouchableOpacity>
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={require('@/assets/images/default-avatar.png')} // Asegúrate de tener esta imagen o usa una URL
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
                        <ThemedText style={styles.profileEmail}>{user?.email}</ThemedText>
                        <TouchableOpacity style={styles.editProfileButton}>
                            <ThemedText style={styles.editProfileText}>Editar perfil</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="rocket-outline" size={20} color="#1A365D" />
                        <ThemedText style={styles.menuItemText}>Suscripción</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={20} color="#1A365D" />
                        <ThemedText style={styles.menuItemText}>Configuración</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="stats-chart-outline" size={20} color="#1A365D" />
                        <ThemedText style={styles.menuItemText}>Mis estadísticas</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Version and Logout */}
                <View style={styles.footer}>
                    <ThemedText style={styles.version}>Versión 0.0.0.1</ThemedText>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#1A365D" />
                        <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
                    </TouchableOpacity>
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
        backgroundColor: '#CEEDFF',
        paddingTop: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A365D',
    },
    headerTitle: {
        fontSize: 20,
        color: '#1A365D',
        fontWeight: '800',
        fontFamily: 'Inter',
    },
    closeButton: {
        padding: 8,
    },
    visualizationsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        position: 'absolute',
        right: 16,
        top: 60,
    },
    visualizationsText: {
        fontSize: 16,
        color: '#2A69AC',
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    profileSection: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 32,
        backgroundColor: '#E0E0E0',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        color: '#1A365D',
        fontWeight: '800',
        fontFamily: 'Inter',
    },
    profileEmail: {
        fontSize: 12,
        color: '#1A365D',
        fontFamily: 'Inter',
        marginBottom: 8,
    },
    editProfileButton: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#1A365D',
    },
    editProfileText: {
        fontSize: 12,
        color: '#1A365D',
        fontFamily: 'Inter',
        fontWeight: '800',
    },
    menuItems: {
        padding: 16,
        gap: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 14,
        color: '#1A365D',
        fontFamily: 'Inter',
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        gap: 16,
    },
    version: {
        fontSize: 12,
        color: '#666666',
        fontFamily: 'Inter',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 54,
    },
    logoutText: {
        fontSize: 14,
        color: '#1A365D',
        fontFamily: 'Inter',
        fontWeight:800
    },
}); 
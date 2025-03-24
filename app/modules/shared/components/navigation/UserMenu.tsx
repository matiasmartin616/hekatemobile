import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { Menu, MenuDivider } from 'react-native-material-menu';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@shared/context/AuthContext';
import ThemedText from '../ThemedText';
import useThemeColor from '@shared/hooks/useThemeColor';

interface UserMenuProps {
    onMenuPress: () => void;
}

export default function UserMenu({ onMenuPress }: UserMenuProps) {
    const [visible, setVisible] = useState(false);
    const { user, logout } = useAuth();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const handleLogout = async () => {
        hideMenu();
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Side Menu Button */}
            <TouchableOpacity 
                onPress={onMenuPress} 
                style={styles.sideMenuButton}
            >
                <Ionicons name="menu-outline" size={24} color={textColor} />
            </TouchableOpacity>

            {/* User Menu */}
            <Menu
                visible={visible}
                anchor={
                    <TouchableOpacity onPress={showMenu} style={styles.userMenuButton}>
                        <Ionicons name="person-circle-outline" size={24} color={textColor} />
                        <ThemedText style={styles.username} numberOfLines={1}>
                            {user?.name || 'Usuario'}
                        </ThemedText>
                    </TouchableOpacity>
                }
                onRequestClose={hideMenu}
                style={[styles.menu, { backgroundColor }]}
            >
                <View style={styles.menuContent}>
                    <ThemedText style={styles.menuHeader}>{user?.email}</ThemedText>
                    <MenuDivider />
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color={textColor} />
                        <ThemedText style={styles.menuItemText}>Cerrar sesión</ThemedText>
                    </TouchableOpacity>
                </View>
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    sideMenuButton: {
        padding: 8,
    },
    userMenuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    username: {
        marginLeft: 8,
        fontSize: 16,
        maxWidth: 120,
    },
    menu: {
        marginTop: Platform.OS === 'ios' ? 45 : 35,
        borderRadius: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    menuContent: {
        padding: 8,
        minWidth: 200,
    },
    menuHeader: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemText: {
        marginLeft: 12,
        fontSize: 16,
    },
});
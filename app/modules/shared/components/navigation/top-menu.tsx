import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Platform, Image } from 'react-native';
import { Menu, MenuDivider } from 'react-native-material-menu';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import ThemedText from '../themed-text';
import ThemedView from '../themed-view';
import useThemeColor from '@/app/modules/shared/hooks/use-theme-color';

interface TopMenuProps {
    onMenuPress: () => void;
}

export default function TopMenu({ onMenuPress }: TopMenuProps) {
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
        <ThemedView style={styles.mainContainer}>


            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onMenuPress}
                    style={styles.menuButton}
                >
                    <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Image
                    source={require('@/assets/images/logo-hekate-circle.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity onPress={showMenu} style={styles.userButton}>
                            <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                    style={{ ...styles.menu, backgroundColor }}
                >
                    <View style={styles.menuContent}>
                        <ThemedText style={styles.menuName}>{user?.name || 'Usuario'}</ThemedText>
                        <ThemedText style={styles.menuEmail}>{user?.email}</ThemedText>
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 80 : 40,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#1253AA',
    },
    menuButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: 'center',
        position: 'absolute',
        left: '50%',
        marginLeft: -20,
        top: 70,
    },
    userButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
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
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    menuEmail: {
        fontSize: 14,
        color: '#666666',
        paddingVertical: 4,
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
import React from 'react';
import { TouchableOpacity, View, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../themed-text';
import ThemedView from '../themed-view';
import colors from '@/app/modules/shared/theme/theme';
import useVisualizationsCount from '@/app/modules/dreams/hooks/use-visualizations-count';

interface TopMenuProps {
    onMenuPress: () => void;
}

export default function TopMenu({ onMenuPress }: TopMenuProps) {
    const { totalCount, isLoading } = useVisualizationsCount();

    // Format the number with thousands separator
    const formattedCount = totalCount.toLocaleString();

    return (
        <ThemedView style={styles.mainContainer}>
            <View style={styles.header}>
                {/* Botón de menú */}
                <TouchableOpacity
                    onPress={onMenuPress}
                    style={styles.menuButton}
                >
                    <Ionicons name="menu-outline" size={24} color="#2A69AC" />
                </TouchableOpacity>

                {/* Logo y texto central */}
                <View style={styles.centerContainer}>
                    <Image
                        source={require('@/assets/images/logo-hekate-circle.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <ThemedText style={styles.logoText}>Hekate</ThemedText>
                </View>

                {/* Contador de visualizaciones */}
                <View style={styles.visualizationsContainer}>
                    <Ionicons name="star-outline" size={20} color="#2A69AC" />
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#2A69AC" />
                    ) : (
                        <ThemedText style={styles.visualizationsText}>{formattedCount}</ThemedText>
                    )}
                </View>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: colors.light.palette.blue[100],
    },
    menuButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontSize: 16,
        color: colors.light.neutral.black,
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    visualizationsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    visualizationsText: {
        fontSize: 16,
        color: colors.light.palette.blue[500],
        fontFamily: 'Inter',
        fontWeight: '500',
    },
});
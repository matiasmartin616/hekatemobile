import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';
import colors from '@/app/modules/shared/constants/Colors';
interface InspirationCardProps {
    message: string;
    date: string;
    onShare?: () => void;
}

export default function InspirationCard({ message, date, onShare }: InspirationCardProps) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.contentRow}>
                <View style={styles.sunIcon}>
                    <Ionicons name="partly-sunny-outline" size={28} color="#FFE066" />
                </View>
                <View style={styles.textColumn}>
                    <ThemedText style={styles.date}>{date}</ThemedText>
                    <ThemedText style={styles.message}>{message}</ThemedText>
                </View>
                <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                    <Ionicons name="share-outline" size={22} color="#4A90E2" />
                </TouchableOpacity>
            </View>
            <View style={styles.triangleBorder} />
            <View style={styles.trianglePointer} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.yellow[50],
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        width: '100%',
        borderWidth: 2,
        borderColor: colors.blue[200],
    },
    contentRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 0,
        maxHeight: 70,
        gap: 18,
    },
    sunIcon: {
        marginRight: 0,
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dateMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 15,
        color: colors.gray[900],
        fontWeight: 'bold',
    },
    message: {
        fontSize: 18,
        color: colors.gray[900],
        lineHeight: 24,
        marginTop: 2,
    },
    actionButton: {
        padding: 4,
        alignSelf: 'center',
    },
    triangleBorder: {
        position: 'absolute',
        bottom: -12,
        left: '50%',
        marginLeft: -12,
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.blue[200],
        zIndex: 1,
    },
    trianglePointer: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        marginLeft: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFDE4',
        zIndex: 2,
    },
}); 
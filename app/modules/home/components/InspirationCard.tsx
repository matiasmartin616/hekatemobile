import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';

interface InspirationCardProps {
    message: string;
    onShare?: () => void;
    onArchive?: () => void;
}

export default function InspirationCard({ message, onShare, onArchive }: InspirationCardProps) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="sunny" size={32} color="#FFB800" />
                </View>
                <View style={styles.messageContainer}>
                    <ThemedText style={styles.message}>{message}</ThemedText>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onArchive} style={styles.actionButton}>
                    <Ionicons name="bookmark-outline" size={20} color="#666666" />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fffbeb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        flex: 1,
    },
    message: {
        fontSize: 15,
        color: '#333333',
        lineHeight: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    actionButton: {
        padding: 4,
        marginLeft: 16,
    },
}); 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../shared/constants/Colors';

interface DailyReadNotificationButtonProps {
    onNewReading?: () => void;
    onReadNow?: () => void;
}

export default function DailyReadNotificationButton({ onNewReading, onReadNow }: DailyReadNotificationButtonProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="book-outline" size={20} color="#17457B" style={styles.icon} />
            <Text style={styles.leftButtonText}>¡Nueva lectura del día!</Text>
            <TouchableOpacity style={styles.rightButton} onPress={onReadNow}>
                <Ionicons name="eye-outline" size={18} color="#17457B" style={styles.icon} />
                <Text style={styles.rightButtonText}>Leer ahora</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.blue[50],
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        borderWidth: 2,
        borderColor: colors.blue[100],
    },
    leftButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flex: 1,
    },
    rightButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.blue[500],
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 6,
    },
    leftButtonText: {
        color: colors.blue[500],
        fontWeight: 'bold',
        fontSize: 15,
    },
    rightButtonText: {
        color: colors.blue[500],
        fontWeight: 'bold',
        fontSize: 13,
    },
}); 
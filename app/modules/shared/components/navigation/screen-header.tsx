import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../themed-text';
import ThemedView from '../themed-view';
import colors from '@/app/modules/shared/theme/theme';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function ScreenHeader({ title, showBackButton = false, onBack }: ScreenHeaderProps) {
  return (
    <ThemedView style={styles.mainContainer}>
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.light.palette.blue[700]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.rightSpace} />
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
  backButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.palette.blue[700],
    fontFamily: 'Inter',
  },
  rightSpace: {
    width: 40,
  },
}); 
import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';

interface BackButtonProps {
  onPress?: () => void;
  text?: string;
  route?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A reusable back button component that can be positioned at the bottom of the screen
 */
export default function BackButton({
  onPress,
  text = 'Volver',
  route = '/(routes)/(public)/auth/welcome',
  style,
  textStyle,
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (route) {
      // For routing, ensure we're using the proper format
      router.replace(route as any);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={handlePress}
    >
      <ThemedText style={[styles.backButtonText, textStyle]}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  backButtonText: {
    color: '#000000EB',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
}); 
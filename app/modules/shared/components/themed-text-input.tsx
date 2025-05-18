import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';

interface ThemedTextInputProps extends TextInputProps {
  isDark?: boolean;
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  isDark = false,
  style,
  placeholderTextColor,
  ...restProps
}) => {
  const defaultColor = isDark ? '#FFFFFF' : '#000000';
  const defaultPlaceholderColor = isDark ? '#BBBBBB' : '#999999';

  return (
    <TextInput
      style={[
        styles.input,
        { color: defaultColor },
        style,
      ]}
      placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
      selectionColor="#4A90E2"
      {...restProps}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    marginBottom: 12,
  },
});

export default ThemedTextInput; 
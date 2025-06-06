import { View, type ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useEffect } from 'react';
import useTheme from '@/app/modules/shared/theme/useTheme';

// Tipo que excluye backgroundColor de ViewStyle
type ViewStyleWithoutBackground = Omit<ViewStyle, 'backgroundColor'>;

// Tipo para el style prop que no permite backgroundColor
type StylePropWithoutBackground = StyleProp<ViewStyleWithoutBackground>;

export type ThemedViewProps = Omit<ViewProps, 'style'> & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'main' | 'secondary' | 'tertiary' | 'quaternary';
  style?: StylePropWithoutBackground;
};

export default function ThemedView({ style, lightColor, darkColor, variant, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  const mappedVariant = variant ? variant : 'main';
  const backgroundColor = colors.light.background[mappedVariant];

  // Verificación en desarrollo para alertar sobre backgroundColor en estilos
  if (process.env.NODE_ENV === 'development') {
    try {
      const flattenedStyle = StyleSheet.flatten(style);
      if (flattenedStyle && 'backgroundColor' in flattenedStyle) {
        console.warn(
          'ThemedView: backgroundColor detected in style prop. ' +
          'This will be ignored. Use variant prop instead to set background color.'
        );
      }
    } catch (e) {
      // Ignorar errores de aplanamiento
    }
  }

  // Eliminar cualquier backgroundColor de los estilos en runtime
  let filteredStyle = style;
  try {
    const flattenedStyle = StyleSheet.flatten(style);
    if (flattenedStyle && 'backgroundColor' in flattenedStyle) {
      const { backgroundColor: _, ...rest } = flattenedStyle;
      filteredStyle = rest;
    }
  } catch (e) {
    // Si no se puede aplanar, mantener el estilo original
  }

  return <View style={[{ backgroundColor }, filteredStyle]} {...otherProps} />;
}

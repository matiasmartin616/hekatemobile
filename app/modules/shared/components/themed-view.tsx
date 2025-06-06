import { View, type ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import useTheme from '@/app/modules/shared/theme/useTheme';

type ViewStyleWithoutBackground = Omit<ViewStyle, 'backgroundColor'>;

type StylePropWithoutBackground = StyleProp<ViewStyleWithoutBackground>;

export type ThemedViewProps = Omit<ViewProps, 'style'> & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'main' | 'secondary' | 'tertiary' | 'quaternary' | 'lightYellow';
  style?: StylePropWithoutBackground;
};

export default function ThemedView({ style, lightColor, darkColor, variant, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  const mappedVariant = variant ? variant : 'main';
  const backgroundColor = colors.light.background[mappedVariant];

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
      //ignore error
    }
  }

  let filteredStyle = style;
  try {
    const flattenedStyle = StyleSheet.flatten(style);
    if (flattenedStyle && 'backgroundColor' in flattenedStyle) {
      const { backgroundColor: _, ...rest } = flattenedStyle;
      filteredStyle = rest;
    }
  } catch (e) {
  }

  return <View style={[{ backgroundColor }, filteredStyle]} {...otherProps} />;
}

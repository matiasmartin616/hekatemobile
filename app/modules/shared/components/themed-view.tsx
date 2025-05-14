import { View, type ViewProps } from 'react-native';

import useTheme from '@/app/modules/shared/theme/useTheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  const backgroundColor = colors.light.palette.blue[100];

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

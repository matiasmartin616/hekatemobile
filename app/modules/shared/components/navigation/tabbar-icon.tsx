// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { Image, StyleSheet } from 'react-native';

interface TabBarIconProps {
  imageName: string;
  color: string;
  style?: any;
}

export default function TabBarIcon({ imageName, color, style }: TabBarIconProps) {
  return (
    <Image
      source={imageName}
      style={[
        styles.icon,
        {
          tintColor: '#4299E1',
        },
        style
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  }
});

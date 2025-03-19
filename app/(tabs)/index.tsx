import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '../modules/shared/components/HelloWave';
import ParallaxScrollView from '../modules/shared/components/ParallaxScrollView';
import { ThemedText } from '../modules/shared/components/ThemedText';
import { ThemedView } from '../modules/shared/components/ThemedView';
import Home from '../modules/home';

export default function HomeTab() {
  return  (
    <Home />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

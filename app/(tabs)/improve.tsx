import { StyleSheet, View } from 'react-native';
import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';

export default function ImproveScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.text}>
          Sección mejora tu vida
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 
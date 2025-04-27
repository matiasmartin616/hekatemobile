import { StyleSheet, View } from 'react-native';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';

export default function ReadingScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.text}>
          Lectura
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
    color: '#000000',
  },
}); 
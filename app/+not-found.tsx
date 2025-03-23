import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import ThemedText from '@shared/components/ThemedText';
import ThemedView from '@shared/components/ThemedView';

export default function NotFoundScreen() {
  console.log('NotFoundScreen iniciando');
  return (
    <>
      <Stack.Screen options={{ title: 'Ruta no encontrada' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Esta página no existe.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Volver a la página principal</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

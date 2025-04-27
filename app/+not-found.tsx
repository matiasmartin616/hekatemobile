import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedView from '@/app/modules/shared/components/themed-view';

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

import { Redirect } from 'expo-router';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native';

export default function EntryPoint() {
  const { user, isLoading } = useAuth();

  console.log('EntryPoint', user);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  }

  return (
    <Redirect
      href={user ? "/(routes)/(private)/(tabs)" : "/(routes)/(public)/auth/welcome"}
    />
  );
}

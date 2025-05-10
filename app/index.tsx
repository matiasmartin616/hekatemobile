import { Redirect } from 'expo-router';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native';
import colors from '@/app/modules/shared/theme/theme';

export default function EntryPoint() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.light.palette.blue[500]} />
    </View>
  }

  return (
    <Redirect
      href={user ? "/(routes)/(private)/(tabs)" : "/(routes)/(public)/auth/welcome"}
    />
  );
}

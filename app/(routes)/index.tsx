import { Redirect } from 'expo-router';
import { useAuth } from '@shared/context/AuthContext';

export default function RoutesIndex() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(routes)/auth/welcome"} />;
} 
import HomeScreen from '@modules/home/screens/home';
import { useAuth } from '@/app/modules/shared/context/auth-context';
export default function HomeTab() {
  const { user } = useAuth();
  return (
    <HomeScreen />
  );
}

import { StyleSheet, View } from 'react-native';
import DailyReadingScreen from '@/app/modules/reading/screens/daily-reading-screen';
export default function ReadingScreen() {
  return (
    <DailyReadingScreen />
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
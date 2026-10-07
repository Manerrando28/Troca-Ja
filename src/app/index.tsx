import { Redirect } from 'expo-router';
import { useApp } from '@/state/AppProvider';

export default function Index() {
  const { userId } = useApp();
  return <Redirect href={userId ? '/(tabs)' : '/(auth)/login'} />;
}

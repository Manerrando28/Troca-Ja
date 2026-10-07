import { View } from 'react-native';
import { Colors } from '@/tokens/theme';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AppProvider, useApp } from '@/state/AppProvider';
SplashScreen.preventAutoHideAsync().catch(() => {});
function Navigation() {
  const { userId } = useApp();
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Protected guard={!userId}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack.Protected>
    <Stack.Protected guard={!!userId}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ title: 'Conversa' }} />
    </Stack.Protected>
  </Stack>;
}
export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync().catch(() => {}); }, [loaded, error]);
  if (!loaded && !error) return null;
  return <SafeAreaProvider><AppProvider><View style={{ flex: 1, backgroundColor: Colors.canvas }}><View style={{ flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center', overflow: 'hidden' }}><Navigation /></View></View></AppProvider></SafeAreaProvider>;
}

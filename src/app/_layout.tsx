import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      {/* Grupo de autenticação — sem header */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Grupo de tabs — sem header (cada tela controla o seu) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Tela de Chat — header será configurado na própria tela */}
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
}

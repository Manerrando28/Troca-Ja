import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: "Início" }} />
      <Stack.Screen name="feed" options={{ title: "Feed" }} />
      <Stack.Screen name="explore" options={{ title: "Explorar" }} />
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
    </Stack>
  );
}


import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "../../tokens/theme";



export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 0,

          paddingTop: 6,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/ui-images/home.png")}
              tintColor={color}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="trades"
        options={{
          title: "Trocas",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/ui-images/trades.png")}
              tintColor={color}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="negotiations"
        options={{
          title: "Negociações",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/ui-images/negotiations.png")}
              tintColor={color}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/ui-images/profile.png")}
              tintColor={color}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

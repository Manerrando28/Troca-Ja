import { Tabs } from "expo-router";
import { Image } from "react-native";
import { Colors } from "../../tokens/theme";



export default function TabsLayout() {
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

          height: 65,
          paddingTop: 6,
          paddingBottom: 2,
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
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/ui-images/home.png")}
              tintColor={Colors.primary}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="trades"
        options={{
          title: "Trocas",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/ui-images/trades.png")}
              tintColor={Colors.primary}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="negotiations"
        options={{
          title: "Negociações",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/ui-images/negotiations.png")}
              tintColor={Colors.primary}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/ui-images/profile.png")}
              tintColor={Colors.primary}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

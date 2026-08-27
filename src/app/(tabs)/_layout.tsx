import { Tabs } from 'expo-router';
import { Colors } from '@/tokens/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🏠" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trocas',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🔄" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="negotiations"
        options={{
          title: 'Negociações',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🤝" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="👤" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Componente local apenas para ícone emoji no tab bar.
// Não justifica um arquivo separado — é simples e exclusivo deste layout.
function TabIcon({ emoji, color }: { emoji: string; color: any }) {
  const { Text } = require('react-native');
  return (
    <Text style={{ fontSize: 20, color }}>
      {emoji}
    </Text>
  );
}

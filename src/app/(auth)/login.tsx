import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, typography } from '@/tokens/theme';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Autenticação fake: vai direto para as tabs.
    // Futuramente: validar credenciais antes de navegar.
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🔄</Text>
        <Text style={styles.title}>TrocaJá</Text>
        <Text style={styles.subtitle}>
          Troque produtos com pessoas perto de você
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    fontSize: 72,
    marginBottom: Spacing.three,
  },
  title: {
    ...typography.h1,
    color: Colors.surface,
  },
  subtitle: {
    ...typography.body,
    color: Colors.surface,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  actions: {
    gap: Spacing.three,
  },
  button: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.three,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.primary,
  },
});

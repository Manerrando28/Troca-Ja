import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { users, products, CURRENT_USER_ID } from '@/data';
import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';
import ProductCard from '@/components/ProductCard';

/**
 * Profile — tela do perfil do usuário autenticado.
 *
 * Mostra: avatar, nome, username.
 * Lista produtos derivados de `products.filter(p => p.ownerId === CURRENT_USER_ID)`.
 * Botão Sair redireciona para o login.
 */
export default function Profile() {
  const router = useRouter();

  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  // Produtos pertencentes ao currentUser — derivados por ownerId
  const myProducts = products.filter((p) => p.ownerId === CURRENT_USER_ID);

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={myProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Cabeçalho do perfil */}
            <View style={styles.profileHeader}>
              <Avatar name={currentUser.name} size={72} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{currentUser.name}</Text>
                <Text style={styles.profileUsername}>
                  @{currentUser.username}
                </Text>
              </View>
            </View>

            {/* Estatísticas rápidas */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{myProducts.length}</Text>
                <Text style={styles.statLabel}>Produtos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {myProducts.filter((p) => p.availableForTrade).length}
                </Text>
                <Text style={styles.statLabel}>Para troca</Text>
              </View>
            </View>

            {/* Seção de produtos */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meus produtos</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            owner={currentUser}
            onPress={() => {
              // TODO: abrir detalhes do produto para edição
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>
              Você não tem produtos cadastrados.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>🚪 Sair</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  profileInfo: {
    gap: Spacing.half,
  },
  profileName: {
    ...typography.h2,
    color: Colors.text,
  },
  profileUsername: {
    ...typography.body,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: {
    ...typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.three,
  },
  sectionHeader: {
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    gap: Spacing.two,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    marginTop: Spacing.five,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.error,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: 30,
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutText: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.error,
  },
});

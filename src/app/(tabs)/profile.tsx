import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { users, products, CURRENT_USER_ID } from "@/data";
import { Colors, Spacing, typography } from "@/tokens/theme";
import Avatar from "@/components/ui/Avatar";
import ProductCard from "@/components/ProductCard";

/**
 * Profile — tela do perfil do usuário autenticado.
 *
 * Mostra: avatar, nome, username e estatísticas.
 * Lista produtos derivados de `products.filter(p => p.ownerId === CURRENT_USER_ID)`.
 * Botão Sair redireciona para o login.
 */
export default function Profile() {
  const router = useRouter();

  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  // Produtos pertencentes ao currentUser — derivados por ownerId
  const myProducts = products.filter((p) => p.ownerId === CURRENT_USER_ID);

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  const availableForTrade = myProducts.filter(
    (p) => p.availableForTrade,
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={myProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Cabeçalho */}
            <LinearGradient
              colors={["#0049DA", "#0066FF", "#0E99FC"]}
              locations={[0, 0.55, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.profileHeader}
            >
            </LinearGradient>

            {/* Cartão central do perfil */}
            <View style={styles.profileCard}>
              {/* Dados do usuário */}
              <View style={styles.profileMain}>
                <View style={styles.avatarWrapper}>
                  <Avatar name={currentUser.name} size={68} />
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{currentUser.name}</Text>

                  <Text style={styles.profileUsername}>
                    @{currentUser.username}
                  </Text>
                </View>
              </View>

              {/* Estatísticas */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{myProducts.length}</Text>

                  <Text style={styles.statLabel}>Produtos</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                  <Text style={styles.statValue}>{availableForTrade}</Text>

                  <Text style={styles.statLabel}>Para troca</Text>
                </View>
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
    paddingBottom: Spacing.six,
  },

  /*
   * Header azul em degradê.
   */
  profileHeader: {
    marginHorizontal: -Spacing.four,
    marginTop: -Spacing.one,
    paddingTop: Spacing.four,
    paddingBottom: 100,
    alignItems: "center",
  },


  /*
   * Cartão que sobrepõe o gradiente,
   * seguindo o conceito do Figma.
   */
  profileCard: {
    marginTop: -92,
    marginHorizontal: Spacing.four,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingHorizontal: Spacing.three,
    paddingTop: 20,
    paddingBottom: 18,

    shadowColor: "#0066FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.13,
    shadowRadius: 20,

    elevation: 6,
  },

  profileMain: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: Spacing.three,
  },

  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: "#FFFFFF",

    shadowColor: "#0066FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 5,
  },

  profileInfo: {
    flex: 1,
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
    flexDirection: "row",
    width: "100%",
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  stat: {
    flex: 1,
    alignItems: "center",
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
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },

  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
    gap: Spacing.two,
  },

  emptyEmoji: {
    fontSize: 48,
  },

  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: "center",
  },

  footer: {
    marginTop: Spacing.five,
    alignItems: "center",
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
    color: Colors.error,
  },
});

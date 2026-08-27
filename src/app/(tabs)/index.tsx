import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { products, users, negotiations, CURRENT_USER_ID } from '@/data';
import type { Product, Negotiation } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import ProductCard from '@/components/ProductCard';
import ProductTradeModal from '@/components/ProductTradeModal';

/**
 * Home — porta de entrada principal do aplicativo.
 *
 * Mostra produtos disponíveis para troca de outros usuários.
 * Ao tocar em um card: abre o ProductTradeModal.
 * Ao confirmar no modal: cria uma negociação em memória.
 */
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingNegotiations, setPendingNegotiations] =
    useState<Negotiation[]>(negotiations);

  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  // Produtos de outros usuários disponíveis para troca
  const availableProducts = products.filter(
    (p) => p.availableForTrade && p.ownerId !== CURRENT_USER_ID
  );

  // Produtos que pertencem ao currentUser
  const myProducts = products.filter((p) => p.ownerId === CURRENT_USER_ID);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleConfirmTrade = (negotiation: Omit<Negotiation, 'id'>) => {
    const newNegotiation: Negotiation = {
      ...negotiation,
      id: `neg-${Date.now()}`,
    };
    setPendingNegotiations((prev) => [...prev, newNegotiation]);
    setSelectedProduct(null);

    // Futuramente: navegar para a aba de Negociações ou mostrar feedback
  };

  const targetUser = selectedProduct
    ? users.find((u) => u.id === selectedProduct.ownerId) ?? null
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header da tela */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá, {currentUser.name.split(' ')[0]} 👋
          </Text>
          <Text style={styles.subtitle}>
            Produtos disponíveis para troca
          </Text>
        </View>

        {/* Lista de produtos */}
        <FlatList
          data={availableProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const owner = users.find((u) => u.id === item.ownerId)!;
            return (
              <ProductCard
                product={item}
                owner={owner}
                onPress={() => openProduct(item)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔄</Text>
              <Text style={styles.emptyText}>
                Nenhum produto disponível para troca no momento.
              </Text>
            </View>
          }
        />

        {/* Modal de proposta de troca */}
        <ProductTradeModal
          visible={selectedProduct !== null}
          targetProduct={selectedProduct}
          targetUser={targetUser}
          currentUserProducts={myProducts}
          currentUser={currentUser}
          onClose={closeModal}
          onConfirm={handleConfirmTrade}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.half,
  },
  greeting: {
    ...typography.h2,
    color: Colors.text,
  },
  subtitle: {
    ...typography.body,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.two,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
});

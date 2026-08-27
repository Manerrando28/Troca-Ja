import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { users, products, negotiations as mockNegotiations, CURRENT_USER_ID } from '@/data';
import type { Negotiation } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import OfferCard from '@/components/TradeCard'; // We renamed the component internally, kept file

/**
 * Trades — aba de propostas recebidas.
 *
 * Mostra ofertas direcionadas ao currentUser.
 */
export default function Trades() {
  const [negotiationsList, setNegotiationsList] = useState<Negotiation[]>(mockNegotiations);

  // Filtra ofertas pendentes onde o usuário atual é o RECEPTOR
  const incomingOffers = negotiationsList.filter(
    (n) => n.receiverId === CURRENT_USER_ID && n.status === 'pending'
  );

  const handleAccept = (id: string) => {
    setNegotiationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'accepted' } : n))
    );
    Alert.alert('Aceita!', 'A proposta foi aceita. Acesse a aba Negociações para conversar.');
  };

  const handleReject = (id: string) => {
    setNegotiationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'rejected' } : n))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ofertas Recebidas</Text>
          <Text style={styles.subtitle}>
            Propostas de troca para os seus produtos
          </Text>
        </View>

        <FlatList
          data={incomingOffers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const owner = users.find((u) => u.id === item.initiatorId)!;
            const offeredProducts = products.filter((p) =>
              item.offeredProductIds.includes(p.id)
            );
            const requestedProducts = products.filter((p) =>
              item.requestedProductIds.includes(p.id)
            );

            return (
              <OfferCard
                negotiation={item}
                owner={owner}
                offeredProducts={offeredProducts}
                requestedProducts={requestedProducts}
                onAccept={() => handleAccept(item.id)}
                onReject={() => handleReject(item.id)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📬</Text>
              <Text style={styles.emptyText}>
                Nenhuma oferta recebida no momento.
              </Text>
            </View>
          }
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
  title: {
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
  },
});

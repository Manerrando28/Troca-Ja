import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import PageHeader from '@/components/ui/PageHeader';
import { useApp } from '@/state/AppProvider';

import {
  users,
  products,
} from '@/data';

import type { Negotiation } from '@/types';

import {
  Colors,
  Spacing,
  typography,
} from '@/tokens/theme';

import NegotiationCard from '@/components/NegotiationCard';

/**
 * Negotiations — lista de conversas (WhatsApp style).
 *
 * Mostra apenas negociações aceitas.
 */
export default function Negotiations() {
  const router = useRouter();
  const { state: { negotiations, messages }, userId } = useApp();

  // Negociações aceitas onde o currentUser é parte
  const activeChats = negotiations.filter(
    (n) =>
      (n.initiatorId === userId ||
        n.receiverId === userId) &&
      n.status === 'accepted'
  );

  const openChat = (negotiation: Negotiation) => {
    router.push({ pathname: '/chat/[id]', params: { id: negotiation.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <PageHeader title="Conversas" subtitle="Combine os detalhes das propostas aceitas" />

        <FlatList
          data={activeChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const otherUserId =
              item.initiatorId === userId
                ? item.receiverId
                : item.initiatorId;

            const otherUser = users.find(
              (u) => u.id === otherUserId
            )!;

            const offeredProducts = products.filter((p) =>
              item.offeredProductIds.includes(p.id)
            );

            const requestedProducts = products.filter((p) =>
              item.requestedProductIds.includes(p.id)
            );

            // A perspectiva de quem é oferecido/solicitado
            const myOffered =
              item.initiatorId === userId
                ? offeredProducts
                : requestedProducts;

            const theirOffered =
              item.initiatorId === userId
                ? requestedProducts
                : offeredProducts;

            // Encontrar a última mensagem desta negociação
            const negMessages = messages.filter(
              (m) => m.negotiationId === item.id
            );

            const lastMessage =
              negMessages.length > 0
                ? negMessages.sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )[0]
                : undefined;

            return (
              <NegotiationCard
                negotiation={item}
                otherUser={otherUser}
                offeredProducts={myOffered}
                requestedProducts={theirOffered}
                lastMessage={lastMessage}
                onPress={() => openChat(item)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>
                💬
              </Text>

              <Text style={styles.emptyText}>
                Você não tem nenhuma conversa ativa.{'\n'}
                Aceite uma oferta na aba Trocas ou aguarde o aceite da sua proposta.
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

  /*
   * Header com degradê azul suave.
   */
  listContent: {
    paddingTop: 20,
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
    lineHeight: 22,
    paddingHorizontal: Spacing.four,
  },
});

import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import {
  negotiations,
  users,
  products,
  messages,
  CURRENT_USER_ID,
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

  // Negociações aceitas onde o currentUser é parte
  const activeChats = negotiations.filter(
    (n) =>
      (n.initiatorId === CURRENT_USER_ID ||
        n.receiverId === CURRENT_USER_ID) &&
      n.status === 'accepted'
  );

  const openChat = (negotiation: Negotiation) => {
    router.push(`/chat/${negotiation.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View
          style={styles.header}
        >
          <Text style={styles.title}>
            Conversas
          </Text>
        </View>

        <FlatList
          data={activeChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const otherUserId =
              item.initiatorId === CURRENT_USER_ID
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
              item.initiatorId === CURRENT_USER_ID
                ? offeredProducts
                : requestedProducts;

            const theirOffered =
              item.initiatorId === CURRENT_USER_ID
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
                Aceite uma oferta na aba Trocas ou inicie uma na Home.
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
    backgroundColor: Colors.surface,
  },

  container: {
    flex: 1,
  },

  /*
   * Header com degradê azul suave.
   */
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    marginBottom: Spacing.two,
    backgroundImage:
      'linear-gradient(160deg, rgb(0, 73, 218) 0%, rgb(0, 102, 255) 55%, rgb(14, 153, 252) 100%)',
  },

  title: {
    ...typography.h2,
    color: '#FFFFFF',
  },

  listContent: {
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
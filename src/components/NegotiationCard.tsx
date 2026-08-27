import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Negotiation, Product, User, Message } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';

type NegotiationCardProps = {
  negotiation: Negotiation;
  otherUser: User;
  offeredProducts: Product[];
  requestedProducts: Product[];
  lastMessage?: Message;
  onPress: () => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  'cat-1': '💻',
  'cat-2': '🎮',
  'cat-3': '📚',
  'cat-4': '🏃',
};

/**
 * NegotiationCard — exibe um resumo de uma negociação no estilo WhatsApp.
 */
export default function NegotiationCard({
  negotiation,
  otherUser,
  offeredProducts,
  requestedProducts,
  lastMessage,
  onPress,
}: NegotiationCardProps) {
  // Exibição do "assunto" da conversa baseado nos produtos solicitados
  const tradeSubject =
    requestedProducts.length > 0
      ? requestedProducts[0].name
      : offeredProducts[0]?.name ?? 'Troca';

  // Formatação simples de hora se houver mensagem
  let timeStr = '';
  if (lastMessage) {
    const d = new Date(lastMessage.timestamp);
    timeStr = `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Avatar name={otherUser.name} size={50} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.userName} numberOfLines={1}>
            {otherUser.name}
          </Text>
          <Text style={styles.time}>{timeStr}</Text>
        </View>

        <Text style={styles.subject} numberOfLines={1}>
          Troca: {CATEGORY_EMOJI[requestedProducts[0]?.categoryId] ?? ''} {tradeSubject}
        </Text>

        <Text style={styles.messageSnippet} numberOfLines={1}>
          {lastMessage
            ? lastMessage.text
            : negotiation.status === 'pending'
            ? 'Nova oferta recebida!'
            : 'Nenhuma mensagem ainda.'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.three,
    marginBottom: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  cardPressed: {
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.three,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  userName: {
    ...typography.h3,
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: Colors.textMuted,
    marginLeft: Spacing.two,
  },
  subject: {
    ...typography.caption,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  messageSnippet: {
    ...typography.body,
    color: Colors.textMuted,
  },
});

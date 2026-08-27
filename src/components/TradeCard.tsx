import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Negotiation, Product, User } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';

type OfferCardProps = {
  negotiation: Negotiation;
  owner: User;
  offeredProducts: Product[];
  requestedProducts: Product[];
  onAccept: () => void;
  onReject: () => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  'cat-1': '💻',
  'cat-2': '🎮',
  'cat-3': '📚',
  'cat-4': '🏃',
};

/**
 * OfferCard — exibe uma oferta de troca recebida.
 */
export default function OfferCard({
  negotiation,
  owner,
  offeredProducts,
  requestedProducts,
  onAccept,
  onReject,
}: OfferCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar name={owner.name} size={40} />
        <View style={styles.headerText}>
          <Text style={styles.ownerName}>{owner.name}</Text>
          <Text style={styles.ownerUsername}>@{owner.username}</Text>
        </View>
      </View>

      <View style={styles.tradeContainer}>
        <View style={styles.tradeSide}>
          <Text style={styles.tradeLabel}>Oferece</Text>
          {offeredProducts.map((p) => (
            <Text key={p.id} style={styles.productName} numberOfLines={1}>
              {CATEGORY_EMOJI[p.categoryId] ?? '📦'} {p.name}
            </Text>
          ))}
        </View>

        <Text style={styles.arrow}>↔</Text>

        <View style={[styles.tradeSide, styles.tradeSideRight]}>
          <Text style={[styles.tradeLabel, styles.tradeLabelRight]}>Em troca do seu</Text>
          {requestedProducts.map((p) => (
            <Text key={p.id} style={[styles.productName, styles.productNameRight]} numberOfLines={1}>
              {p.name} {CATEGORY_EMOJI[p.categoryId] ?? '📦'}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.rejectButton]} onPress={onReject}>
          <Text style={[styles.buttonText, styles.rejectText]}>Recusar</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.acceptButton]} onPress={onAccept}>
          <Text style={[styles.buttonText, styles.acceptText]}>Aceitar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerText: {
    gap: 2,
  },
  ownerName: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  ownerUsername: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  tradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.two,
    borderRadius: 8,
    marginTop: Spacing.one,
  },
  tradeSide: {
    flex: 1,
    gap: Spacing.half,
  },
  tradeSideRight: {
    alignItems: 'flex-end',
  },
  tradeLabel: {
    ...typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tradeLabelRight: {
    textAlign: 'right',
  },
  productName: {
    ...typography.body,
    color: Colors.text,
  },
  productNameRight: {
    textAlign: 'right',
  },
  arrow: {
    fontSize: 20,
    color: Colors.textMuted,
    marginHorizontal: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  rejectButton: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  rejectText: {
    color: Colors.textMuted,
  },
  acceptButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  acceptText: {
    color: Colors.surface,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
  },
});

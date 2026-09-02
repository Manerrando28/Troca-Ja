import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Product, User } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import { Image } from 'react-native';

type ProductCardProps = {
  product: Product;
  owner: User;
  onPress: () => void;
};

// Mapa de categoria para emoji representativo
const CATEGORY_EMOJI: Record<string, string> = {
  'cat-1': '💻',
  'cat-2': '🎮',
  'cat-3': '📚',
  'cat-4': '🏃',
};

/**
 * ProductCard — exibe um produto disponível para troca.
 *
 * Recebe product, owner e onPress.
 * Não decide o que acontece ao pressionar — a tela decide.
 * Não possui botão "Negociar" — a única ação é abrir o detalhe/modal.
 */
export default function ProductCard({ product, owner, onPress }: ProductCardProps) {
  const emoji = CATEGORY_EMOJI[product.categoryId] ?? '📦';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {/* Imagem / placeholder visual */}
      <View style={styles.imagePlaceholder}>
        <Image 
        source={product.image}
        style={styles.image}></Image>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.ownerRow}>
          <Text style={styles.ownerLabel}>por </Text>
          <Text style={styles.ownerName}>{owner.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  info: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  name: {
    ...typography.h3,
    color: Colors.text,
  },
  description: {
    ...typography.body,
    color: Colors.textMuted,
  },
  ownerRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
  },
  ownerLabel: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  ownerName: {
    ...typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },
});

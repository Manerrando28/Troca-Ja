import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Product, User } from '@/types';
import { Colors, Fonts, typography } from '@/tokens/theme';
import InteractivePressable from '@/components/ui/InteractivePressable';
type Props = { product: Product; owner: User; onPress: () => void };
export default function ProductCard({ product, owner, onPress }: Props) {
  return <InteractivePressable accessibilityRole="button" accessibilityLabel={`Ver ${product.name}`} onPress={onPress}
    lift={3} hoverStyle={styles.hovered}
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}>
    <View style={styles.picture}>
      {product.image ? <Image source={product.image} accessibilityLabel={product.name} style={styles.image} resizeMode="contain" />
        : <Feather name={product.name.includes('Câmera') ? 'camera' : product.categoryId === 'cat-2' ? 'monitor' : 'package'} size={34} color={Colors.primary} />}
    </View>
    <View style={styles.info}>
      <Text style={styles.badge}>{product.availableForTrade ? 'DISPONÍVEL PARA TROCA' : 'INDISPONÍVEL'}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
      <View style={styles.owner}><Feather name="user" size={12} color={Colors.textMuted} /><Text style={styles.ownerText}>{owner.name}</Text></View>
    </View>
  </InteractivePressable>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, backgroundColor: Colors.surface, gap: 14, marginBottom: 12 },
  hovered: { borderColor: Colors.primary, backgroundColor: Colors.brandMist },
  picture: { width: 96, minHeight: 116, borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.selected, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', position: 'absolute' }, info: { flex: 1, minWidth: 0, paddingVertical: 3, gap: 5 },
  badge: { fontFamily: Fonts.semibold, fontSize: 8, letterSpacing: 0.6, color: Colors.accent },
  name: { fontFamily: Fonts.semibold, fontSize: 15, lineHeight: 20, color: Colors.text },
  description: { ...typography.caption, color: Colors.textMuted, lineHeight: 17 },
  owner: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }, ownerText: { ...typography.caption, fontSize: 11, color: Colors.textMuted },
});

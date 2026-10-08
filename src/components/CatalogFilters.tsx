import { View, Text, StyleSheet } from 'react-native';
import type { Category } from '@/types';
import type { ProductFilter } from '@/domain/trades';
import { Colors, Spacing, typography, Radius } from '@/tokens/theme';
import InteractivePressable from '@/components/ui/InteractivePressable';
const filters: { id: ProductFilter; name: string }[] = [
  { id: null, name: 'Todos' }, { id: 'today', name: 'Lançados hoje' },
  { id: 'featured', name: 'Destaques' }, { id: 'trusted', name: 'Usuários confiáveis' },
];
type Props = { categories: Category[]; categoryId: string | null; filter: ProductFilter;
  onCategory: (id: string | null) => void; onFilter: (filter: ProductFilter) => void };
export default function CatalogFilters({ categories, categoryId, filter, onCategory, onFilter }: Props) {
  return <View style={styles.container}>
    <Text style={styles.title}>Categorias</Text>
    <View style={styles.row}>
      {[{ id: null, name: 'Todas' }, ...categories].map(category => <Chip key={category.id ?? 'all'}
        label={category.name} selected={categoryId === category.id} onPress={() => onCategory(category.id)} />)}
    </View>
    <Text style={styles.title}>Explorar</Text>
    <View style={styles.row}>
      {filters.map(item => <Chip key={item.id ?? 'all'} label={item.name} selected={filter === item.id}
        onPress={() => onFilter(item.id)} />)}
    </View>
  </View>;
}
function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <InteractivePressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
    hoverStyle={selected ? undefined : styles.hovered}
    style={[styles.chip, selected && styles.selected]}>
    <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
  </InteractivePressable>;
}
const styles = StyleSheet.create({
  container: { gap: Spacing.two }, row: { gap: 7, flexDirection: 'row', flexWrap: 'wrap' },
  title: { ...typography.caption, fontWeight: '600', color: Colors.textMuted },
  chip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 12,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  hovered: { backgroundColor: Colors.selected, borderColor: Colors.primary },
  text: { ...typography.caption, color: Colors.secondaryText }, selectedText: { color: Colors.surface },
});

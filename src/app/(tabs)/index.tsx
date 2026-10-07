import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { users } from '@/data';
import type { Product, Negotiation } from '@/types';
import { useApp } from '@/state/AppProvider';
import { filterProducts, type ProductFilter } from '@/domain/trades';
import { Colors, Spacing, typography } from '@/tokens/theme';
import ProductCard from '@/components/ProductCard';
import ProductTradeModal from '@/components/ProductTradeModal';
import CatalogFilters from '@/components/CatalogFilters';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Notice from '@/components/ui/Notice';
import Button from '@/components/ui/Button';

export default function Home() {
  const { userId, propose, products, categories, catalogStatus, catalogError, retryCatalog } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>(null);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const currentUser = users.find(u => u.id === userId);
  if (!currentUser) return null;
  const filtered = filterProducts(products, users, currentUser.id, categoryId, filter, query);
  function confirm(negotiation: Omit<Negotiation, 'id'>) {
    try {
      propose(negotiation);
      setSelectedProduct(null);
      setNotice('Proposta enviada! Acompanhe o status na aba Trocas.');
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar a proposta.');
    }
  }
  return <SafeAreaView style={styles.screen} edges={['top']}>
    <FlatList data={filtered} keyExtractor={item => item.id} contentContainerStyle={styles.list}
      ListHeaderComponent={<>
        <PageHeader title={`Olá, ${currentUser.name.split(' ')[0]}`} subtitle="Dê uma nova história aos seus produtos." />
        <View style={styles.controls}>
          <View style={[styles.searchBox, searchFocused && { borderColor: Colors.primary }]}><Feather name="search" size={19} color={Colors.textMuted} /><TextInput accessibilityLabel="Buscar produtos" placeholder="Buscar produtos" value={query}
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            onChangeText={setQuery} style={styles.search} placeholderTextColor={Colors.textMuted} /></View>
          <CatalogFilters categories={categories} categoryId={categoryId} filter={filter}
            onCategory={setCategoryId} onFilter={setFilter} />
          <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? 'produto disponível' : 'produtos disponíveis'}</Text>
          {catalogStatus === 'loading' && <Notice message="Carregando produtos do Supabase…" />}
          {catalogStatus === 'error' && <><Notice error message={catalogError ?? 'Falha no catálogo.'} />
            <Button title="Tentar novamente" variant="secondary" onPress={retryCatalog} /></>}
          {!!notice && <Notice message={notice} />}
        </View>
      </>}
      renderItem={({ item }) => <View style={styles.item}><ProductCard product={item}
        owner={users.find(u => u.id === item.ownerId)!}
        onPress={() => { setError(''); setSelectedProduct(item); }} /></View>}
      ListEmptyComponent={catalogStatus === 'loading' || catalogStatus === 'error' ? null :
        <EmptyState message={catalogStatus === 'connected' && products.length === 0
          ? 'Nenhum produto cadastrado. Volte mais tarde para ver novos produtos.'
          : 'Nenhum produto encontrado. Altere a busca ou limpe os filtros.'} />} />
    {selectedProduct && <ProductTradeModal key={selectedProduct.id} visible targetProduct={selectedProduct}
      targetUser={users.find(u => u.id === selectedProduct.ownerId) ?? null}
      currentUserProducts={products.filter(p => p.ownerId === currentUser.id)} currentUser={currentUser}
      onClose={() => setSelectedProduct(null)} onConfirm={confirm} error={error} />}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: Spacing.four },
  controls: { padding: 20, gap: 18 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 14 },
  search: { flex: 1, minWidth: 0, outlineStyle: 'solid', outlineWidth: 0, ...typography.body, minHeight: 48, paddingVertical: 14, borderRadius: 12,
    color: Colors.secondaryText, backgroundColor: Colors.surface, borderWidth: 0 },
  count: { ...typography.body, color: Colors.text },
  item: { paddingHorizontal: 20 },
});

import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { users } from '@/data';
import { useApp } from '@/state/AppProvider';
import { Colors, Spacing, typography } from '@/tokens/theme';
import OfferCard from '@/components/TradeCard';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Notice from '@/components/ui/Notice';
import Button from '@/components/ui/Button';
const statusLabels = { pending: 'Aguardando resposta', accepted: 'Aceita — chat disponível', rejected: 'Recusada', cancelled: 'Cancelada' };
export default function Trades() {
  const { state, products, userId, respond } = useApp();
  const [notice, setNotice] = useState('');
  const [error, setError] = useState(false);
  const mine = state.negotiations.filter(n => n.receiverId === userId || n.initiatorId === userId).slice().reverse();
  function update(id: string, status: 'accepted' | 'rejected' | 'cancelled') {
    try { respond(id, status); setError(false); setNotice(status === 'accepted'
      ? 'Proposta aceita. A conversa já está disponível na aba Negociações.' : 'Status da proposta atualizado.'); }
    catch (cause) { setError(true); setNotice(cause instanceof Error ? cause.message : 'Não foi possível atualizar.'); }
  }
  return <SafeAreaView style={styles.screen} edges={['top']}>
    <PageHeader title="Suas trocas" subtitle="Propostas recebidas, enviadas e histórico" />
    {!!notice && <Notice message={notice} error={error} />}
    <FlatList data={mine} keyExtractor={item => item.id} contentContainerStyle={styles.list}
      ListEmptyComponent={<EmptyState message="Nenhuma proposta ainda. Escolha um produto na Home." />}
      renderItem={({ item }) => {
        const incoming = item.receiverId === userId;
        const other = users.find(u => u.id === (incoming ? item.initiatorId : item.receiverId))!;
        const offered = products.filter(p => item.offeredProductIds.includes(p.id));
        const requested = products.filter(p => item.requestedProductIds.includes(p.id));
        if (incoming && item.status === 'pending') return <OfferCard negotiation={item} owner={other}
          offeredProducts={offered} requestedProducts={requested}
          onAccept={() => update(item.id, 'accepted')} onReject={() => update(item.id, 'rejected')} />;
        return <View style={styles.card}>
          <Text style={styles.title}>{incoming ? 'Recebida de' : 'Enviada para'} {other.name}</Text>
          <Text style={styles.body}>{offered.map(p => p.name).join(', ')} ↔ {requested.map(p => p.name).join(', ')}</Text>
          <Text style={styles.status}>{statusLabels[item.status]}</Text>
          {!incoming && item.status === 'pending' && <Button title="Cancelar proposta" variant="secondary"
            onPress={() => update(item.id, 'cancelled')} />}
        </View>;
      }} />
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background }, list: { padding: Spacing.four },
  card: { backgroundColor: Colors.surface, padding: Spacing.three, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.three, gap: Spacing.two },
  title: { ...typography.body, fontWeight: '600', color: Colors.text }, body: { ...typography.body, color: Colors.secondaryText },
  status: { ...typography.caption, color: Colors.accent, backgroundColor: Colors.accentSoft, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});

import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/state/AppProvider';
import { users } from '@/data';
import type { Product } from '@/types';
import { Colors, Fonts, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';
import ProductCard from '@/components/ProductCard';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
export default function Profile() {
  const { userId, logout, products, catalogStatus } = useApp();
  const [detail, setDetail] = useState<Product | null>(null);
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  const mine = products.filter(p => p.ownerId === userId);
  return <SafeAreaView style={styles.screen} edges={['top']}>
    <ScrollView contentContainerStyle={styles.scroll}>
      <PageHeader title="Meu perfil" subtitle="Seus produtos. Suas próximas trocas." />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.identity}><Avatar name={user.name} size={52} /><View style={styles.userInfo}><Text style={styles.name}>{user.name}</Text><Text style={styles.muted}>@{user.username}</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Sair" onPress={logout} style={styles.logout}><Feather name="log-out" size={20} color={Colors.textMuted} /></Pressable></View>
          <View style={styles.stats}>{[[mine.length, 'produtos'], [mine.filter(p => p.availableForTrade).length, 'disponíveis'], [user.completedTrades, 'trocas feitas']].map(([value, label]) => <View key={label} style={styles.stat}><Text style={styles.number}>{value}</Text><Text style={styles.caption}>{label}</Text></View>)}</View>
        </View>
        <Text style={styles.section}>Meus produtos</Text>
        {mine.map(product => <ProductCard key={product.id} product={product} owner={user} onPress={() => setDetail(product)} />)}
        <View style={styles.connection}><Feather name={catalogStatus === 'connected' ? 'check-circle' : 'database'} size={16} color={Colors.accent} /><Text style={styles.connectionText}>{catalogStatus === 'connected' ? 'Produtos e categorias conectados ao Supabase.' : catalogStatus === 'error' ? 'Não foi possível carregar o catálogo. Tente novamente na Home.' : catalogStatus === 'loading' ? 'Conectando ao catálogo…' : 'Catálogo local de demonstração. Supabase não configurado.'}</Text></View>
        <Button title="Sair da conta" variant="secondary" onPress={logout} />
      </View>
    </ScrollView>
    <Modal visible={!!detail} transparent animationType="fade" onRequestClose={() => setDetail(null)}>
      <View style={styles.overlay}><View style={styles.detail}><Text style={styles.name}>{detail?.name}</Text><Text style={styles.description}>{detail?.description}</Text><Text style={styles.muted}>{detail?.availableForTrade ? 'Disponível para propostas' : 'Indisponível para propostas'}</Text><Button title="Fechar detalhes" onPress={() => setDetail(null)} /></View></View>
    </Modal>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background }, scroll: { paddingBottom: 24 }, content: { padding: 20 },
  card: { backgroundColor: Colors.surface, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: Colors.border },
  identity: { flexDirection: 'row', gap: 12, alignItems: 'center' }, userInfo: { flex: 1 },
  name: { fontFamily: Fonts.semibold, fontSize: 18, color: Colors.text }, muted: { ...typography.caption, color: Colors.textMuted, marginTop: 4 },
  logout: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, marginTop: 18, paddingTop: 18 }, stat: { flex: 1, alignItems: 'center', gap: 4 },
  number: { ...typography.h2, color: Colors.text }, caption: { ...typography.caption, color: Colors.textMuted },
  section: { ...typography.h3, color: Colors.text, marginTop: 24, marginBottom: 14 },
  connection: { flexDirection: 'row', gap: 8, padding: 14, marginBottom: 16, marginTop: 4, borderRadius: 12, backgroundColor: Colors.accentSoft }, connectionText: { ...typography.caption, flex: 1, color: Colors.secondaryText, lineHeight: 18 },
  overlay: { flex: 1, backgroundColor: Colors.backdrop, justifyContent: 'center', alignItems: 'center', padding: 24 }, detail: { width: '100%', maxWidth: 420, padding: 24, borderRadius: 24, backgroundColor: Colors.surface, gap: 18 }, description: { ...typography.body, lineHeight: 23, color: Colors.secondaryText },
});

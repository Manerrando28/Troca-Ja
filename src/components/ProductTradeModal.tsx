import { useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { Product, User, Negotiation } from '@/types';
import { Colors, Fonts, typography } from '@/tokens/theme';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
type Props = { visible: boolean; targetProduct: Product | null; targetUser: User | null;
  currentUserProducts: Product[]; currentUser: User; onClose: () => void;
  onConfirm: (negotiation: Omit<Negotiation, 'id'>) => void; error?: string };
export default function ProductTradeModal({ visible, targetProduct, targetUser, currentUserProducts, currentUser, onClose, onConfirm, error }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  if (!targetProduct || !targetUser) return null;
  const available = currentUserProducts.filter(p => p.availableForTrade);
  function confirm() {
    if (!targetUser || !targetProduct || !selected.length || currentUser.id === targetUser.id) return;
    onConfirm({ initiatorId: currentUser.id, receiverId: targetUser.id, offeredProductIds: selected, requestedProductIds: [targetProduct.id], status: 'pending' });
  }
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}><SafeAreaView style={styles.sheet}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>UMA NOVA POSSIBILIDADE</Text><Text style={styles.title}>Propor troca</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar proposta" onPress={onClose} style={styles.close}><Feather name="x" size={22} color={Colors.textMuted} /></Pressable></View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>VOCÊ RECEBE</Text>
        <View style={styles.target}>
          <View style={styles.thumb}>{targetProduct.image ? <Image source={targetProduct.image} style={styles.image} /> : <Feather name="package" size={28} color={Colors.primary} />}</View>
          <View style={styles.info}><Text style={styles.productName}>{targetProduct.name}</Text><Text style={styles.caption}>de {targetUser.name}</Text></View>
        </View>
        <Text style={styles.description}>{targetProduct.description}</Text>
        <View style={styles.divider}><View style={styles.line} /><Feather name="repeat" size={21} color={Colors.primary} /><View style={styles.line} /></View>
        <Text style={styles.section}>O que você oferece?</Text>
        <Text style={styles.description}>Selecione um ou mais produtos da sua coleção.</Text>
        {available.map(product => {
          const checked = selected.includes(product.id);
          return <Pressable key={product.id} accessibilityRole="checkbox" accessibilityLabel={product.name} accessibilityState={{ checked }}
            onPress={() => setSelected(prev => checked ? prev.filter(id => id !== product.id) : [...prev, product.id])}
            style={[styles.option, checked && styles.optionSelected]}>
            <View style={styles.smallThumb}><Feather name={product.name.includes('Câmera') ? 'camera' : 'package'} size={23} color={Colors.primary} /></View>
            <View style={styles.info}><Text style={styles.productName}>{product.name}</Text><Text style={styles.caption}>Disponível para troca</Text></View>
            <Feather name={checked ? 'check-circle' : 'circle'} size={22} color={checked ? Colors.primary : Colors.textMuted} />
          </Pressable>;
        })}
        {!available.length && <Notice message="Você não tem produtos disponíveis para troca." />}
        {!!selected.length && <View style={styles.summary}><Feather name="check" size={16} color={Colors.accent} /><Text style={styles.summaryText}>{selected.length} {selected.length === 1 ? 'produto selecionado' : 'produtos selecionados'}. A outra pessoa poderá aceitar sua proposta.</Text></View>}
      </ScrollView>
      <View style={styles.footer}>{!!error && <Notice error message={error} />}<Button title={selected.length ? `Propor negociação (${selected.length})` : 'Selecione produtos para oferecer'} onPress={confirm} disabled={!selected.length} /></View>
    </SafeAreaView></View>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.backdrop, justifyContent: 'center', alignItems: 'center', padding: 12 },
  sheet: { width: '100%', maxWidth: 480, maxHeight: '94%', backgroundColor: Colors.surface, borderRadius: 24, overflow: 'hidden', flexShrink: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22, borderBottomWidth: 1, borderBottomColor: Colors.border },
  eyebrow: { fontFamily: Fonts.semibold, fontSize: 9, letterSpacing: 1.2, color: Colors.accent, marginBottom: 6 }, title: { ...typography.h2, color: Colors.text },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: Colors.background },
  content: { padding: 22, gap: 12 }, label: { fontFamily: Fonts.semibold, fontSize: 10, letterSpacing: 1, color: Colors.textMuted },
  target: { flexDirection: 'row', gap: 14, alignItems: 'center' }, thumb: { width: 76, height: 76, borderRadius: 14, backgroundColor: Colors.selected, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, image: { width: '100%', height: '100%' },
  info: { flex: 1, gap: 5 }, productName: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text }, caption: { ...typography.caption, color: Colors.textMuted },
  description: { ...typography.body, color: Colors.textMuted, lineHeight: 21 }, divider: { flexDirection: 'row', gap: 14, alignItems: 'center', marginVertical: 10 }, line: { flex: 1, height: 1, backgroundColor: Colors.border },
  section: { ...typography.h3, color: Colors.text }, option: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border }, optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.selected },
  smallThumb: { width: 42, height: 48, alignItems: 'center', justifyContent: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, backgroundColor: Colors.accentSoft }, summaryText: { ...typography.caption, flex: 1, color: Colors.accent, lineHeight: 18 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border },
});

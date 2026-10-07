from pathlib import Path
root = Path(__file__).resolve().parent.parent
def put(name, text):
    (root / name).write_text(text.strip()+'\n', encoding='utf-8')
def edit(name, fn):
    put(name, fn((root / name).read_text(encoding='utf-8')))

put('src/app/(auth)/login.tsx', '''
import { useState, useRef } from 'react';
import { Image, ScrollView, Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/state/AppProvider';
import { demoAccounts } from '@/domain/auth';
import { Colors, Fonts, typography } from '@/tokens/theme';
import Button from '@/components/ui/Button';
export default function Login() {
  const { userId, login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef<TextInput>(null);
  if (userId) return <Redirect href="/(tabs)" />;
  function submit() {
    try { setError(''); login(email, password); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.'); }
  }
  return <SafeAreaView style={styles.screen}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <Image source={require('../../../assets/ui-images/logo.png')} accessibilityLabel="Logo TrocaJá" style={styles.logo} resizeMode="contain" />
          <Text style={styles.wordmark}>Troca<Text style={styles.blue}>Já</Text></Text>
        </View>
        <Text style={styles.kicker}>MENOS DESPERDÍCIO. MAIS POSSIBILIDADES.</Text>
        <Text accessibilityRole="header" style={styles.heading}>Bom ter você aqui.</Text>
        <Text style={styles.subtitle}>Entre e encontre uma nova história para o que você já tem.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.field}>
            <Feather name="mail" size={19} color={Colors.textMuted} />
            <TextInput accessibilityLabel="E-mail" autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
              autoComplete="email" placeholder="seu@email.com" placeholderTextColor={Colors.textMuted}
              value={email} onChangeText={setEmail} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} style={styles.input} />
          </View>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.field}>
            <Feather name="lock" size={19} color={Colors.textMuted} />
            <TextInput ref={passwordRef} accessibilityLabel="Senha" autoCapitalize="none" autoCorrect={false}
              autoComplete="current-password" secureTextEntry={!visible} placeholder="Digite sua senha"
              placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword}
              returnKeyType="go" onSubmitEditing={submit} style={styles.input} />
            <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
              onPress={() => setVisible(!visible)} style={styles.eye}><Feather name={visible ? 'eye-off' : 'eye'} size={19} color={Colors.textMuted} /></Pressable>
          </View>
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <View style={styles.action}><Button title="Entrar" onPress={submit} /></View>
        </View>
        <View style={styles.demo}>
          <View style={styles.demoTitle}><Feather name="info" size={16} color={Colors.primary} /><Text style={styles.label}>Contas para demonstração</Text></View>
          <Text style={styles.demoDescription}>Digite um dos pares de e-mail e senha abaixo.</Text>
          {demoAccounts.map(account => <View key={account.userId} style={styles.account}>
            <Text style={styles.accountName}>{account.name}</Text>
            <View style={styles.accountDetails}><Text selectable style={styles.credentials}>{account.email}</Text>
              <Text selectable style={styles.password}>Senha: {account.password}</Text></View>
          </View>)}
        </View>
        <Text style={styles.footnote}>Trocas que conectam a comunidade.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  logo: { width: 40, height: 40 }, wordmark: { fontFamily: Fonts.bold, fontSize: 25, color: Colors.navy }, blue: { color: Colors.primary },
  kicker: { fontFamily: Fonts.semibold, fontSize: 9, letterSpacing: 1.4, color: Colors.accent, marginBottom: 10 },
  heading: { fontFamily: Fonts.bold, fontSize: 28, lineHeight: 35, color: Colors.navy },
  subtitle: { ...typography.body, color: Colors.textMuted, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  form: { gap: 8 }, label: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.text },
  field: { minHeight: 52, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingLeft: 14,
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, gap: 10, marginBottom: 8 },
  input: { ...typography.body, color: Colors.text, flex: 1, minWidth: 0, height: 50, outlineWidth: 0, paddingRight: 12 },
  eye: { minWidth: 44, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  action: { marginTop: 4 }, error: { ...typography.caption, color: Colors.error, lineHeight: 18 },
  demo: { marginTop: 26, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background },
  demoTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 }, demoDescription: { ...typography.caption, color: Colors.textMuted, marginTop: 6, marginBottom: 4, lineHeight: 18 },
  account: { paddingTop: 10, marginTop: 8, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', gap: 12, alignItems: 'center' },
  accountName: { fontFamily: Fonts.semibold, fontSize: 12, width: 50, color: Colors.text }, accountDetails: { flex: 1 },
  credentials: { ...typography.caption, color: Colors.secondaryText }, password: { ...typography.caption, color: Colors.textMuted, marginTop: 3 },
  footnote: { ...typography.caption, textAlign: 'center', color: Colors.textMuted, marginTop: 24 },
});
''')

put('src/components/ui/PageHeader.tsx', '''
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, typography } from '@/tokens/theme';
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.header}>
    <View style={styles.brand}><Feather name="repeat" size={15} color={Colors.accent} /><Text style={styles.brandText}>TROCAJÁ</Text><View style={styles.line} /><Text style={styles.community}>sua comunidade</Text></View>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 18 },
  brandText: { fontFamily: Fonts.bold, fontSize: 11, letterSpacing: 1.5, color: Colors.navy },
  line: { width: 1, height: 12, backgroundColor: Colors.border, marginHorizontal: 3 }, community: { ...typography.caption, color: Colors.textMuted },
  title: { fontFamily: Fonts.bold, fontSize: 26, lineHeight: 34, color: Colors.text },
  subtitle: { ...typography.body, color: Colors.textMuted, lineHeight: 21, marginTop: 5 },
});
''')

put('src/components/ProductCard.tsx', '''
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Product, User } from '@/types';
import { Colors, Fonts, typography } from '@/tokens/theme';
type Props = { product: Product; owner: User; onPress: () => void };
export default function ProductCard({ product, owner, onPress }: Props) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${product.name}`} onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}>
    <View style={styles.picture}>
      {product.image ? <Image source={product.image} accessibilityLabel={product.name} style={styles.image} resizeMode="cover" />
        : <Feather name={product.name.includes('Câmera') ? 'camera' : product.categoryId === 'cat-2' ? 'monitor' : 'package'} size={34} color={Colors.primary} />}
    </View>
    <View style={styles.info}>
      <Text style={styles.badge}>{product.availableForTrade ? 'DISPONÍVEL PARA TROCA' : 'INDISPONÍVEL'}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
      <View style={styles.owner}><Feather name="user" size={12} color={Colors.textMuted} /><Text style={styles.ownerText}>{owner.name}</Text></View>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, backgroundColor: Colors.surface, gap: 14, marginBottom: 12 },
  picture: { width: 96, minHeight: 116, borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.selected, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', position: 'absolute' }, info: { flex: 1, minWidth: 0, paddingVertical: 3, gap: 5 },
  badge: { fontFamily: Fonts.semibold, fontSize: 8, letterSpacing: 0.6, color: Colors.accent },
  name: { fontFamily: Fonts.semibold, fontSize: 15, lineHeight: 20, color: Colors.text },
  description: { ...typography.caption, color: Colors.textMuted, lineHeight: 17 },
  owner: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }, ownerText: { ...typography.caption, fontSize: 11, color: Colors.textMuted },
});
''')

put('src/app/(tabs)/profile.tsx', '''
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/state/AppProvider';
import { users, products } from '@/data';
import type { Product } from '@/types';
import { Colors, Fonts, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';
import ProductCard from '@/components/ProductCard';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
export default function Profile() {
  const { userId, logout, catalogStatus } = useApp();
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
        <View style={styles.connection}><Feather name={catalogStatus === 'connected' ? 'check-circle' : 'database'} size={16} color={Colors.accent} /><Text style={styles.connectionText}>{catalogStatus === 'connected' ? 'Categorias conectadas ao Supabase.' : catalogStatus === 'error' ? 'Supabase indisponível. Categorias locais em uso.' : catalogStatus === 'loading' ? 'Conectando ao catálogo…' : 'Catálogo local de demonstração. Supabase não configurado.'}</Text></View>
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
''')

put('src/components/ProductTradeModal.tsx', '''
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
''')

edit('src/app/_layout.tsx', lambda s: s.replace("import { Stack }", "import { View } from 'react-native';\nimport { Colors } from '@/tokens/theme';\nimport { Stack }").replace('<AppProvider><Navigation /></AppProvider>', '<AppProvider><View style={{ flex: 1, backgroundColor: Colors.canvas }}><View style={{ flex: 1, width: \'100%\', maxWidth: 560, alignSelf: \'center\', overflow: \'hidden\' }}><Navigation /></View></View></AppProvider>'))
edit('src/components/CatalogFilters.tsx', lambda s: s.replace('ScrollView, ', '').replace('<ScrollView horizontal contentContainerStyle={styles.row} showsHorizontalScrollIndicator={false}>', '<View style={styles.row}>').replace('</ScrollView>', '</View>').replace("row: { gap: Spacing.two }", "row: { gap: 7, flexDirection: 'row', flexWrap: 'wrap' }").replace('...typography.h3, color: Colors.text', '...typography.caption, fontWeight: \'600\', color: Colors.textMuted').replace('minHeight: 44', 'minHeight: 40').replace('paddingHorizontal: Spacing.three', 'paddingHorizontal: 12').replace('borderRadius: Radius.small', 'borderRadius: Radius.pill'))
edit('src/app/(tabs)/index.tsx', lambda s: s.replace("import { useState }", "import { Feather } from '@expo/vector-icons';\nimport { useState }").replace("} 👋`}", "}`}").replace('<TextInput accessibilityLabel="Buscar produtos"', '<View style={styles.searchBox}><Feather name="search" size={19} color={Colors.textMuted} /><TextInput accessibilityLabel="Buscar produtos"').replace('onChangeText={setQuery} style={styles.search} />', 'onChangeText={setQuery} style={styles.search} placeholderTextColor={Colors.textMuted} /></View>').replace('controls: { padding: Spacing.four, gap: Spacing.three }', 'controls: { padding: 20, gap: 18 }').replace('  search: {', '  searchBox: { flexDirection: \'row\', alignItems: \'center\', gap: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 14 },\n  search: { flex: 1, minWidth: 0, outlineWidth: 0,').replace('borderWidth: 1, borderColor: Colors.border },', 'borderWidth: 0 },').replace('count: { ...typography.h3', 'count: { ...typography.body').replace('paddingHorizontal: Spacing.four },\n});', 'paddingHorizontal: 20 },\n});'))
edit('src/components/NegotiationCard.tsx', lambda s: s.replace("Troca: {CATEGORY_EMOJI[requestedProducts[0]?.categoryId] ?? ''} {tradeSubject}", 'Troca: {tradeSubject}').replace("const CATEGORY_EMOJI: Record<string, string> = {\n  'cat-1': '💻',\n  'cat-2': '🎮',\n  'cat-3': '📚',\n  'cat-4': '🏃',\n};", '').replace('marginBottom: Spacing.one,', 'marginBottom: 12,\n    marginHorizontal: 20,\n    borderRadius: 16,\n    borderWidth: 1,\n    borderColor: Colors.border,').replace('fontSize: 16,', 'fontSize: 15,'))
edit('src/app/(tabs)/negotiations.tsx', lambda s: s.replace('backgroundColor: Colors.surface,', 'backgroundColor: Colors.background,').replace('  listContent: {', '  listContent: {\n    paddingTop: 20,'))
edit('src/app/(tabs)/trades.tsx', lambda s: s.replace('borderRadius: 12', 'borderRadius: 18').replace('title: { ...typography.h3', 'title: { ...typography.body, fontWeight: \'600\'').replace('status: { ...typography.caption, color: Colors.textMuted }', 'status: { ...typography.caption, color: Colors.accent, backgroundColor: Colors.accentSoft, alignSelf: \'flex-start\', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }'))
edit('src/components/TradeCard.tsx', lambda s: s.replace("{CATEGORY_EMOJI[p.categoryId] ?? '📦'} {p.name}", '{p.name}').replace("{p.name} {CATEGORY_EMOJI[p.categoryId] ?? '📦'}", '{p.name}').replace("const CATEGORY_EMOJI: Record<string, string> = {\n  'cat-1': '💻',\n  'cat-2': '🎮',\n  'cat-3': '📚',\n  'cat-4': '🏃',\n};", '').replace('numberOfLines={1}', 'numberOfLines={3}').replace('borderRadius: 12', 'borderRadius: 18').replace('borderRadius: 20', 'borderRadius: 12').replace('    flex: 1,\n    paddingVertical:', '    flex: 1,\n    minHeight: 44,\n    justifyContent: \'center\',\n    paddingVertical:'))
edit('src/app/chat/[id].tsx', lambda s: s.replace("import { useLocalSearchParams, Stack }", "import { useSafeAreaInsets } from 'react-native-safe-area-context';\nimport { Feather } from '@expo/vector-icons';\nimport { useLocalSearchParams, Stack }").replace('  const { id }', '  const insets = useSafeAreaInsets();\n  const { id }').replace('<Text style={styles.messageText}>', '<Text style={[styles.messageText, isMe && { color: Colors.surface }]}>').replace('<Text style={styles.messageTime}>', '<Text style={[styles.messageTime, isMe && { color: Colors.onBrandMuted }]}>').replace('<View style={styles.inputArea}>', '<View style={[styles.inputArea, { paddingBottom: Math.max(12, insets.bottom) }]}>').replace('<Text style={styles.sendButtonText}>➤</Text>', '<Feather name="send" size={19} color={Colors.surface} />').replace('backgroundColor: Colors.selected,', 'backgroundColor: Colors.primary,').replace('paddingHorizontal: Spacing.two,\n    paddingVertical: Spacing.one,', 'paddingHorizontal: 14,\n    paddingVertical: 10,').replace('backgroundColor: Colors.transparent,\n    gap: Spacing.one,', 'backgroundColor: Colors.surface,\n    borderTopWidth: 1, borderTopColor: Colors.border,\n    gap: 10, paddingHorizontal: 16, paddingTop: 12,').replace('  input: {', '  input: {\n    outlineWidth: 0, minHeight: 44, color: Colors.text,').replace('borderColor: Colors.transparent', 'borderColor: Colors.border').replace('borderRadius: 20', 'borderRadius: 14'))

# Tests now type the credentials rather than bypassing the form.
edit('tests/e2e/cp5.spec.ts', lambda s: s.replace("import { test, expect }", "import { test, expect, type Page }").replace("test('fluxo completo", "async function login(page: Page, name = 'Ana') {\n  await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill(`${name.toLowerCase()}@trocaja.com`);\n  await page.getByLabel('Senha', { exact: true }).fill(`${name}12345`);\n  await page.getByRole('button', { name: 'Entrar', exact: true }).click();\n}\n\ntest('fluxo completo", 1).replace("page.getByRole('button', { name: 'Entrar como Ana Costa' })", "page.getByRole('button', { name: 'Entrar', exact: true })").replace("await page.getByRole('button', { name: 'Entrar', exact: true }).click();", "await login(page);", 1 if False else 0))
# Replace only test-body login clicks, keeping the helper's own click.
p = root / 'tests/e2e/cp5.spec.ts'
s = p.read_text(encoding='utf-8')
head, body = s.split("test('fluxo completo", 1)
body = body.replace("await page.getByRole('button', { name: 'Entrar', exact: true }).click();", 'await login(page);').replace("await page.getByRole('button', { name: 'Entrar como Bruno Lima' }).click();", "await login(page, 'Bruno');").replace("page.getByText('🚪 Sair', { exact: true })", "page.getByRole('button', { name: 'Sair', exact: true })").replace("Olá, Ana 👋", "Olá, Ana")
put('tests/e2e/cp5.spec.ts', head + "test('fluxo completo" + body)
print('Login, layout e componentes atualizados.')

import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, typography } from '@/tokens/theme';

export default function HomeHero({ name }: { name: string }) {
  return <View style={styles.header}>
    <View style={styles.brand}>
      <Image source={require('../../assets/ui-images/logo.png')} style={styles.mark} accessible={false} />
      <Text style={styles.wordmark}>TROCA<Text style={styles.wordmarkAccent}>JÁ</Text></Text>
      <View style={styles.community}><View style={styles.dot} /><Text style={styles.communityText}>feito para circular</Text></View>
    </View>
    <Text accessibilityRole="header" style={styles.greeting}>Olá, {name}</Text>
    <Text style={styles.title}>Novas histórias.{'\n'}<Text style={styles.titleAccent}>Boas trocas.</Text></Text>
    <Text style={styles.subtitle}>O que você não usa pode ser{'\n'}exatamente o que alguém procura.</Text>
    <View style={styles.signature}><Feather name="repeat" size={13} color={Colors.accent} />
      <Text style={styles.signatureText}>Renovar trocando o que você não precisa.</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 24, flexWrap: 'wrap' },
  mark: { width: 30, height: 30 },
  wordmark: { fontFamily: Fonts.bold, fontSize: 13, letterSpacing: 1.4, color: Colors.navy },
  wordmarkAccent: { color: Colors.accent },
  community: { flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accent },
  communityText: { fontFamily: Fonts.medium, fontSize: 10, color: Colors.accent },
  greeting: { ...typography.body, color: Colors.secondaryText, marginBottom: 9 },
  title: { fontFamily: Fonts.bold, fontSize: 31, lineHeight: 37, letterSpacing: -1.1, color: Colors.navy },
  titleAccent: { color: Colors.primary },
  subtitle: { ...typography.body, fontSize: 12, lineHeight: 19, color: Colors.secondaryText, marginTop: 10 },
  signature: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 17 },
  signatureText: { fontFamily: Fonts.medium, fontSize: 10, color: Colors.accent },
});

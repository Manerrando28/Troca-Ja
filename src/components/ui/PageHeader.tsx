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

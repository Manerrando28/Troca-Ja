import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, typography } from '@/tokens/theme';
export default function EmptyState({ message }: { message: string }) {
  return <View style={styles.container}><Text style={styles.text}>{message}</Text></View>;
}
const styles = StyleSheet.create({
  container: { padding: Spacing.four, alignItems: 'center' },
  text: { ...typography.body, textAlign: 'center', color: Colors.textMuted },
});

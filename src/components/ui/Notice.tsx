import { Text, StyleSheet } from 'react-native';
import { Colors, Spacing, typography } from '@/tokens/theme';
export default function Notice({ message, error = false }: { message: string; error?: boolean }) {
  return <Text accessibilityRole="alert" accessibilityLiveRegion="polite"
    style={[styles.notice, error && styles.error]}>{message}</Text>;
}
const styles = StyleSheet.create({
  notice: { ...typography.body, padding: Spacing.three, color: Colors.text, backgroundColor: Colors.surface },
  error: { color: Colors.error },
});

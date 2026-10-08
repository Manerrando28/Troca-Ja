import { Text, StyleSheet } from "react-native";
import { Colors, Radius, Spacing, typography } from "@/tokens/theme";

export default function Notice({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.notice, error && styles.error]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  notice: {
    ...typography.body,
    padding: Spacing.three,
    color: Colors.dark.text,
    backgroundColor: Colors.successBackground,
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: Radius.medium,
    opacity: 1,
  },
  error: {
    color: Colors.error,
    backgroundColor: Colors.surface,
    borderColor: Colors.error,
  },
});
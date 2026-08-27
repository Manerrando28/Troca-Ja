import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, typography } from '@/tokens/theme';

type AvatarProps = {
  name: string;
  size?: number;
};

/**
 * Avatar — componente genérico de avatar com iniciais.
 *
 * Não conhece conceitos do TrocaJá.
 * Exibe as primeiras duas iniciais do nome com fundo colorido.
 */
export default function Avatar({ name, size = 44 }: AvatarProps) {
  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Gera uma cor consistente a partir do nome — sem aleatoriedade.
function getColorFromName(name: string): string {
  const palette = [
    '#6C63FF', // primary
    '#FF6584', // secondary
    '#43A047', // success
    '#1976D2',
    '#E64A19',
    '#00897B',
    '#8E24AA',
    '#F57C00',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.surface,
    fontWeight: '700',
  },
});

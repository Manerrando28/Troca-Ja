/**
 * tokens/theme.ts — Design tokens do TrocaJá
 *
 * Centraliza cores, espaçamentos, tipografia e dimensões recorrentes.
 * Importar a partir de @/tokens/theme em qualquer componente ou tela.
 */

import { Platform } from 'react-native';

export const Colors = {
  primary: '#0066FF',
  secondary: '#0172bd',
  background: '#f8f8f8',
  surface: '#ffffff',
  button: '#0090f0',
  text: '#125cca',
  secondaryText: '#1d1d1d',
  terciaryText: '#ffffff',
  textMuted: '#757575',
  error: '#E53935',
  success: '#43A047',
  buttonText: '#E0E0E0',
  border: '#E0E0E0',

  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },

  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const typography = {
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 28,
  },

  h2: {
    fontFamily: Fonts.semibold,
    fontSize: 22,
  },

  h3: {
    fontFamily: Fonts.semibold,
    fontSize: 18,
  },

  body: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },

  caption: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
};

export const BottomTabInset = Platform.select({
  ios: 50,
  android: 80,
}) ?? 0;

export const MaxContentWidth = 800;
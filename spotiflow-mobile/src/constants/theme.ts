import { Platform } from 'react-native';

/**
 * Tokens centralizados de cores, espaçamentos, bordas, sombras e tipografia.
 * Suporta tema escuro (padrão Spotify) e tema claro.
 */
export const darkColors = {
  background: '#121212',
  backgroundElevated: '#242424',
  backgroundCard: '#282828',
  backgroundHighlight: '#1F1F1F',
  surfaceCard: '#181818',
  sheetBackground: '#1E1E1E',
  sheetIconBg: '#2A2A2A',

  primary: '#1DB954',
  primaryPressed: '#1AA34A',
  onPrimary: '#121212',

  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#777777',

  accentBlue: '#0D72EC',
  accentPurple: '#7358FF',
  accentPink: '#E8115B',
  accentOrange: '#E91429',
  accentYellow: '#BC5900',
  accentGreen: '#148A08',

  playerBackground: '#3E1C1A',
  playerTextPrimary: '#FFFFFF',
  playerTextSecondary: '#D4C3C2',
  playerTextMuted: '#A89493',
  playerTrackBg: 'rgba(255, 255, 255, 0.25)',
  playerPlayBg: '#FFFFFF',
  playerPlayIcon: '#121212',

  tabBarBackground: '#000000',
  border: '#282828',
  dividerSubtle: 'rgba(255, 255, 255, 0.06)',
  highlightRow: 'rgba(255, 255, 255, 0.05)',
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayCard: 'rgba(0, 0, 0, 0.5)',
  progressTrack: 'rgba(255, 255, 255, 0.2)',

  searchBarBg: '#FFFFFF',
  searchBarText: '#121212',
  searchBarPlaceholder: '#535353',

  switchTrackOff: '#3E3E3E',
  switchThumb: '#FFFFFF',

  premiumMint: '#7CD1B8',
  premiumMintText: '#121212',
  badgeText: '#FFFFFF',
  closeButtonBg: '#FFFFFF',
  closeButtonIcon: '#121212',
  bubbleMeText: '#121212',
  bubbleTimeText: 'rgba(255, 255, 255, 0.6)',
  sharedTrackBg: 'rgba(0, 0, 0, 0.3)',

  danger: '#E91429',
  shadow: '#000000',
};

export const lightColors: ThemeColors = {
  background: '#F6F7F8',
  backgroundElevated: '#FFFFFF',
  backgroundCard: '#EAECEF',
  backgroundHighlight: '#E2E5E9',
  surfaceCard: '#FFFFFF',
  sheetBackground: '#FFFFFF',
  sheetIconBg: '#F0F2F5',

  primary: '#1DB954',
  primaryPressed: '#169C46',
  onPrimary: '#FFFFFF',

  textPrimary: '#121212',
  textSecondary: '#4A4D52',
  textMuted: '#6B7280',

  accentBlue: '#0D72EC',
  accentPurple: '#7358FF',
  accentPink: '#E8115B',
  accentOrange: '#E91429',
  accentYellow: '#BC5900',
  accentGreen: '#148A08',

  playerBackground: '#3E1C1A',
  playerTextPrimary: '#FFFFFF',
  playerTextSecondary: '#D4C3C2',
  playerTextMuted: '#A89493',
  playerTrackBg: 'rgba(255, 255, 255, 0.25)',
  playerPlayBg: '#FFFFFF',
  playerPlayIcon: '#121212',

  tabBarBackground: '#FFFFFF',
  border: '#E2E5E9',
  dividerSubtle: 'rgba(18, 18, 18, 0.08)',
  highlightRow: 'rgba(29, 185, 84, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayCard: 'rgba(0, 0, 0, 0.55)',
  progressTrack: 'rgba(255, 255, 255, 0.25)',

  searchBarBg: '#FFFFFF',
  searchBarText: '#121212',
  searchBarPlaceholder: '#535353',

  switchTrackOff: '#C9CDD3',
  switchThumb: '#FFFFFF',

  premiumMint: '#7CD1B8',
  premiumMintText: '#121212',
  badgeText: '#FFFFFF',
  closeButtonBg: '#121212',
  closeButtonIcon: '#FFFFFF',
  bubbleMeText: '#FFFFFF',
  bubbleTimeText: 'rgba(18, 18, 18, 0.55)',
  sharedTrackBg: 'rgba(0, 0, 0, 0.22)',

  danger: '#D92D20',
  shadow: '#000000',
};

export type ThemeColors = typeof darkColors;
export type ThemeMode = 'dark' | 'light';

// Mantido para compatibilidade com referências estáticas durante a migração
export const Colors = darkColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  pill: 999,
} as const;

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 5,
    },
    android: {
      elevation: 4,
    },
    default: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 5,
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
  }),
  hero: Platform.select({
    ios: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
    },
    android: {
      elevation: 12,
    },
    default: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
    },
  }),
};

export function createTypography(colors: ThemeColors) {
  return {
    titleLarge: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.textPrimary,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.textPrimary,
    },
    bodyMedium: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    bodySmall: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    caption: {
      fontSize: 11,
      color: colors.textMuted,
    },
  };
}

export type ThemeTypography = ReturnType<typeof createTypography>;

export const Typography = createTypography(darkColors);

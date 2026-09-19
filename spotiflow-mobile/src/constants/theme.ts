/**
 * Constantes de cores e tema baseados na identidade visual oficial do Spotify
 */
export const Colors = {
  background: '#121212',
  backgroundElevated: '#242424',
  backgroundCard: '#282828',
  backgroundHighlight: '#1f1f1f',
  surfaceCard: '#181818',
  
  primary: '#1DB954',
  primaryPressed: '#1AA34A',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#777777',
  
  accentBlue: '#0D72EC',
  accentPurple: '#7358FF',
  accentPink: '#E8115B',
  accentOrange: '#E91429',
  accentYellow: '#BC5900',
  accentGreen: '#148A08',
  
  playerBackground: '#3E1C1A', // tom acastanhado/vinho baseado no print de Exagerado
  tabBarBackground: '#000000',
  border: '#282828',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  titleLarge: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    color: Colors.textMuted,
  },
};

import React, { createContext, useContext, useMemo } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { useColorScheme } from 'react-native';
import {
  createTypography,
  darkColors,
  lightColors,
  type ThemeColors,
  type ThemeMode,
  type ThemeTypography,
} from '../constants/theme';

interface ThemeContextValue {
  isReady: boolean;
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [storedMode, setMode, isReady] = usePersistedState<ThemeMode>('app:tema',
    systemScheme === 'light' ? 'light' : 'dark'
  );
  const mode = storedMode === 'light' ? 'light' : 'dark';

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    const colors = isDark ? darkColors : lightColors;
    const typography = createTypography(colors);

    return {
      isReady,
      mode,
      isDark,
      colors,
      typography,
      setMode,
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    };
  }, [mode, isReady, setMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return ctx;
}

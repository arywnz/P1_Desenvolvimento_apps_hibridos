import React, { createContext, useContext, useMemo, useState } from 'react';
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
  // Gancho pronto para Aula 10: substituir useState por usePersistedState('spotiflow:v1:tema', ...)
  const [mode, setMode] = useState<ThemeMode>(
    systemScheme === 'light' ? 'light' : 'dark'
  );

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    const colors = isDark ? darkColors : lightColors;
    const typography = createTypography(colors);

    return {
      mode,
      isDark,
      colors,
      typography,
      setMode,
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    };
  }, [mode]);

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

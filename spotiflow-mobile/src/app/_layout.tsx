import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LibraryProvider } from '../context/LibraryContext';
import { PlayerProvider } from '../context/PlayerContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { colors, isDark, isReady: themeReady } = useTheme();
  const { isReady } = useAuth();
  useEffect(() => {
    if (isReady && themeReady) void SplashScreen.hideAsync().catch(() => {});
  }, [isReady, themeReady]);
  if (!isReady || !themeReady) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <PlayerProvider>
            <RootNavigator />
          </PlayerProvider>
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

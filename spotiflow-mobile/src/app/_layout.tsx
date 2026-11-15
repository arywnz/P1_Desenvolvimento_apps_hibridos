import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from '../context/PlayerContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-modal"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="player"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="playlist/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            animation: 'slide_from_left',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="friend-profile"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <RootNavigator />
      </PlayerProvider>
    </ThemeProvider>
  );
}

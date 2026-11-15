import { Image } from 'expo-image';
import { useRouter, useSegments } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

export function MiniPlayer() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const { currentTrack, isPlaying, togglePlayPause, toggleLike, positionSeconds } =
    usePlayer();

  const tabBarHeight = 60 + Math.max(insets.bottom, 12);
  const bottomOffset =
    tabBarHeight + (Platform.select({ ios: 4, android: 6, default: 4 }) ?? 4);

  const styles = useMemo(
    () => createStyles(colors, typography, bottomOffset),
    [colors, typography, bottomOffset]
  );

  // Esconder o mini player na tela de Criar (Bottom Sheet) e no Player Fullscreen
  const segmentList = segments as string[];
  const isCreateScreen = segmentList.includes('create');
  const isPlayerScreen = segmentList.includes('player');

  if (!currentTrack || isCreateScreen || isPlayerScreen) return null;

  const progressPercent =
    (positionSeconds / (currentTrack.durationSeconds || 1)) * 100;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.inner}
        onPress={() => router.push('/player')}
        accessibilityRole="button"
        accessibilityLabel={`Abrir player para ${currentTrack.title}`}
      >
        <Image
          source={{ uri: currentTrack.coverUrl }}
          style={styles.cover}
          contentFit="cover"
        />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
            }}
            accessibilityRole="button"
            accessibilityLabel="Dispositivos conectados"
          >
            <SymbolView
              name={{
                ios: 'hifispeaker.fill',
                android: 'speaker_group',
                web: 'speaker_group',
              }}
              size={20}
              tintColor={colors.playerTextSecondary}
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            accessibilityRole="button"
            accessibilityLabel={currentTrack.liked ? 'Descurtir' : 'Curtir'}
          >
            <SymbolView
              name={{
                ios: currentTrack.liked ? 'checkmark.circle.fill' : 'heart',
                android: currentTrack.liked ? 'check_circle' : 'favorite_border',
                web: currentTrack.liked ? 'check_circle' : 'favorite_border',
              }}
              size={22}
              tintColor={
                currentTrack.liked ? colors.primary : colors.playerTextSecondary
              }
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            <SymbolView
              name={{
                ios: isPlaying ? 'pause.fill' : 'play.fill',
                android: isPlaying ? 'pause' : 'play_arrow',
                web: isPlaying ? 'pause' : 'play_arrow',
              }}
              size={24}
              tintColor={colors.playerTextPrimary}
              type="hierarchical"
            />
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>
    </View>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  bottomOffset: number
) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottomOffset,
      left: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: colors.playerBackground,
      borderRadius: Radius.md,
      overflow: 'hidden',
      ...Shadows.floating,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      height: 56,
    },
    cover: {
      width: 44,
      height: 44,
      borderRadius: Radius.xs,
      backgroundColor: colors.surfaceCard,
    },
    info: {
      flex: 1,
      marginLeft: Spacing.sm,
      justifyContent: 'center',
    },
    title: {
      ...typography.bodyMedium,
      color: colors.playerTextPrimary,
      fontWeight: '700',
      fontSize: 13,
    },
    artist: {
      ...typography.bodySmall,
      color: colors.playerTextSecondary,
      fontSize: 12,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingRight: Spacing.xs,
    },
    progressBarBackground: {
      height: 2,
      backgroundColor: colors.progressTrack,
      width: '100%',
    },
    progressBarFill: {
      height: 2,
      backgroundColor: colors.primary,
    },
  });
}

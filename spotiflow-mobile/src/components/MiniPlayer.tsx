import { Image } from 'expo-image';
import { useRouter, useSegments } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlayingEqualizer } from './AnimatedMotion';
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
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { colors, typography } = useTheme();
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    hasPreview,
    positionSeconds,
    durationSeconds,
    togglePlayPause,
    toggleLike,
  } = usePlayer();

  const tabBarHeight = 60 + Math.max(insets.bottom, 12);
  const bottomOffset =
    tabBarHeight + (Platform.select({ ios: 4, android: 6, default: 4 }) ?? 4);

  const horizontalMargin = width > 680 ? Math.floor((width - 640) / 2) : Spacing.sm;

  const styles = useMemo(
    () => createStyles(colors, typography, bottomOffset, horizontalMargin),
    [colors, typography, bottomOffset, horizontalMargin]
  );

  // Esconder o mini player na tela de Criar (Bottom Sheet) e no Player Fullscreen
  const segmentList = segments as string[];
  const isCreateScreen = segmentList.includes('create');
  const isPlayerScreen = segmentList.includes('player');

  if (!currentTrack || isCreateScreen || isPlayerScreen) return null;

  const progressPercent = Math.min(
    100,
    Math.max(0, (positionSeconds / (durationSeconds || 1)) * 100)
  );

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(260)}
      style={styles.container}
    >
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
          <View style={styles.titleRow}>
            {hasPreview && isPlaying && (
              <PlayingEqualizer
                isPlaying={isPlaying}
                color={colors.primary}
                size={12}
              />
            )}
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
          </View>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              router.push('/queue');
            }}
            accessibilityRole="button"
            accessibilityLabel="Abrir fila de reprodução"
          >
            <SymbolView
              name={{
                ios: 'list.bullet',
                android: 'queue_music',
                web: 'queue_music',
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
            {isBuffering ? (
              <ActivityIndicator size="small" color={colors.playerTextPrimary} />
            ) : (
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
            )}
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>
    </Animated.View>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  bottomOffset: number,
  horizontalMargin: number
) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottomOffset,
      left: horizontalMargin,
      right: horizontalMargin,
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
      marginRight: Spacing.sm,
      justifyContent: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    title: {
      ...typography.bodyMedium,
      color: colors.playerTextPrimary,
      fontWeight: '700',
      fontSize: 13,
      flexShrink: 1,
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

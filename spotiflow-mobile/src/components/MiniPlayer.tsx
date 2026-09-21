import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';

export function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, toggleLike, positionSeconds } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = (positionSeconds / (currentTrack.durationSeconds || 1)) * 100;

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
              // toggle device connect
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
              tintColor={Colors.textSecondary}
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
              tintColor={currentTrack.liked ? Colors.primary : Colors.textSecondary}
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
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 74, // exatamente acima da tab bar
    left: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.playerBackground, // tom vinho/marrom escuro do print
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
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
    borderRadius: 4,
    backgroundColor: Colors.surfaceCard,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  title: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
  },
  artist: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  progressBarFill: {
    height: 2,
    backgroundColor: Colors.primary,
  },
});

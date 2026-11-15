import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResourceNotFound } from '../../../components/ResourceNotFound';
import { CURRENT_TRACK, type Track } from '../../../constants/mockData';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { useLibrary } from '../../../context/LibraryContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useTheme } from '../../../context/ThemeContext';

export default function ArtistDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
  const { allPlaylists, followedArtists, toggleFollowArtist } = useLibrary();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();

  const decodedName = id ? decodeURIComponent(id).trim() : '';
  const normalizedTarget = decodedName.toLowerCase();

  // Reúne faixas únicas do catálogo local pertencentes ao artista solicitado
  const allTracks: Track[] = useMemo(() => {
    const map = new Map<string, Track>();
    map.set(CURRENT_TRACK.id, CURRENT_TRACK);
    for (const playlist of allPlaylists) {
      for (const track of playlist.tracks) {
        if (!map.has(track.id)) {
          map.set(track.id, track);
        }
      }
    }
    return Array.from(map.values());
  }, [allPlaylists]);

  const artistTracks = useMemo(
    () =>
      allTracks.filter(
        (track) => track.artist.toLowerCase() === normalizedTarget
      ),
    [allTracks, normalizedTarget]
  );

  const relatedPlaylists = useMemo(
    () =>
      allPlaylists.filter((playlist) =>
        playlist.tracks.some(
          (track) => track.artist.toLowerCase() === normalizedTarget
        )
      ),
    [allPlaylists, normalizedTarget]
  );

  if (!decodedName || artistTracks.length === 0) {
    return (
      <ResourceNotFound
        title="Artista não encontrado"
        description="Não localizamos faixas deste artista no catálogo atual."
      />
    );
  }

  const artistName = artistTracks[0].artist;
  const coverUrl = artistTracks[0].coverUrl;
  const isFollowing = followedArtists.includes(normalizedTarget);
  const isArtistPlaying =
    isPlaying &&
    artistTracks.some((track) => track.id === currentTrack?.id);

  const handlePlayArtist = () => {
    if (artistTracks.some((track) => track.id === currentTrack?.id)) {
      togglePlayPause();
    } else {
      playTrack(artistTracks[0], artistTracks);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <SymbolView
            name={{
              ios: 'chevron.backward',
              android: 'arrow_back',
              web: 'arrow_back',
            }}
            size={24}
            tintColor={colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Artista
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.artistAvatar}
            contentFit="cover"
          />
          <Text style={styles.artistName}>{artistName}</Text>
          <Text style={styles.artistMeta}>
            {artistTracks.length}{' '}
            {artistTracks.length === 1 ? 'faixa no catálogo' : 'faixas no catálogo'}
          </Text>

          <View style={styles.heroActions}>
            <Pressable
              style={[
                styles.followButton,
                isFollowing && styles.followButtonActive,
              ]}
              onPress={() => toggleFollowArtist(normalizedTarget)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followButtonTextActive,
                ]}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.playButton}
              onPress={handlePlayArtist}
              accessibilityRole="button"
              accessibilityLabel={`Reproduzir músicas de ${artistName}`}
            >
              <SymbolView
                name={{
                  ios: isArtistPlaying ? 'pause.fill' : 'play.fill',
                  android: isArtistPlaying ? 'pause' : 'play_arrow',
                  web: isArtistPlaying ? 'pause' : 'play_arrow',
                }}
                size={24}
                tintColor={colors.onPrimary}
                type="hierarchical"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Populares</Text>
          {artistTracks.map((track, index) => {
            const isSelected = currentTrack?.id === track.id;
            return (
              <Pressable
                key={track.id}
                style={styles.trackRow}
                onPress={() => playTrack(track, artistTracks)}
                accessibilityRole="button"
                accessibilityLabel={`Tocar ${track.title}`}
              >
                <Text
                  style={[
                    styles.trackIndex,
                    isSelected && styles.trackTitleActive,
                  ]}
                >
                  {index + 1}
                </Text>
                <Image
                  source={{ uri: track.coverUrl }}
                  style={styles.trackCover}
                  contentFit="cover"
                />
                <View style={styles.trackInfo}>
                  <Text
                    style={[
                      styles.trackTitle,
                      isSelected && styles.trackTitleActive,
                    ]}
                    numberOfLines={1}
                  >
                    {track.title}
                  </Text>
                  <Text style={styles.trackSubtitle} numberOfLines={1}>
                    {track.album} • {track.duration}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {relatedPlaylists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presente nas playlists</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistList}
            >
              {relatedPlaylists.map((playlist) => (
                <Pressable
                  key={playlist.id}
                  style={styles.playlistCard}
                  onPress={() =>
                    router.push({
                      pathname: '/playlist/[id]',
                      params: { id: playlist.id },
                    })
                  }
                >
                  <Image
                    source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                    style={styles.playlistCover}
                    contentFit="cover"
                  />
                  <Text style={styles.playlistTitle} numberOfLines={2}>
                    {playlist.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topBar: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: Spacing.sm,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topBarTitle: {
      ...typography.titleMedium,
      fontSize: 17,
      flex: 1,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: Spacing.lg,
      gap: Spacing.lg,
    },
    heroCard: {
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
    },
    artistAvatar: {
      width: 140,
      height: 140,
      borderRadius: Radius.pill,
      ...Shadows.floating,
    },
    artistName: {
      ...typography.titleLarge,
      fontSize: 26,
      textAlign: 'center',
    },
    artistMeta: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    heroActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginTop: Spacing.xs,
    },
    followButton: {
      height: 40,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    followButtonActive: {
      borderColor: colors.primary,
    },
    followButtonText: {
      ...typography.bodySmall,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    followButtonTextActive: {
      color: colors.primary,
    },
    playButton: {
      width: 48,
      height: 48,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.floating,
    },
    section: {
      gap: Spacing.sm,
    },
    sectionTitle: {
      ...typography.titleMedium,
    },
    trackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs,
      gap: Spacing.sm,
    },
    trackIndex: {
      width: 22,
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontWeight: '700',
      textAlign: 'center',
    },
    trackCover: {
      width: 46,
      height: 46,
      borderRadius: Radius.sm,
    },
    trackInfo: {
      flex: 1,
      gap: 2,
    },
    trackTitle: {
      ...typography.bodyMedium,
      fontWeight: '600',
    },
    trackTitleActive: {
      color: colors.primary,
    },
    trackSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    playlistList: {
      gap: Spacing.md,
    },
    playlistCard: {
      width: 132,
      gap: Spacing.xs,
    },
    playlistCover: {
      width: 132,
      height: 132,
      borderRadius: Radius.md,
    },
    playlistTitle: {
      ...typography.bodySmall,
      fontWeight: '600',
    },
  });
}

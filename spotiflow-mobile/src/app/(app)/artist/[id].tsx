import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PlayingEqualizer,
  ScalePressable,
} from '../../../components/AnimatedMotion';
import { ResourceNotFound } from '../../../components/ResourceNotFound';
import { StateView } from '../../../components/StateView';
import { DEFAULT_PLAYLIST_COVER_URL } from '../../../constants/mockData';
import type { Track } from '../../../types/music';
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
import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';

export default function ArtistDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography } = useTheme();
  const avatarSize = Math.min(Math.max(Math.round(width * 0.34), 112), 156);
  const styles = useMemo(
    () => createStyles(colors, typography, avatarSize),
    [colors, typography, avatarSize]
  );
  const { allPlaylists, followedArtists, toggleFollowArtist } = useLibrary();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const [refreshing, setRefreshing] = useState(false);

  const rawId = id ?? '';
  const isNumericId = /^\d+$/.test(rawId);
  const decodedName = rawId ? decodeURIComponent(rawId).trim() : '';
  const normalizedTarget = decodedName.toLowerCase();

  const fetchArtist = useCallback(() => api.getArtist(rawId), [rawId]);
  const {
    data: remoteArtist,
    loading,
    error,
    reload,
  } = useFetch(fetchArtist, { enabled: isNumericId });

  const localTracks: Track[] = useMemo(() => {
    if (isNumericId) return [];
    const map = new Map<string, Track>();
    for (const playlist of allPlaylists) {
      for (const track of playlist.tracks) {
        if (!map.has(track.id)) {
          map.set(track.id, track);
        }
      }
    }
    return Array.from(map.values()).filter(
      (track) => track.artist.toLowerCase() === normalizedTarget
    );
  }, [allPlaylists, isNumericId, normalizedTarget]);

  const artistName = remoteArtist?.name ?? localTracks[0]?.artist ?? '';
  const artistTracks = remoteArtist?.topTracks ?? localTracks;
  const coverUrl =
    remoteArtist?.pictureUrl || localTracks[0]?.coverUrl || DEFAULT_PLAYLIST_COVER_URL;
  const followKey = isNumericId ? rawId : normalizedTarget;

  const relatedPlaylists = useMemo(() => {
    const compareName = artistName.toLowerCase();
    return allPlaylists.filter((playlist) =>
      playlist.tracks.some((track) => track.artist.toLowerCase() === compareName)
    );
  }, [allPlaylists, artistName]);

  const handleRefresh = async () => {
    if (!isNumericId) return;
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  if (!rawId || (!isNumericId && localTracks.length === 0)) {
    return (
      <ResourceNotFound
        title="Artista não encontrado"
        description="Não localizamos faixas deste artista no catálogo atual."
      />
    );
  }

  if (isNumericId && (loading || error || !remoteArtist)) {
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
          <Text style={styles.topBarTitle}>Artista</Text>
        </View>
        <StateView
          loading={loading}
          error={error}
          isEmpty={!remoteArtist}
          loadingLabel="Carregando artista da Deezer..."
          emptyTitle="Artista não encontrado"
          emptyDescription="Não localizamos esse artista na API."
          onRetry={() => {
            void reload();
          }}
        >
          {null}
        </StateView>
      </SafeAreaView>
    );
  }

  const isFollowing = followedArtists.includes(followKey);
  const isArtistPlaying =
    isPlaying &&
    artistTracks.some((track) => track.id === currentTrack?.id);

  const handlePlayArtist = () => {
    if (artistTracks.length === 0) return;
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
          {artistName}
        </Text>
      </View>

      <FlatList
        data={artistTracks}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          isNumericId ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        ListHeaderComponent={
          <>
            <View style={styles.heroCard}>
              <Image
                source={{ uri: coverUrl }}
                style={styles.artistAvatar}
                contentFit="cover"
              />
              <Text style={styles.artistName}>{artistName}</Text>
              <Text style={styles.artistMeta}>
                {remoteArtist?.fansCount
                  ? `${remoteArtist.fansCount.toLocaleString('pt-BR')} fãs • `
                  : ''}
                {artistTracks.length}{' '}
                {artistTracks.length === 1
                  ? 'faixa principal'
                  : 'faixas principais'}
              </Text>

              <View style={styles.heroActions}>
                <Pressable
                  style={[
                    styles.followButton,
                    isFollowing && styles.followButtonActive,
                  ]}
                  onPress={() => toggleFollowArtist(followKey)}
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

                <ScalePressable
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
                </ScalePressable>
              </View>
            </View>

            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
              Populares
            </Text>
          </>
        }
        ListFooterComponent={
          relatedPlaylists.length > 0 ? (
            <View style={styles.footerSection}>
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
          ) : undefined
        }
        renderItem={({ item: track, index }) => {
          const isSelected = currentTrack?.id === track.id;
          return (
            <Pressable
              style={styles.trackRow}
              onPress={() => playTrack(track, artistTracks)}
              accessibilityRole="button"
              accessibilityLabel={`Tocar ${track.title}`}
            >
              {isSelected && isPlaying ? (
                <View style={styles.trackIndexEq}>
                  <PlayingEqualizer
                    isPlaying={isPlaying}
                    color={colors.primary}
                    size={12}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    styles.trackIndex,
                    isSelected && styles.trackTitleActive,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
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
        }}
      />
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  avatarSize: number
) {
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
      gap: Spacing.xs,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },
    heroCard: {
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
    },
    artistAvatar: {
      width: avatarSize,
      height: avatarSize,
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
    sectionTitle: {
      ...typography.titleMedium,
    },
    sectionSpacing: {
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    footerSection: {
      marginTop: Spacing.lg,
      gap: Spacing.sm,
    },
    trackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs + 2,
      gap: Spacing.sm,
    },
    trackIndex: {
      width: 22,
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontWeight: '700',
      textAlign: 'center',
    },
    trackIndexEq: {
      width: 22,
      alignItems: 'center',
      justifyContent: 'center',
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

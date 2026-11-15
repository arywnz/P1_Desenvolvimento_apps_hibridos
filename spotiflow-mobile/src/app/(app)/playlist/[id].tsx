import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResourceNotFound } from '../../../components/ResourceNotFound';
import { StateView } from '../../../components/StateView';
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

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
  const { allPlaylists, savedIds, toggleSavePlaylist } = useLibrary();
  const { playTrack, currentTrack, isPlaying, togglePlayPause, addToQueue } =
    usePlayer();
  const [refreshing, setRefreshing] = useState(false);

  const localPlaylist = useMemo(
    () => allPlaylists.find((p) => p.id === id) ?? null,
    [allPlaylists, id]
  );
  const shouldFetchRemote = Boolean(id && !localPlaylist && /^\d+$/.test(id));

  const fetchRemotePlaylist = useCallback(
    () => api.getPlaylist(id ?? ''),
    [id]
  );
  const {
    data: remotePlaylist,
    loading,
    error,
    reload,
  } = useFetch(fetchRemotePlaylist, { enabled: shouldFetchRemote });

  const playlist = localPlaylist ?? remotePlaylist;

  const handleRefresh = async () => {
    if (!shouldFetchRemote) return;
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  if (!id || (!localPlaylist && !shouldFetchRemote)) {
    return (
      <ResourceNotFound
        title="Playlist não encontrada"
        description="Não localizamos nenhuma playlist com esse identificador."
      />
    );
  }

  if (shouldFetchRemote && (loading || error || !playlist)) {
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
        </View>
        <StateView
          loading={loading}
          error={error}
          isEmpty={!playlist}
          loadingLabel="Carregando playlist da Deezer..."
          emptyTitle="Playlist não encontrada"
          emptyDescription="Não localizamos faixas para essa playlist."
          onRetry={() => {
            void reload();
          }}
        >
          {null}
        </StateView>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return null;
  }

  const isSaved = savedIds.includes(playlist.id);
  const isCurrentPlaylistPlaying =
    isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayFirst = () => {
    if (playlist.tracks.length > 0) {
      if (playlist.tracks.some((t) => t.id === currentTrack?.id)) {
        togglePlayPause();
      } else {
        playTrack(playlist.tracks[0], playlist.tracks);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Barra de Topo com Voltar */}
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
      </View>

      <FlatList
        data={playlist.tracks}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          shouldFetchRemote ? (
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
            {/* Capa Grande em Destaque */}
            <View style={styles.coverWrapper}>
              <Image
                source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                style={styles.coverImage}
                contentFit="cover"
              />
            </View>

            {/* Informações da Playlist */}
            <View style={styles.infoSection}>
              <Text style={styles.title}>{playlist.title}</Text>
              <Text style={styles.subtitle}>{playlist.subtitle}</Text>
              <Text style={styles.metaText}>
                Feita por <Text style={styles.author}>{playlist.author}</Text> •{' '}
                {playlist.tracksCount} músicas
              </Text>
            </View>

            {/* Barra de Ações */}
            <View style={styles.actionsBar}>
              <View style={styles.leftActions}>
                <Pressable
                  hitSlop={8}
                  onPress={() => toggleSavePlaylist(playlist.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isSaved ? 'Remover da biblioteca' : 'Adicionar à biblioteca'
                  }
                >
                  <SymbolView
                    name={{
                      ios: isSaved ? 'checkmark.circle.fill' : 'plus.circle',
                      android: isSaved ? 'check_circle' : 'add_circle',
                      web: isSaved ? 'check_circle' : 'add_circle',
                    }}
                    size={26}
                    tintColor={isSaved ? colors.primary : colors.textSecondary}
                    type="hierarchical"
                  />
                </Pressable>

                <Pressable
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Baixar playlist"
                >
                  <SymbolView
                    name={{
                      ios: playlist.isDownloaded
                        ? 'arrow.down.circle.fill'
                        : 'arrow.down.circle',
                      android: 'download_for_offline',
                      web: 'download_for_offline',
                    }}
                    size={26}
                    tintColor={
                      playlist.isDownloaded
                        ? colors.primary
                        : colors.textSecondary
                    }
                    type="hierarchical"
                  />
                </Pressable>

                <Pressable
                  hitSlop={8}
                  onPress={() => router.push('/queue')}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir fila de reprodução"
                >
                  <SymbolView
                    name={{
                      ios: 'list.bullet',
                      android: 'queue_music',
                      web: 'queue_music',
                    }}
                    size={24}
                    tintColor={colors.textSecondary}
                    type="hierarchical"
                  />
                </Pressable>
              </View>

              {/* Botão de Play Verde Circular */}
              <Pressable
                style={styles.playButton}
                onPress={handlePlayFirst}
                accessibilityRole="button"
                accessibilityLabel={
                  isCurrentPlaylistPlaying
                    ? 'Pausar playlist'
                    : 'Reproduzir playlist'
                }
              >
                <SymbolView
                  name={{
                    ios: isCurrentPlaylistPlaying ? 'pause.fill' : 'play.fill',
                    android: isCurrentPlaylistPlaying ? 'pause' : 'play_arrow',
                    web: isCurrentPlaylistPlaying ? 'pause' : 'play_arrow',
                  }}
                  size={28}
                  tintColor={colors.onPrimary}
                  type="hierarchical"
                />
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyTracks}>
            Esta playlist ainda não possui faixas disponíveis.
          </Text>
        }
        renderItem={({ item: track, index }) => {
          const isThisTrackSelected = currentTrack?.id === track.id;

          return (
            <Pressable
              style={[
                styles.trackRow,
                isThisTrackSelected && styles.trackRowSelected,
              ]}
              onPress={() => playTrack(track, playlist.tracks)}
              accessibilityRole="button"
              accessibilityLabel={`Tocar ${track.title} de ${track.artist}`}
            >
              <Text
                style={[
                  styles.trackIndex,
                  isThisTrackSelected && styles.trackIndexActive,
                ]}
              >
                {index + 1}
              </Text>

              <Image
                source={{ uri: track.coverUrl }}
                style={styles.trackThumb}
                contentFit="cover"
              />

              <View style={styles.trackInfo}>
                <Text
                  style={[
                    styles.trackTitle,
                    isThisTrackSelected && styles.trackTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  {track.title}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/artist/[id]',
                      params: {
                        id: track.artistId ?? encodeURIComponent(track.artist),
                      },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir artista ${track.artist}`}
                >
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {track.artist}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.trackDuration}>{track.duration}</Text>

              <Pressable
                hitSlop={8}
                style={styles.trackMoreButton}
                onPress={() => addToQueue(track)}
                accessibilityRole="button"
                accessibilityLabel={`Adicionar ${track.title} à fila`}
              >
                <SymbolView
                  name={{
                    ios: 'text.badge.plus',
                    android: 'playlist_add',
                    web: 'playlist_add',
                  }}
                  size={20}
                  tintColor={colors.textSecondary}
                  type="hierarchical"
                />
              </Pressable>
            </Pressable>
          );
        }}
      />
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
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.md,
      paddingBottom: 110,
      flexGrow: 1,
    },
    coverWrapper: {
      alignItems: 'center',
      marginVertical: Spacing.lg,
    },
    coverImage: {
      width: 220,
      height: 220,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceCard,
      ...Shadows.hero,
    },
    infoSection: {
      marginBottom: Spacing.lg,
    },
    title: {
      ...typography.titleLarge,
      fontSize: 26,
      fontWeight: '800',
      marginBottom: 4,
    },
    subtitle: {
      ...typography.bodyMedium,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    metaText: {
      ...typography.bodySmall,
      color: colors.textMuted,
    },
    author: {
      color: colors.textPrimary,
      fontWeight: '700',
    },
    actionsBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    playButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.floating,
    },
    trackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      marginBottom: 4,
      borderRadius: Radius.sm,
    },
    trackRowSelected: {
      backgroundColor: colors.highlightRow,
    },
    trackIndex: {
      ...typography.bodyMedium,
      color: colors.textSecondary,
      width: 28,
      textAlign: 'center',
    },
    trackIndexActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    trackThumb: {
      width: 44,
      height: 44,
      borderRadius: Radius.xs,
      backgroundColor: colors.surfaceCard,
      marginLeft: 4,
    },
    trackInfo: {
      flex: 1,
      marginLeft: Spacing.md,
      justifyContent: 'center',
    },
    trackTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      fontSize: 14,
      marginBottom: 2,
    },
    trackTitleActive: {
      color: colors.primary,
    },
    trackArtist: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontSize: 12,
    },
    trackDuration: {
      ...typography.bodySmall,
      color: colors.textMuted,
      marginRight: Spacing.md,
    },
    trackMoreButton: {
      padding: Spacing.xs,
    },
    emptyTracks: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: Spacing.xl,
    },
  });
}

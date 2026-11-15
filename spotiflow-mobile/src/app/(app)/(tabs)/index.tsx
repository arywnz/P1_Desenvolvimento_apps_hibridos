import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { StateView } from '../../../components/StateView';
import { USER_PROFILE } from '../../../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { useLibrary } from '../../../context/LibraryContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useTheme } from '../../../context/ThemeContext';
import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';

const MEDIA_FILTERS = ['Tudo', 'Músicas', 'Playlists'] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const { user } = useAuth();
  const { playlists: localPlaylists } = useLibrary();
  const { playTrack } = usePlayer();
  const [activeFilter, setActiveFilter] =
    useState<(typeof MEDIA_FILTERS)[number]>('Tudo');
  const [refreshing, setRefreshing] = useState(false);

  const fetchChart = useCallback(() => api.getChart(12), []);
  const { data, loading, error, reload } = useFetch(fetchChart);

  const shortcutWidth = Math.floor((width - Spacing.md * 2 - Spacing.sm) / 2);
  const styles = useMemo(
    () => createStyles(colors, typography, shortcutWidth),
    [colors, typography, shortcutWidth]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const apiTracks = data?.tracks ?? [];
  const apiPlaylists = data?.playlists ?? [];
  const apiArtists = data?.artists ?? [];
  const quickShortcuts = (
    apiPlaylists.length > 0 ? apiPlaylists : localPlaylists
  ).slice(0, 6);
  const featuredTrack = apiTracks[0];
  const showTracks = activeFilter === 'Tudo' || activeFilter === 'Músicas';
  const showPlaylists = activeFilter === 'Tudo' || activeFilter === 'Playlists';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.profileGroup}>
            <Pressable
              onPress={() => router.push('/profile')}
              accessibilityRole="button"
              accessibilityLabel="Abrir perfil"
            >
              <Image
                source={
                  USER_PROFILE.avatarSource ?? { uri: USER_PROFILE.avatarUrl }
                }
                style={styles.avatar}
                contentFit="cover"
                accessibilityLabel="Avatar do perfil"
              />
            </Pressable>
            <View>
              <Text style={styles.eyebrow}>
                {user?.plan ?? USER_PROFILE.plan}
              </Text>
              <Text style={styles.title}>
                Boa noite{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.filters} accessibilityRole="tablist">
          {MEDIA_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <StateView
          loading={loading && !data}
          error={!data ? error : null}
          isEmpty={
            Boolean(data) && apiTracks.length === 0 && apiPlaylists.length === 0
          }
          loadingLabel="Buscando sucessos na Deezer..."
          emptyTitle="Nenhuma faixa encontrada"
          emptyDescription="Puxe para baixo ou toque em atualizar para tentar novamente."
          onRetry={() => {
            void reload();
          }}
        >
          {showPlaylists && (
            <View style={styles.shortcutGrid}>
              {quickShortcuts.map((playlist) => (
                <Pressable
                  key={playlist.id}
                  style={styles.shortcutCard}
                  onPress={() =>
                    router.push({
                      pathname: '/playlist/[id]',
                      params: { id: playlist.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir ${playlist.title}`}
                >
                  <Image
                    source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                    style={styles.shortcutCover}
                    contentFit="cover"
                  />
                  <Text style={styles.shortcutTitle} numberOfLines={2}>
                    {playlist.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {showTracks && apiTracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Em alta agora</Text>
              <FlatList
                horizontal
                data={apiTracks}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
                renderItem={({ item: track }) => (
                  <Pressable
                    style={styles.recentCard}
                    onPress={() => playTrack(track, apiTracks)}
                    accessibilityRole="button"
                    accessibilityLabel={`Tocar ${track.title}`}
                  >
                    <Image
                      source={{ uri: track.coverUrl }}
                      style={styles.recentCover}
                      contentFit="cover"
                    />
                    <Text style={styles.recentTitle} numberOfLines={2}>
                      {track.title}
                    </Text>
                    <Text style={styles.recentSubtitle} numberOfLines={1}>
                      {track.artist}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          {featuredTrack && (
            <View style={styles.djCard}>
              <Image
                source={{ uri: featuredTrack.coverUrl }}
                style={styles.djCover}
                contentFit="cover"
              />
              <View style={styles.djContent}>
                <Text style={styles.djEyebrow}>DJ do dia • Top 1</Text>
                <Text style={styles.djTitle} numberOfLines={1}>
                  {featuredTrack.title}
                </Text>
                <Text style={styles.djSubtitle} numberOfLines={2}>
                  {featuredTrack.artist} • {featuredTrack.album}
                </Text>
                <Pressable
                  style={styles.djButton}
                  onPress={() => playTrack(featuredTrack, apiTracks)}
                  accessibilityRole="button"
                  accessibilityLabel={`Tocar ${featuredTrack.title}`}
                >
                  <SymbolView
                    name={{
                      ios: 'play.fill',
                      android: 'play_arrow',
                      web: 'play_arrow',
                    }}
                    size={18}
                    tintColor={colors.onPrimary}
                    type="hierarchical"
                  />
                  <Text style={styles.djButtonText}>Tocar agora</Text>
                </Pressable>
              </View>
            </View>
          )}

          {apiArtists.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Artistas em destaque</Text>
              <FlatList
                horizontal
                data={apiArtists}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
                renderItem={({ item: artist }) => (
                  <Pressable
                    style={styles.artistCard}
                    onPress={() =>
                      router.push({
                        pathname: '/artist/[id]',
                        params: { id: artist.id },
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir artista ${artist.name}`}
                  >
                    <Image
                      source={{ uri: artist.pictureUrl }}
                      style={styles.artistAvatar}
                      contentFit="cover"
                    />
                    <Text style={styles.artistName} numberOfLines={1}>
                      {artist.name}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          {showPlaylists && apiPlaylists.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Playlists recomendadas</Text>
              <FlatList
                horizontal
                data={apiPlaylists}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mixList}
                renderItem={({ item: playlist }) => (
                  <Pressable
                    style={styles.mixCard}
                    onPress={() =>
                      router.push({
                        pathname: '/playlist/[id]',
                        params: { id: playlist.id },
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir playlist ${playlist.title}`}
                  >
                    <Image
                      source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                      style={styles.mixCover}
                      contentFit="cover"
                    />
                    <Text style={styles.mixTitle} numberOfLines={2}>
                      {playlist.title}
                    </Text>
                    <Text style={styles.mixSubtitle} numberOfLines={2}>
                      {playlist.subtitle}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        </StateView>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  shortcutWidth: number
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: 110,
      flexGrow: 1,
    },
    header: {
      marginBottom: Spacing.md,
    },
    profileGroup: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.pill,
    },
    eyebrow: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
    },
    title: {
      ...typography.titleLarge,
    },
    filters: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    filterPill: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElevated,
    },
    filterPillActive: {
      backgroundColor: colors.primary,
    },
    filterText: {
      ...typography.bodySmall,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    filterTextActive: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
    shortcutGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    shortcutCard: {
      width: shortcutWidth,
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundElevated,
      borderRadius: Radius.sm,
      overflow: 'hidden',
    },
    shortcutCover: {
      width: 58,
      height: 58,
    },
    shortcutTitle: {
      ...typography.bodySmall,
      flex: 1,
      fontWeight: '700',
      paddingHorizontal: Spacing.sm,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...typography.titleMedium,
      marginBottom: Spacing.md,
    },
    recentList: {
      gap: Spacing.md,
    },
    recentCard: {
      width: 132,
    },
    recentCover: {
      width: 132,
      height: 132,
      borderRadius: Radius.md,
      marginBottom: Spacing.sm,
    },
    recentTitle: {
      ...typography.bodySmall,
      fontWeight: '700',
      marginBottom: 2,
    },
    recentSubtitle: {
      ...typography.caption,
    },
    artistCard: {
      width: 108,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    artistAvatar: {
      width: 96,
      height: 96,
      borderRadius: Radius.pill,
    },
    artistName: {
      ...typography.bodySmall,
      fontWeight: '600',
      textAlign: 'center',
    },
    djCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.lg,
      padding: Spacing.md,
      gap: Spacing.md,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    djCover: {
      width: 96,
      height: 96,
      borderRadius: Radius.md,
    },
    djContent: {
      flex: 1,
    },
    djEyebrow: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
      marginBottom: 2,
    },
    djTitle: {
      ...typography.titleMedium,
      marginBottom: 4,
    },
    djSubtitle: {
      ...typography.bodySmall,
      marginBottom: Spacing.md,
    },
    djButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.pill,
    },
    djButtonText: {
      ...typography.bodySmall,
      color: colors.onPrimary,
      fontWeight: '700',
    },
    mixList: {
      gap: Spacing.md,
    },
    mixCard: {
      width: 148,
    },
    mixCover: {
      width: 148,
      height: 148,
      borderRadius: Radius.md,
      marginBottom: Spacing.sm,
    },
    mixTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      marginBottom: 2,
    },
    mixSubtitle: {
      ...typography.caption,
    },
  });
}

import { OfflineBanner } from '../../../components/OfflineBanner';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FadeInSection,
  PlayingEqualizer,
  ScalePressable,
} from '../../../components/AnimatedMotion';
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
import { resolveUserAvatar } from '../../../utils/userAvatar';

const MEDIA_FILTERS = ['Tudo', 'Músicas', 'Playlists'] as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const { user } = useAuth();
  const { playlists: localPlaylists } = useLibrary();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [activeFilter, setActiveFilter] =
    useState<(typeof MEDIA_FILTERS)[number]>('Tudo');
  const [refreshing, setRefreshing] = useState(false);

  const fetchChart = useCallback(() => api.getChart(12), []);
  const { data, loading, error, reload } = useFetch(fetchChart, { cacheKey: 'chart:12' });

  const shortcutColumns = width >= 680 ? 3 : 2;
  const shortcutWidth = Math.floor(
    (width - Spacing.md * 2 - Spacing.sm * (shortcutColumns - 1)) /
      shortcutColumns
  );
  const recentCardWidth = Math.min(Math.max(Math.round(width * 0.34), 124), 168);
  const mixCardWidth = Math.min(Math.max(Math.round(width * 0.38), 138), 184);
  const djCoverSize = width < 360 ? 78 : 96;
  const bottomSpacer = 108 + Math.max(insets.bottom, 12);

  const styles = useMemo(
    () =>
      createStyles(
        colors,
        typography,
        shortcutWidth,
        recentCardWidth,
        mixCardWidth,
        djCoverSize,
        bottomSpacer
      ),
    [
      colors,
      typography,
      shortcutWidth,
      recentCardWidth,
      mixCardWidth,
      djCoverSize,
      bottomSpacer,
    ]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const apiTracks = data?.tracks ?? [];
  const apiPlaylists = useMemo(() => data?.playlists ?? [], [data?.playlists]);
  const apiArtists = data?.artists ?? [];
  const quickShortcuts = (
    localPlaylists.length > 0 ? localPlaylists : apiPlaylists
  ).slice(0, 6);
  const recommendedPlaylists = useMemo(
    () => [...localPlaylists.slice(6), ...apiPlaylists],
    [apiPlaylists, localPlaylists]
  );
  const featuredTrack = apiTracks[0];
  const showTracks = activeFilter === 'Tudo' || activeFilter === 'Músicas';
  const showPlaylists = activeFilter === 'Tudo' || activeFilter === 'Playlists';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OfflineBanner />
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
                source={resolveUserAvatar(user)}
                style={styles.avatar}
                contentFit="cover"
                accessibilityLabel="Avatar do perfil"
              />
            </Pressable>
            <View style={styles.greetingGroup}>
              <Text style={styles.eyebrow}>
                {user?.plan ?? USER_PROFILE.plan}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {getGreeting()}
                {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
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
            <FadeInSection delay={40} style={styles.shortcutGrid}>
              {quickShortcuts.map((playlist) => (
                <ScalePressable
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
                </ScalePressable>
              ))}
            </FadeInSection>
          )}

          {showTracks && apiTracks.length > 0 && (
            <FadeInSection delay={90} style={styles.section}>
              <Text style={styles.sectionTitle}>Em alta agora</Text>
              <FlatList
                horizontal
                data={apiTracks}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
                renderItem={({ item: track }) => {
                  const isActiveTrack = currentTrack?.id === track.id;
                  return (
                    <ScalePressable
                      style={styles.recentCard}
                      onPress={() => {
                        playTrack(track, apiTracks);
                        router.push('/player');
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Tocar ${track.title}`}
                    >
                      <Image
                        source={{ uri: track.coverUrl }}
                        style={styles.recentCover}
                        contentFit="cover"
                      />
                      <View style={styles.trackHeadingRow}>
                        {isActiveTrack && isPlaying && (
                          <PlayingEqualizer
                            isPlaying={isPlaying}
                            color={colors.primary}
                            size={12}
                          />
                        )}
                        <Text
                          style={[
                            styles.recentTitle,
                            isActiveTrack && styles.activeTrackText,
                          ]}
                          numberOfLines={2}
                        >
                          {track.title}
                        </Text>
                      </View>
                      <Text style={styles.recentSubtitle} numberOfLines={1}>
                        {track.artist}
                      </Text>
                    </ScalePressable>
                  );
                }}
              />
            </FadeInSection>
          )}

          {featuredTrack && (
            <FadeInSection delay={140} style={styles.djCard}>
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
                <ScalePressable
                  style={styles.djButton}
                  onPress={() => {
                    playTrack(featuredTrack, apiTracks);
                    router.push('/player');
                  }}
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
                </ScalePressable>
              </View>
            </FadeInSection>
          )}

          {apiArtists.length > 0 && (
            <FadeInSection delay={180} style={styles.section}>
              <Text style={styles.sectionTitle}>Artistas em destaque</Text>
              <FlatList
                horizontal
                data={apiArtists}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
                renderItem={({ item: artist }) => (
                  <ScalePressable
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
                  </ScalePressable>
                )}
              />
            </FadeInSection>
          )}

          {showPlaylists && recommendedPlaylists.length > 0 && (
            <FadeInSection delay={220} style={styles.section}>
              <Text style={styles.sectionTitle}>Playlists recomendadas</Text>
              <FlatList
                horizontal
                data={recommendedPlaylists}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mixList}
                renderItem={({ item: playlist }) => (
                  <ScalePressable
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
                  </ScalePressable>
                )}
              />
            </FadeInSection>
          )}
        </StateView>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  shortcutWidth: number,
  recentCardWidth: number,
  mixCardWidth: number,
  djCoverSize: number,
  bottomSpacer: number
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
      paddingBottom: bottomSpacer,
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
    greetingGroup: {
      flex: 1,
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
      width: recentCardWidth,
    },
    recentCover: {
      width: recentCardWidth,
      height: recentCardWidth,
      borderRadius: Radius.md,
      marginBottom: Spacing.sm,
      backgroundColor: colors.surfaceCard,
    },
    trackHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 2,
    },
    recentTitle: {
      ...typography.bodySmall,
      fontWeight: '700',
      flexShrink: 1,
    },
    activeTrackText: {
      color: colors.primary,
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
      width: djCoverSize,
      height: djCoverSize,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElevated,
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
      width: mixCardWidth,
    },
    mixCover: {
      width: mixCardWidth,
      height: mixCardWidth,
      borderRadius: Radius.md,
      marginBottom: Spacing.sm,
      backgroundColor: colors.surfaceCard,
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

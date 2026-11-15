import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StateView } from '../../../components/StateView';
import {
  MOCK_PLAYLISTS,
  SEARCH_CATEGORIES,
  USER_PROFILE,
} from '../../../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { usePlayer } from '../../../context/PlayerContext';
import { useTheme } from '../../../context/ThemeContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { api } from '../../../services/api';
import type { Track } from '../../../types/music';

const PAGE_SIZE = 20;

export default function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const { playTrack, currentTrack, addToQueue } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery.trim(), 450);

  const [results, setResults] = useState<Track[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCounterRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const categoryWidth = Math.floor((width - Spacing.md * 3) / 2);
  const styles = useMemo(
    () => createStyles(colors, typography, categoryWidth),
    [colors, typography, categoryWidth]
  );

  const runInitialSearch = useCallback(async (query: string) => {
    const clean = query.trim();
    if (!clean) {
      setResults([]);
      setTotalResults(0);
      setNextIndex(0);
      setHasMore(false);
      setError(null);
      setLoading(false);
      return;
    }

    const requestId = ++requestCounterRef.current;
    setLoading(true);
    setError(null);

    try {
      const page = await api.searchTracks(clean, 0, PAGE_SIZE);
      if (requestId === requestCounterRef.current) {
        setResults(page.tracks);
        setTotalResults(page.total);
        setNextIndex(page.nextIndex);
        setHasMore(page.hasMore);
      }
    } catch (err) {
      if (requestId === requestCounterRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao buscar músicas na Deezer.'
        );
      }
    } finally {
      if (requestId === requestCounterRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => runInitialSearch(debouncedQuery));
  }, [debouncedQuery, runInitialSearch]);

  const loadMore = async () => {
    if (!debouncedQuery || !hasMore || loadingMoreRef.current || loading) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const page = await api.searchTracks(debouncedQuery, nextIndex, PAGE_SIZE);
      setResults((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNext = page.tracks.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...uniqueNext];
      });
      setNextIndex(page.nextIndex);
      setHasMore(page.hasMore);
    } catch {
      // Mantém os itens já carregados caso uma página extra falhe.
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    if (!debouncedQuery) return;
    setRefreshing(true);
    await runInitialSearch(debouncedQuery);
    setRefreshing(false);
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topSection}>
        {/* Cabeçalho */}
        <View style={styles.header}>
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
            />
          </Pressable>

          <Text style={styles.headerTitle}>Buscar</Text>

          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Buscar com câmera"
          >
            <SymbolView
              name={{
                ios: 'camera',
                android: 'photo_camera',
                web: 'photo_camera',
              }}
              size={24}
              tintColor={colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Barra de Busca fixa fora da FlatList para não perder foco */}
        <View style={styles.searchBarContainer}>
          <SymbolView
            name={{
              ios: 'magnifyingglass',
              android: 'search',
              web: 'search',
            }}
            size={22}
            tintColor={colors.searchBarText}
            type="hierarchical"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Músicas, artistas ou estilos..."
            placeholderTextColor={colors.searchBarPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              hitSlop={8}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
            >
              <SymbolView
                name={{
                  ios: 'xmark.circle.fill',
                  android: 'cancel',
                  web: 'cancel',
                }}
                size={18}
                tintColor={colors.searchBarPlaceholder}
                type="hierarchical"
              />
            </Pressable>
          )}
        </View>
      </View>

      {isSearching ? (
        <StateView
          loading={loading || searchQuery.trim() !== debouncedQuery}
          error={error}
          isEmpty={results.length === 0}
          loadingLabel="Buscando faixas na Deezer..."
          emptyTitle="Nenhum resultado encontrado"
          emptyDescription={`Não encontramos músicas para "${debouncedQuery}".`}
          onRetry={() => {
            void runInitialSearch(debouncedQuery);
          }}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            style={styles.container}
            contentContainerStyle={styles.resultsContent}
            keyboardShouldPersistTaps="handled"
            onEndReached={() => {
              void loadMore();
            }}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListHeaderComponent={
              <Text style={styles.resultsHeader}>
                {totalResults > 0
                  ? `${totalResults.toLocaleString('pt-BR')} resultados na Deezer`
                  : 'Resultados'}
              </Text>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : undefined
            }
            renderItem={({ item: track }) => {
              const isSelected = currentTrack?.id === track.id;
              return (
                <Pressable
                  style={styles.trackRow}
                  onPress={() => playTrack(track, results)}
                  accessibilityRole="button"
                  accessibilityLabel={`Tocar ${track.title} de ${track.artist}`}
                >
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
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/artist/[id]',
                          params: {
                            id:
                              track.artistId ??
                              encodeURIComponent(track.artist),
                          },
                        })
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Abrir artista ${track.artist}`}
                    >
                      <Text style={styles.trackSubtitle} numberOfLines={1}>
                        {track.artist} • {track.duration}
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    hitSlop={8}
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
        </StateView>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Carrossel de Destaques */}
          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>
              Playlists que você pode assistir
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {MOCK_PLAYLISTS.slice(0, 3).map((playlist) => (
                <Pressable
                  key={playlist.id}
                  style={styles.featuredCard}
                  onPress={() =>
                    router.push({
                      pathname: '/playlist/[id]',
                      params: { id: playlist.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Ver ${playlist.title}`}
                >
                  <Image
                    source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                    style={styles.featuredCover}
                    contentFit="cover"
                  />
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredBadge}>VÍDEOS PARA VOCÊ</Text>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      {playlist.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Grid de Seções e Gêneros Musicais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Navegar por todas as seções
            </Text>
            <View style={styles.gridContainer}>
              {SEARCH_CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: category.color },
                  ]}
                  onPress={() => setSearchQuery(category.title)}
                  accessibilityRole="button"
                  accessibilityLabel={`Buscar ${category.title}`}
                >
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Image
                    source={{ uri: category.imageUrl }}
                    style={styles.categoryImage}
                    contentFit="cover"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  categoryWidth: number
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topSection: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.md,
      paddingBottom: 110,
    },
    resultsContent: {
      paddingHorizontal: Spacing.md,
      paddingBottom: 110,
      gap: Spacing.xs,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundCard,
    },
    headerTitle: {
      ...typography.titleLarge,
      fontSize: 24,
      flex: 1,
      marginLeft: Spacing.md,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchBarBg,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      height: 48,
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.searchBarText,
      height: '100%',
    },
    resultsHeader: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: Spacing.xs,
    },
    trackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs + 2,
      gap: Spacing.sm,
    },
    trackCover: {
      width: 48,
      height: 48,
      borderRadius: Radius.sm,
      backgroundColor: colors.surfaceCard,
    },
    trackInfo: {
      flex: 1,
      gap: 2,
    },
    trackTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
    },
    trackTitleActive: {
      color: colors.primary,
    },
    trackSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    footerLoader: {
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    carouselSection: {
      marginBottom: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...typography.titleMedium,
      fontSize: 18,
      marginBottom: Spacing.md,
    },
    horizontalScroll: {
      gap: Spacing.md,
      paddingRight: Spacing.md,
    },
    featuredCard: {
      width: 150,
      height: 200,
      borderRadius: Radius.md,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.backgroundCard,
    },
    featuredCover: {
      width: '100%',
      height: '100%',
    },
    featuredOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.sm,
      backgroundColor: colors.overlayCard,
    },
    featuredBadge: {
      backgroundColor: colors.accentPink,
      color: colors.badgeText,
      fontSize: 9,
      fontWeight: '900',
      alignSelf: 'flex-start',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 2,
      marginBottom: 4,
    },
    featuredTitle: {
      ...typography.bodyMedium,
      color: colors.badgeText,
      fontWeight: '700',
      fontSize: 13,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: categoryWidth,
      height: 96,
      borderRadius: Radius.md,
      padding: Spacing.sm,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'flex-start',
    },
    categoryTitle: {
      ...typography.titleMedium,
      color: colors.badgeText,
      fontSize: 15,
      maxWidth: '75%',
    },
    categoryImage: {
      width: 64,
      height: 64,
      position: 'absolute',
      bottom: -6,
      right: -12,
      transform: [{ rotate: '25deg' }],
      borderRadius: Radius.xs,
    },
  });
}

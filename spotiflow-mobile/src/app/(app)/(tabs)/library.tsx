import { OfflineBanner } from '../../../components/OfflineBanner';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScalePressable } from '../../../components/AnimatedMotion';
import { StateView } from '../../../components/StateView';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { useLibrary } from '../../../context/LibraryContext';
import { useTheme } from '../../../context/ThemeContext';
import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';
import type { Playlist } from '../../../types/music';
import { resolveUserAvatar } from '../../../utils/userAvatar';

const LIBRARY_FILTERS = ['Playlists', 'Baixado', 'Deezer'] as const;

export default function LibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const { user } = useAuth();
  const { playlists: localPlaylists, downloadedIds } = useLibrary();

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const gridColumns = width >= 680 ? 3 : 2;
  const gridCardWidth = Math.floor(
    (width - Spacing.md * 2 - Spacing.md * (gridColumns - 1)) / gridColumns
  );
  const bottomSpacer = 108 + Math.max(insets.bottom, 12);

  const styles = useMemo(
    () => createStyles(colors, typography, gridCardWidth, bottomSpacer),
    [colors, typography, gridCardWidth, bottomSpacer]
  );

  const fetchChart = useCallback(() => api.getChart(10), []);
  const { data, loading, error, reload } = useFetch(fetchChart, { cacheKey: 'chart:10' });

  const mergedPlaylists = useMemo<Playlist[]>(() => {
    const apiPlaylists = data?.playlists ?? [];
    const seenIds = new Set(localPlaylists.map((p) => p.id));
    const uniqueApi = apiPlaylists.filter((p) => !seenIds.has(p.id));
    return [...localPlaylists, ...uniqueApi];
  }, [data?.playlists, localPlaylists]);

  const displayedPlaylists = useMemo(() => {
    const apiIds = new Set((data?.playlists ?? []).map((p) => p.id));
    const filtered = mergedPlaylists.filter((playlist) => {
      if (selectedFilter === 'Playlists') {
        return !apiIds.has(playlist.id);
      }
      if (selectedFilter === 'Baixado') {
        return downloadedIds.includes(playlist.id) || Boolean(playlist.isDownloaded);
      }
      if (selectedFilter === 'Deezer') {
        return apiIds.has(playlist.id);
      }
      return true;
    });

    if (sortAlphabetical) {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    }
    return filtered;
  }, [data?.playlists, downloadedIds, mergedPlaylists, selectedFilter, sortAlphabetical]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OfflineBanner />
      <FlatList
        key={`${isGridView ? 'grid' : 'list'}-${gridColumns}`}
        data={displayedPlaylists}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? gridColumns : 1}
        columnWrapperStyle={isGridView ? styles.gridRow : undefined}
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
        ListHeaderComponent={
          <>
            {/* Cabeçalho da Biblioteca */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.push('/profile')}
                accessibilityRole="button"
                accessibilityLabel="Abrir perfil"
              >
                <Image
                  source={resolveUserAvatar(user)}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </Pressable>

              <Text style={styles.headerTitle}>Sua Biblioteca</Text>

              <View style={styles.headerIcons}>
                <Pressable
                  hitSlop={8}
                  onPress={() => router.push('/search')}
                  accessibilityRole="button"
                  accessibilityLabel="Buscar na biblioteca"
                >
                  <SymbolView
                    name={{
                      ios: 'magnifyingglass',
                      android: 'search',
                      web: 'search',
                    }}
                    size={24}
                    tintColor={colors.textPrimary}
                    type="hierarchical"
                  />
                </Pressable>

                <Pressable
                  hitSlop={8}
                  onPress={() => router.push('/create-modal')}
                  accessibilityRole="button"
                  accessibilityLabel="Criar nova playlist"
                >
                  <SymbolView
                    name={{
                      ios: 'plus',
                      android: 'add',
                      web: 'add',
                    }}
                    size={26}
                    tintColor={colors.textPrimary}
                    type="hierarchical"
                  />
                </Pressable>
              </View>
            </View>

            {/* Filtros em Pílula */}
            <View style={styles.filtersContainer}>
              {LIBRARY_FILTERS.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterPill,
                      isSelected && styles.filterPillActive,
                    ]}
                    onPress={() =>
                      setSelectedFilter(isSelected ? null : filter)
                    }
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isSelected && styles.filterTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Barra de Ordenação */}
            <View style={styles.sortBar}>
              <Pressable
                style={styles.sortButton}
                hitSlop={8}
                onPress={() => setSortAlphabetical((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Alternar ordenação das playlists"
              >
                <SymbolView
                  name={{
                    ios: 'arrow.up.arrow.down',
                    android: 'swap_vert',
                    web: 'swap_vert',
                  }}
                  size={18}
                  tintColor={sortAlphabetical ? colors.primary : colors.textPrimary}
                  type="hierarchical"
                />
                <Text style={styles.sortText}>
                  {sortAlphabetical ? 'Alfabética A–Z' : 'Recentes'} (
                  {displayedPlaylists.length})
                </Text>
              </Pressable>

              <Pressable
                hitSlop={8}
                onPress={() => setIsGridView((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={
                  isGridView
                    ? 'Alternar para visualização em lista'
                    : 'Alternar para visualização em grade'
                }
              >
                <SymbolView
                  name={{
                    ios: isGridView ? 'list.bullet' : 'square.grid.2x2',
                    android: isGridView ? 'view_list' : 'grid_view',
                    web: isGridView ? 'view_list' : 'grid_view',
                  }}
                  size={20}
                  tintColor={isGridView ? colors.primary : colors.textPrimary}
                  type="hierarchical"
                />
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <StateView
            loading={loading && mergedPlaylists.length === 0}
            error={mergedPlaylists.length === 0 ? error : null}
            isEmpty={displayedPlaylists.length === 0}
            emptyTitle="Nenhuma playlist neste filtro"
            emptyDescription="Toque no filtro novamente ou crie uma nova playlist no botão +."
            onRetry={() => {
              void reload();
            }}
          >
            {null}
          </StateView>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: playlist }) => (
          <ScalePressable
            style={isGridView ? styles.gridCard : styles.playlistItem}
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
              style={isGridView ? styles.gridCover : styles.playlistCover}
              contentFit="cover"
            />

            <View style={isGridView ? styles.gridInfo : styles.playlistInfo}>
              <Text
                style={[
                  styles.playlistTitle,
                  playlist.id === 'echos-of-us' && styles.playlistTitleGreen,
                ]}
                numberOfLines={1}
              >
                {playlist.title}
              </Text>

              <View style={styles.playlistMetaRow}>
                {playlist.isPinned && (
                  <SymbolView
                    name={{
                      ios: 'pin.fill',
                      android: 'push_pin',
                      web: 'push_pin',
                    }}
                    size={13}
                    tintColor={colors.primary}
                    type="hierarchical"
                  />
                )}
                {playlist.isMixed && (
                  <SymbolView
                    name={{
                      ios: 'slider.horizontal.3',
                      android: 'tune',
                      web: 'tune',
                    }}
                    size={13}
                    tintColor={colors.textSecondary}
                    type="hierarchical"
                  />
                )}
                {playlist.isDownloaded && (
                  <SymbolView
                    name={{
                      ios: 'arrow.down.circle.fill',
                      android: 'download_for_offline',
                      web: 'download_for_offline',
                    }}
                    size={13}
                    tintColor={colors.primary}
                    type="hierarchical"
                  />
                )}
                <Text style={styles.playlistSubtitle} numberOfLines={1}>
                  {playlist.subtitle}
                </Text>
              </View>
            </View>
          </ScalePressable>
        )}
      />
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  gridCardWidth: number,
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
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginRight: Spacing.md,
    },
    headerTitle: {
      ...typography.titleLarge,
      flex: 1,
      fontSize: 22,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    filtersContainer: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    filterPill: {
      backgroundColor: colors.backgroundElevated,
      paddingHorizontal: Spacing.md,
      paddingVertical: 7,
      borderRadius: Radius.pill,
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
    sortBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    sortText: {
      ...typography.bodySmall,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    separator: {
      height: Spacing.md,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    playlistCover: {
      width: 64,
      height: 64,
      borderRadius: Radius.xs,
      backgroundColor: colors.surfaceCard,
    },
    gridRow: {
      gap: Spacing.md,
      justifyContent: 'flex-start',
    },
    gridCard: {
      width: gridCardWidth,
      gap: Spacing.xs,
    },
    gridCover: {
      width: gridCardWidth,
      height: gridCardWidth,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceCard,
    },
    gridInfo: {
      gap: 2,
    },
    playlistInfo: {
      flex: 1,
      justifyContent: 'center',
      gap: 3,
    },
    playlistTitle: {
      ...typography.bodyMedium,
      fontWeight: '600',
      fontSize: 16,
    },
    playlistTitleGreen: {
      color: colors.primary,
    },
    playlistMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    playlistSubtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontSize: 13,
      flex: 1,
    },
  });
}

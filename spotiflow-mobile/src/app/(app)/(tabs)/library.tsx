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
import { useLibrary } from '../../../context/LibraryContext';
import { useTheme } from '../../../context/ThemeContext';
import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';
import type { Playlist } from '../../../types/music';

const LIBRARY_FILTERS = ['Playlists', 'Baixado', 'Deezer'] as const;

export default function LibraryScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const { playlists: localPlaylists } = useLibrary();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChart = useCallback(() => api.getChart(10), []);
  const { data, loading, error, reload } = useFetch(fetchChart);

  const mergedPlaylists = useMemo<Playlist[]>(() => {
    const apiPlaylists = data?.playlists ?? [];
    const seenIds = new Set(localPlaylists.map((p) => p.id));
    const uniqueApi = apiPlaylists.filter((p) => !seenIds.has(p.id));
    return [...localPlaylists, ...uniqueApi];
  }, [data?.playlists, localPlaylists]);

  const displayedPlaylists = useMemo(() => {
    const apiIds = new Set((data?.playlists ?? []).map((p) => p.id));
    return mergedPlaylists.filter((playlist) => {
      if (selectedFilter === 'Baixado') {
        return Boolean(playlist.isDownloaded);
      }
      if (selectedFilter === 'Deezer') {
        return apiIds.has(playlist.id);
      }
      return true;
    });
  }, [data?.playlists, mergedPlaylists, selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={displayedPlaylists}
        keyExtractor={(item) => item.id}
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
                  source={
                    USER_PROFILE.avatarSource ?? { uri: USER_PROFILE.avatarUrl }
                  }
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
              <Pressable style={styles.sortButton} hitSlop={8}>
                <SymbolView
                  name={{
                    ios: 'arrow.up.arrow.down',
                    android: 'swap_vert',
                    web: 'swap_vert',
                  }}
                  size={18}
                  tintColor={colors.textPrimary}
                  type="hierarchical"
                />
                <Text style={styles.sortText}>
                  Recentes ({displayedPlaylists.length})
                </Text>
              </Pressable>

              <Pressable hitSlop={8}>
                <SymbolView
                  name={{
                    ios: 'square.grid.2x2',
                    android: 'grid_view',
                    web: 'grid_view',
                  }}
                  size={20}
                  tintColor={colors.textPrimary}
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
          <Pressable
            style={styles.playlistItem}
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
              style={styles.playlistCover}
              contentFit="cover"
            />

            <View style={styles.playlistInfo}>
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
          </Pressable>
        )}
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

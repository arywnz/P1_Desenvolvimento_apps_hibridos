import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_PLAYLISTS, USER_PROFILE } from '../../constants/mockData';
import { Colors, Spacing, Typography } from '../../constants/theme';

const LIBRARY_FILTERS = ['Playlists', 'Baixado'];

export default function LibraryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const displayedPlaylists = MOCK_PLAYLISTS.filter((playlist) => {
    if (selectedFilter === 'Baixado') {
      return playlist.isDownloaded;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho da Biblioteca */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
          >
            <Image
              source={{ uri: USER_PROFILE.avatarUrl }}
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
                tintColor={Colors.textPrimary}
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
                tintColor={Colors.textPrimary}
                type="hierarchical"
              />
            </Pressable>
          </View>
        </View>

        {/* Filtros em Pílula (Playlists, Baixado) */}
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

        {/* Barra de Ordenação: Recentes e Botão de Grid */}
        <View style={styles.sortBar}>
          <Pressable style={styles.sortButton} hitSlop={8}>
            <SymbolView
              name={{
                ios: 'arrow.up.arrow.down',
                android: 'swap_vert',
                web: 'swap_vert',
              }}
              size={18}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <Text style={styles.sortText}>Recentes</Text>
          </Pressable>

          <Pressable hitSlop={8}>
            <SymbolView
              name={{
                ios: 'square.grid.2x2',
                android: 'grid_view',
                web: 'grid_view',
              }}
              size={20}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Lista de Playlists e Músicas Curtidas */}
        <View style={styles.playlistList}>
          {displayedPlaylists.map((playlist) => (
            <Pressable
              key={playlist.id}
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
                source={{ uri: playlist.coverUrl }}
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
                      tintColor={Colors.primary}
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
                      tintColor={Colors.textSecondary}
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
                      tintColor={Colors.primary}
                      type="hierarchical"
                    />
                  )}
                  <Text style={styles.playlistSubtitle} numberOfLines={1}>
                    {playlist.subtitle}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
  },
  headerTitle: {
    ...Typography.titleLarge,
    fontSize: 24,
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterPill: {
    minHeight: 34,
    borderRadius: 17,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundCard,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
  },
  filterTextActive: {
    color: Colors.background,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
  },
  playlistList: {
    gap: Spacing.sm,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  playlistCover: {
    width: 64,
    height: 64,
    borderRadius: 4,
    backgroundColor: Colors.surfaceCard,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  playlistTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  playlistTitleGreen: {
    color: Colors.primary,
  },
  playlistMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playlistSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
});

import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/theme';
import {
  CURRENT_TRACK,
  MOCK_PLAYLISTS,
  USER_PROFILE,
} from '../../constants/mockData';

const MEDIA_FILTERS = ['Tudo', 'Musicas', 'Podcasts'];
const QUICK_SHORTCUTS = MOCK_PLAYLISTS.slice(0, 6);
const RECENT_TRACKS = MOCK_PLAYLISTS[0]?.tracks.length
  ? MOCK_PLAYLISTS[0].tracks
  : [CURRENT_TRACK];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState(MEDIA_FILTERS[0]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileGroup}>
            <Image
              source={{ uri: USER_PROFILE.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              accessibilityLabel="Avatar do perfil"
            />
            <View>
              <Text style={styles.eyebrow}>{USER_PROFILE.plan}</Text>
              <Text style={styles.title}>Boa noite</Text>
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

        <View style={styles.shortcutGrid}>
          {QUICK_SHORTCUTS.map((playlist) => (
            <Pressable
              key={playlist.id}
              style={styles.shortcutCard}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${playlist.title}`}
            >
              <Image
                source={{ uri: playlist.coverUrl }}
                style={styles.shortcutCover}
                contentFit="cover"
              />
              <Text style={styles.shortcutTitle} numberOfLines={2}>
                {playlist.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tocadas recentemente</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
          >
            {RECENT_TRACKS.map((track) => (
              <Pressable
                key={track.id}
                style={styles.recentCard}
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
            ))}
          </ScrollView>
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
    paddingBottom: 96,
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
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
  },
  eyebrow: {
    ...Typography.bodySmall,
    marginBottom: 2,
  },
  title: {
    ...Typography.titleLarge,
    fontSize: 24,
  },
  filters: {
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
  },
  filterTextActive: {
    color: Colors.background,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  shortcutCard: {
    width: '48.7%',
    minHeight: 64,
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
  },
  shortcutCover: {
    width: 64,
    height: 64,
    backgroundColor: Colors.surfaceCard,
  },
  shortcutTitle: {
    ...Typography.bodyMedium,
    flex: 1,
    paddingHorizontal: Spacing.sm,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.titleLarge,
  },
  recentList: {
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  recentCard: {
    width: 132,
  },
  recentCover: {
    width: 132,
    height: 132,
    borderRadius: 6,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceCard,
  },
  recentTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  recentSubtitle: {
    ...Typography.bodySmall,
  },
});

import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FRIENDS_ACTIVITY, MOCK_PLAYLISTS } from '../constants/mockData';
import { Colors, Spacing, Typography } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';

export default function FriendProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = usePlayer();

  const friend =
    FRIENDS_ACTIVITY.find((f) => f.id === id) || FRIENDS_ACTIVITY[0];
  const previewTracks = friend.playlists
    .flatMap((playlist) => playlist.tracks)
    .slice(0, 5);

  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.header}>
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
            tintColor={Colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {friend.name}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner do Perfil do Amigo */}
        <View style={styles.profileHero}>
          <Image
            source={{ uri: friend.avatarUrl }}
            style={styles.heroAvatar}
            contentFit="cover"
          />
          <Text style={styles.heroName}>{friend.name}</Text>
          <Text style={styles.heroFollowers}>14 seguidores • 22 seguindo</Text>

          {/* Botão Seguir */}
          <Pressable
            style={[styles.followButton, isFollowing && styles.followButtonActive]}
            onPress={() => setIsFollowing(!isFollowing)}
            accessibilityRole="button"
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </Text>
          </Pressable>
        </View>

        {/* Ouvindo agora (Atividade em Tempo Real) */}
        {friend.currentTrack && (
          <View style={styles.activityBox}>
            <View style={styles.activityBadgeRow}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activityBadgeText}>OUVINDO AGORA</Text>
            </View>

            <View style={styles.activityTrackRow}>
              <View style={styles.activityTrackTextGroup}>
                <Text style={styles.activityTrackTitle}>{friend.currentTrack}</Text>
                <Text style={styles.activityTrackArtist}>{friend.currentArtist}</Text>
              </View>

              <Pressable
                style={styles.activityPlayButton}
                onPress={() => {
                  // Inicia reprodução
                  if (MOCK_PLAYLISTS[0].tracks.length > 0) {
                    playTrack(MOCK_PLAYLISTS[0].tracks[0]);
                  }
                }}
                accessibilityRole="button"
              >
                <SymbolView
                  name={{
                    ios: 'play.fill',
                    android: 'play_arrow',
                    web: 'play_arrow',
                  }}
                  size={20}
                  tintColor={Colors.background}
                  type="hierarchical"
                />
              </Pressable>
            </View>
          </View>
        )}

        {previewTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Musicas do amigo</Text>
            <View style={styles.trackPreviewList}>
              {previewTracks.map((track) => (
                <Pressable
                  key={track.id}
                  style={styles.trackPreviewRow}
                  onPress={() => playTrack(track)}
                  accessibilityRole="button"
                  accessibilityLabel={`Tocar ${track.title} de ${track.artist}`}
                >
                  <Image
                    source={{ uri: track.coverUrl }}
                    style={styles.trackPreviewCover}
                    contentFit="cover"
                  />
                  <View style={styles.trackPreviewTextGroup}>
                    <Text style={styles.trackPreviewTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.trackPreviewArtist} numberOfLines={1}>
                      {track.artist}
                    </Text>
                  </View>
                  <Text style={styles.trackPreviewDuration}>{track.duration}</Text>
                  <SymbolView
                    name={{
                      ios: 'play.circle.fill',
                      android: 'play_circle',
                      web: 'play_circle',
                    }}
                    size={28}
                    tintColor={Colors.primary}
                    type="hierarchical"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Playlists Públicas Exclusivas do Amigo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playlists públicas</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistGrid}
          >
            {friend.playlists.map((playlist) => {
              const firstTrack = playlist.tracks[0];

              return (
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
                    source={{ uri: playlist.coverUrl }}
                    style={styles.playlistCover}
                    contentFit="cover"
                  />
                  <Text style={styles.playlistTitle} numberOfLines={1}>
                    {playlist.title}
                  </Text>
                  <Text style={styles.playlistSubtitle} numberOfLines={1}>
                    {playlist.tracksCount} faixas • De {friend.name}
                  </Text>
                  {firstTrack && (
                    <Text style={styles.playlistPreview} numberOfLines={1}>
                      Comeca com {firstTrack.title}
                    </Text>
                  )}
                </Pressable>
              );
            })}
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
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleMedium,
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  profileHero: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  heroAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.surfaceCard,
    marginBottom: Spacing.md,
  },
  heroName: {
    ...Typography.titleLarge,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroFollowers: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  followButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  followButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  followButtonText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  followButtonTextActive: {
    color: Colors.background,
  },
  activityBox: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  activityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  activityBadgeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activityTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTrackTextGroup: {
    flex: 1,
  },
  activityTrackTitle: {
    ...Typography.titleMedium,
    fontSize: 16,
    fontWeight: '700',
  },
  activityTrackArtist: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activityPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    fontSize: 16,
  },
  trackPreviewList: {
    gap: Spacing.xs,
  },
  trackPreviewRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: Colors.surfaceCard,
  },
  trackPreviewCover: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: Colors.backgroundCard,
  },
  trackPreviewTextGroup: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  trackPreviewTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 14,
  },
  trackPreviewArtist: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  trackPreviewDuration: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  playlistGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  playlistCard: {
    width: 140,
  },
  playlistCover: {
    width: 140,
    height: 140,
    borderRadius: 6,
    backgroundColor: Colors.surfaceCard,
    marginBottom: 6,
  },
  playlistTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
  },
  playlistSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  playlistPreview: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

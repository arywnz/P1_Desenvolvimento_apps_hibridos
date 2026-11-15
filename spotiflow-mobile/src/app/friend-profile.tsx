import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FRIENDS_ACTIVITY, MOCK_PLAYLISTS } from '../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

export default function FriendProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
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
            tintColor={colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {friend.name}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner do Perfil do Amigo */}
        <View style={styles.profileHero}>
          <Image
            source={friend.avatarSource ?? { uri: friend.avatarUrl }}
            style={styles.heroAvatar}
            contentFit="cover"
          />
          <Text style={styles.heroName}>{friend.name}</Text>
          <Text style={styles.heroFollowers}>14 seguidores • 22 seguindo</Text>

          <Pressable
            style={[
              styles.followButton,
              isFollowing && styles.followButtonActive,
            ]}
            onPress={() => setIsFollowing(!isFollowing)}
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
        </View>

        {/* Ouvindo agora */}
        {friend.currentTrack && (
          <View style={styles.activityBox}>
            <View style={styles.activityBadgeRow}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activityBadgeText}>OUVINDO AGORA</Text>
            </View>

            <View style={styles.activityTrackRow}>
              <View style={styles.activityTrackTextGroup}>
                <Text style={styles.activityTrackTitle}>
                  {friend.currentTrack}
                </Text>
                <Text style={styles.activityTrackArtist}>
                  {friend.currentArtist}
                </Text>
              </View>

              <Pressable
                style={styles.activityPlayButton}
                onPress={() => {
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
                  tintColor={colors.onPrimary}
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
                  <Text style={styles.trackPreviewDuration}>
                    {track.duration}
                  </Text>
                  <SymbolView
                    name={{
                      ios: 'play.circle.fill',
                      android: 'play_circle',
                      web: 'play_circle',
                    }}
                    size={28}
                    tintColor={colors.primary}
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
                    source={playlist.coverSource ?? { uri: playlist.coverUrl }}
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

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.titleMedium,
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
      backgroundColor: colors.surfaceCard,
      marginBottom: Spacing.md,
    },
    heroName: {
      ...typography.titleLarge,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 4,
    },
    heroFollowers: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: Spacing.md,
    },
    followButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: 8,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: colors.textSecondary,
    },
    followButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    followButtonText: {
      ...typography.bodyMedium,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    followButtonTextActive: {
      color: colors.onPrimary,
    },
    activityBox: {
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.lg,
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
      backgroundColor: colors.primary,
    },
    activityBadgeText: {
      ...typography.caption,
      color: colors.primary,
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
      ...typography.titleMedium,
      fontSize: 16,
      fontWeight: '700',
    },
    activityTrackArtist: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginTop: 2,
    },
    activityPlayButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      gap: Spacing.sm,
    },
    sectionTitle: {
      ...typography.titleMedium,
      fontSize: 16,
    },
    trackPreviewList: {
      gap: Spacing.xs,
    },
    trackPreviewRow: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Radius.md,
      paddingVertical: 6,
      paddingHorizontal: 6,
      backgroundColor: colors.surfaceCard,
    },
    trackPreviewCover: {
      width: 44,
      height: 44,
      borderRadius: Radius.xs,
      backgroundColor: colors.backgroundCard,
    },
    trackPreviewTextGroup: {
      flex: 1,
      marginLeft: Spacing.sm,
    },
    trackPreviewTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      fontSize: 14,
    },
    trackPreviewArtist: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginTop: 2,
    },
    trackPreviewDuration: {
      ...typography.caption,
      color: colors.textMuted,
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
      borderRadius: Radius.sm,
      backgroundColor: colors.surfaceCard,
      marginBottom: 6,
    },
    playlistTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      fontSize: 13,
    },
    playlistSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    playlistPreview: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}

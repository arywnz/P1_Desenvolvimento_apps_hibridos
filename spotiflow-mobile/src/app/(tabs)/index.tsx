import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CURRENT_TRACK,
  MOCK_PLAYLISTS,
  USER_PROFILE,
} from '../../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';

const MEDIA_FILTERS = ['Tudo', 'Musicas', 'Podcasts'];
const QUICK_SHORTCUTS = MOCK_PLAYLISTS.slice(0, 6);
const RECENT_TRACKS = MOCK_PLAYLISTS[0]?.tracks.length
  ? MOCK_PLAYLISTS[0].tracks
  : [CURRENT_TRACK];
const DJ_PLAYLIST = MOCK_PLAYLISTS[0];
const RECOMMENDED_MIXES = MOCK_PLAYLISTS.slice(1, 5);

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const [activeFilter, setActiveFilter] = useState(MEDIA_FILTERS[0]);
  const { playTrack } = usePlayer();

  const shortcutWidth = Math.floor((width - Spacing.md * 2 - Spacing.sm) / 2);
  const styles = useMemo(
    () => createStyles(colors, typography, shortcutWidth),
    [colors, typography, shortcutWidth]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
                onPress={() => playTrack(track)}
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

        <View style={styles.djCard}>
          <Image
            source={DJ_PLAYLIST.coverSource ?? { uri: DJ_PLAYLIST.coverUrl }}
            style={styles.djCover}
            contentFit="cover"
          />
          <View style={styles.djContent}>
            <Text style={styles.djEyebrow}>DJ do dia</Text>
            <Text style={styles.djTitle}>Sua selecao personalizada</Text>
            <Text style={styles.djSubtitle} numberOfLines={2}>
              Faixas recentes, classicos e mixes com base no que voce mais
              ouviu.
            </Text>
            <Pressable
              style={styles.djButton}
              onPress={() => playTrack(CURRENT_TRACK)}
              accessibilityRole="button"
              accessibilityLabel={`Tocar ${CURRENT_TRACK.title}`}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mixes recomendados</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mixList}
          >
            {RECOMMENDED_MIXES.map((playlist) => (
              <Pressable
                key={playlist.id}
                style={styles.mixCard}
                onPress={() =>
                  router.push({
                    pathname: '/playlist/[id]',
                    params: { id: playlist.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Abrir mix ${playlist.title}`}
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
            ))}
          </ScrollView>
        </View>
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
      backgroundColor: colors.backgroundCard,
    },
    eyebrow: {
      ...typography.bodySmall,
      marginBottom: 2,
    },
    title: {
      ...typography.titleLarge,
      fontSize: 24,
    },
    filters: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    filterPill: {
      minHeight: 34,
      borderRadius: Radius.pill,
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
      backgroundColor: colors.backgroundCard,
    },
    filterPillActive: {
      backgroundColor: colors.primary,
    },
    filterText: {
      ...typography.bodyMedium,
      fontWeight: '700',
    },
    filterTextActive: {
      color: colors.onPrimary,
    },
    shortcutGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    shortcutCard: {
      width: shortcutWidth,
      minHeight: 64,
      borderRadius: Radius.sm,
      overflow: 'hidden',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: colors.backgroundCard,
    },
    shortcutCover: {
      width: 64,
      height: 64,
      backgroundColor: colors.surfaceCard,
    },
    shortcutTitle: {
      ...typography.bodyMedium,
      flex: 1,
      paddingHorizontal: Spacing.sm,
      fontWeight: '700',
    },
    section: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...typography.titleLarge,
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
      borderRadius: Radius.sm,
      marginBottom: Spacing.sm,
      backgroundColor: colors.surfaceCard,
    },
    recentTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      marginBottom: 2,
    },
    recentSubtitle: {
      ...typography.bodySmall,
    },
    djCard: {
      minHeight: 172,
      borderRadius: Radius.md,
      overflow: 'hidden',
      flexDirection: 'row',
      marginBottom: Spacing.xl,
      backgroundColor: colors.playerBackground,
    },
    djCover: {
      width: 136,
      minHeight: 172,
      backgroundColor: colors.surfaceCard,
    },
    djContent: {
      flex: 1,
      padding: Spacing.md,
      justifyContent: 'space-between',
    },
    djEyebrow: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    djTitle: {
      ...typography.titleMedium,
      color: colors.playerTextPrimary,
      fontSize: 18,
    },
    djSubtitle: {
      ...typography.bodySmall,
      color: colors.playerTextSecondary,
      lineHeight: 17,
    },
    djButton: {
      height: 34,
      borderRadius: Radius.pill,
      alignSelf: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.xs,
      paddingHorizontal: Spacing.md,
      backgroundColor: colors.primary,
    },
    djButtonText: {
      ...typography.bodyMedium,
      color: colors.onPrimary,
      fontWeight: '700',
    },
    mixList: {
      gap: Spacing.md,
      paddingRight: Spacing.md,
    },
    mixCard: {
      width: 150,
    },
    mixCover: {
      width: 150,
      height: 150,
      borderRadius: Radius.sm,
      marginBottom: Spacing.sm,
      backgroundColor: colors.surfaceCard,
    },
    mixTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      marginBottom: 2,
    },
    mixSubtitle: {
      ...typography.bodySmall,
      lineHeight: 16,
    },
  });
}

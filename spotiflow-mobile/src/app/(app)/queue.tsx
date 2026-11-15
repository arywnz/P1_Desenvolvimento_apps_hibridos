import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PlayingEqualizer,
  ScalePressable,
} from '../../components/AnimatedMotion';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';

export default function QueueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
  const {
    currentTrack,
    queue,
    isPlaying,
    isShuffle,
    playTrack,
    togglePlayPause,
    toggleShuffle,
    removeFromQueue,
  } = usePlayer();

  const upcomingTracks = queue.filter((track) => track.id !== currentTrack?.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar fila de reprodução"
        >
          <SymbolView
            name={{
              ios: 'chevron.down',
              android: 'keyboard_arrow_down',
              web: 'keyboard_arrow_down',
            }}
            size={26}
            tintColor={colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Fila de reprodução</Text>
        <Pressable
          style={styles.iconButton}
          onPress={toggleShuffle}
          accessibilityRole="button"
          accessibilityLabel="Alternar ordem aleatória"
        >
          <SymbolView
            name={{
              ios: 'shuffle',
              android: 'shuffle',
              web: 'shuffle',
            }}
            size={20}
            tintColor={isShuffle ? colors.primary : colors.textSecondary}
            type="hierarchical"
          />
        </Pressable>
      </View>

      <FlatList
        data={upcomingTracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        ListHeaderComponent={
          <View style={styles.headerSections}>
            {currentTrack && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>Tocando agora</Text>
                <ScalePressable
                  style={styles.nowPlayingCard}
                  onPress={togglePlayPause}
                  accessibilityRole="button"
                  accessibilityLabel={`Alternar reprodução de ${currentTrack.title}`}
                >
                  <Image
                    source={{ uri: currentTrack.coverUrl }}
                    style={styles.cover}
                    contentFit="cover"
                  />
                  <View style={styles.trackInfo}>
                    <View style={styles.nowPlayingTitleRow}>
                      {isPlaying && (
                        <PlayingEqualizer
                          isPlaying={isPlaying}
                          color={colors.primary}
                          size={12}
                        />
                      )}
                      <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                        {currentTrack.title}
                      </Text>
                    </View>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {currentTrack.artist}
                    </Text>
                  </View>
                  <SymbolView
                    name={{
                      ios: isPlaying ? 'pause.circle.fill' : 'play.circle.fill',
                      android: isPlaying ? 'pause_circle' : 'play_circle',
                      web: isPlaying ? 'pause_circle' : 'play_circle',
                    }}
                    size={30}
                    tintColor={colors.primary}
                    type="hierarchical"
                  />
                </ScalePressable>
              </View>
            )}

            <Text style={styles.sectionLabel}>
              Próximas na fila ({upcomingTracks.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhuma faixa na sequência</Text>
            <Text style={styles.emptySubtitle}>
              Escolha uma playlist ou música para preencher a fila de
              reprodução.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.queueRow}
            onPress={() => playTrack(item, queue)}
            accessibilityRole="button"
            accessibilityLabel={`Tocar ${item.title} de ${item.artist}`}
          >
            <Image
              source={{ uri: item.coverUrl }}
              style={styles.coverSmall}
              contentFit="cover"
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {item.artist} • {item.duration}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              onPress={() => removeFromQueue(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${item.title} da fila`}
            >
              <SymbolView
                name={{
                  ios: 'minus.circle',
                  android: 'remove_circle_outline',
                  web: 'remove_circle_outline',
                }}
                size={20}
                tintColor={colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>
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
    header: {
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.titleMedium,
      fontSize: 17,
    },
    listContent: {
      padding: Spacing.md,
      gap: Spacing.sm,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },
    nowPlayingTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerSections: {
      gap: Spacing.md,
      marginBottom: Spacing.xs,
    },
    sectionBlock: {
      gap: Spacing.xs,
    },
    sectionLabel: {
      ...typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      color: colors.textSecondary,
    },
    nowPlayingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.sm,
      gap: Spacing.sm,
    },
    cover: {
      width: 52,
      height: 52,
      borderRadius: Radius.sm,
    },
    coverSmall: {
      width: 44,
      height: 44,
      borderRadius: Radius.sm,
    },
    trackInfo: {
      flex: 1,
      gap: 2,
    },
    nowPlayingTitle: {
      ...typography.bodyMedium,
      fontWeight: '700',
      color: colors.primary,
    },
    trackTitle: {
      ...typography.bodyMedium,
      fontWeight: '600',
    },
    trackArtist: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    queueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs,
      gap: Spacing.sm,
    },
    emptyBox: {
      paddingVertical: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    emptyTitle: {
      ...typography.titleMedium,
    },
    emptySubtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 260,
    },
  });
}

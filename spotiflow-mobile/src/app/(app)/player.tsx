import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const {
    currentTrack,
    isPlaying,
    positionSeconds,
    durationSeconds,
    isBuffering,
    hasPreview,
    audioError,
    isShuffle,
    isRepeat,
    nextTrack,
    previousTrack,
    togglePlayPause,
    toggleLike,
    toggleShuffle,
    toggleRepeat,
    seekTo,
  } = usePlayer();

  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const coverSize = Math.min(width - Spacing.lg * 2, 340);
  const styles = useMemo(
    () => createStyles(colors, typography, coverSize),
    [colors, typography, coverSize]
  );

  if (!currentTrack) return null;

  const totalSeconds = hasPreview
    ? durationSeconds || 30
    : currentTrack.durationSeconds || 214;
  const progressRatio = Math.min(
    Math.max(positionSeconds / (totalSeconds || 1), 0),
    1
  );

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressBarLayout = (e: LayoutChangeEvent) => {
    setProgressBarWidth(e.nativeEvent.layout.width);
  };

  const handleProgressBarPress = (e: GestureResponderEvent) => {
    const effectiveWidth =
      progressBarWidth > 0 ? progressBarWidth : width - Spacing.lg * 2;
    const { locationX } = e.nativeEvent;
    const newRatio = Math.max(0, Math.min(locationX / effectiveWidth, 1));
    seekTo(Math.floor(newRatio * totalSeconds));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header: Fechar (Chevron), Título da Playlist, Mais Opções */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Minimizar player"
        >
          <SymbolView
            name={{
              ios: 'chevron.down',
              android: 'keyboard_arrow_down',
              web: 'keyboard_arrow_down',
            }}
            size={28}
            tintColor={colors.playerTextPrimary}
            type="hierarchical"
          />
        </Pressable>

        <View style={styles.topHeaderCenter}>
          <Text style={styles.playlistEyebrow}>TOCANDO DA PLAYLIST</Text>
          <Text style={styles.playlistName} numberOfLines={1}>
            {currentTrack.album || 'Echos of us'}
          </Text>
        </View>

        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Mais opções"
        >
          <SymbolView
            name={{
              ios: 'ellipsis',
              android: 'more_vert',
              web: 'more_vert',
            }}
            size={24}
            tintColor={colors.playerTextPrimary}
            type="hierarchical"
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Capa Gigante do Álbum */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: currentTrack.coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
        </View>

        {/* Informações da Música e Botão de Curtir */}
        <View style={styles.trackDetailsRow}>
          <View style={styles.trackTextGroup}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/artist/[id]',
                  params: {
                    id:
                      currentTrack.artistId ??
                      encodeURIComponent(currentTrack.artist),
                  },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Abrir artista ${currentTrack.artist}`}
            >
              <Text style={styles.trackArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </Pressable>
          </View>

          <Pressable
            hitSlop={10}
            onPress={toggleLike}
            accessibilityRole="button"
            accessibilityLabel={
              currentTrack.liked ? 'Remover dos favoritos' : 'Favoritar'
            }
          >
            <SymbolView
              name={{
                ios: currentTrack.liked ? 'checkmark.circle.fill' : 'heart',
                android: currentTrack.liked ? 'check_circle' : 'favorite_border',
                web: currentTrack.liked ? 'check_circle' : 'favorite_border',
              }}
              size={28}
              tintColor={
                currentTrack.liked ? colors.primary : colors.playerTextSecondary
              }
              type="hierarchical"
            />
          </Pressable>
        </View>

        <View style={styles.audioStatusRow}>
          <Text style={styles.audioStatusText}>
            {audioError
              ? `Erro ao reproduzir prévia: ${audioError}`
              : !hasPreview
                ? 'Faixa demonstrativa local sem áudio — toque numa música da Deezer'
                : isBuffering
                  ? 'Carregando prévia de áudio...'
                  : 'Prévia de 30s • Deezer'}
          </Text>
        </View>

        {/* Barra de Progresso com Marcação de Tempo */}
        <View style={styles.progressSection}>
          <Pressable
            style={styles.progressBarBackground}
            onLayout={handleProgressBarLayout}
            onPress={handleProgressBarPress}
            accessibilityRole="adjustable"
            accessibilityLabel="Progresso da música"
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressRatio * 100}%` },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                { left: `${Math.max(0, progressRatio * 100 - 2)}%` },
              ]}
            />
          </Pressable>

          <View style={styles.timeLabelsRow}>
            <Text style={styles.timeText}>{formatTime(positionSeconds)}</Text>
            <Text style={styles.timeText}>
              {hasPreview ? formatTime(totalSeconds) : currentTrack.duration}
            </Text>
          </View>
        </View>

        {/* Controles Principais de Mídia */}
        <View style={styles.playbackControls}>
          <Pressable
            hitSlop={8}
            onPress={toggleShuffle}
            accessibilityRole="button"
            accessibilityLabel="Ordem aleatória"
          >
            <SymbolView
              name={{
                ios: 'shuffle',
                android: 'shuffle',
                web: 'shuffle',
              }}
              size={24}
              tintColor={
                isShuffle ? colors.primary : colors.playerTextSecondary
              }
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={previousTrack}
            accessibilityRole="button"
            accessibilityLabel="Faixa anterior"
          >
            <SymbolView
              name={{
                ios: 'backward.end.fill',
                android: 'skip_previous',
                web: 'skip_previous',
              }}
              size={34}
              tintColor={colors.playerTextPrimary}
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            style={styles.mainPlayButton}
            onPress={togglePlayPause}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isBuffering ? (
              <ActivityIndicator size="small" color={colors.playerPlayIcon} />
            ) : (
              <SymbolView
                name={{
                  ios: isPlaying ? 'pause.fill' : 'play.fill',
                  android: isPlaying ? 'pause' : 'play_arrow',
                  web: isPlaying ? 'pause' : 'play_arrow',
                }}
                size={36}
                tintColor={colors.playerPlayIcon}
                type="hierarchical"
              />
            )}
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={nextTrack}
            accessibilityRole="button"
            accessibilityLabel="Próxima faixa"
          >
            <SymbolView
              name={{
                ios: 'forward.end.fill',
                android: 'skip_next',
                web: 'skip_next',
              }}
              size={34}
              tintColor={colors.playerTextPrimary}
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={toggleRepeat}
            accessibilityRole="button"
            accessibilityLabel="Repetir faixa"
          >
            <SymbolView
              name={{
                ios: 'repeat',
                android: 'repeat',
                web: 'repeat',
              }}
              size={24}
              tintColor={isRepeat ? colors.primary : colors.playerTextSecondary}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Barra Inferior com Ícones de Dispositivos e Fila */}
        <View style={styles.bottomBarRow}>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Dispositivos conectados"
          >
            <SymbolView
              name={{
                ios: 'hifispeaker.fill',
                android: 'speaker_group',
                web: 'speaker_group',
              }}
              size={22}
              tintColor={colors.playerTextSecondary}
              type="hierarchical"
            />
          </Pressable>

          <View style={styles.bottomBarRight}>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Compartilhar música"
            >
              <SymbolView
                name={{
                  ios: 'square.and.arrow.up',
                  android: 'share',
                  web: 'share',
                }}
                size={22}
                tintColor={colors.playerTextSecondary}
                type="hierarchical"
              />
            </Pressable>

            <Pressable
              hitSlop={8}
              onPress={() => router.push('/queue')}
              accessibilityRole="button"
              accessibilityLabel="Fila de reprodução"
            >
              <SymbolView
                name={{
                  ios: 'list.bullet',
                  android: 'queue_music',
                  web: 'queue_music',
                }}
                size={24}
                tintColor={colors.playerTextSecondary}
                type="hierarchical"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  coverSize: number
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.playerBackground,
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      height: 54,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topHeaderCenter: {
      alignItems: 'center',
    },
    playlistEyebrow: {
      ...typography.caption,
      fontSize: 10,
      letterSpacing: 1,
      color: colors.playerTextSecondary,
      fontWeight: '700',
    },
    playlistName: {
      ...typography.bodySmall,
      fontWeight: '700',
      color: colors.playerTextPrimary,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      justifyContent: 'space-between',
    },
    coverContainer: {
      alignItems: 'center',
      marginVertical: Spacing.lg,
    },
    coverImage: {
      width: coverSize,
      height: coverSize,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceCard,
      ...Shadows.hero,
    },
    trackDetailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    audioStatusRow: {
      marginBottom: Spacing.md,
    },
    audioStatusText: {
      ...typography.caption,
      color: colors.playerTextMuted,
      fontSize: 12,
    },
    trackTextGroup: {
      flex: 1,
      paddingRight: Spacing.md,
    },
    trackTitle: {
      ...typography.titleLarge,
      color: colors.playerTextPrimary,
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 4,
    },
    trackArtist: {
      ...typography.bodyMedium,
      color: colors.playerTextSecondary,
      fontSize: 15,
    },
    progressSection: {
      marginBottom: Spacing.lg,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: colors.playerTrackBg,
      borderRadius: 2,
      position: 'relative',
      justifyContent: 'center',
    },
    progressBarFill: {
      height: 4,
      backgroundColor: colors.playerTextPrimary,
      borderRadius: 2,
    },
    progressThumb: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.playerTextPrimary,
      top: -3,
    },
    timeLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    timeText: {
      ...typography.caption,
      color: colors.playerTextMuted,
      fontSize: 11,
    },
    playbackControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: Spacing.lg,
      paddingHorizontal: Spacing.xs,
    },
    mainPlayButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.playerPlayBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    bottomBarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.lg,
    },
    bottomBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
  });
}

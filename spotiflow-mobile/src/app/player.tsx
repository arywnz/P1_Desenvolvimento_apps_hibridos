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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    positionSeconds,
    togglePlayPause,
    toggleLike,
    seekTo,
  } = usePlayer();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  if (!currentTrack) return null;

  const totalSeconds = currentTrack.durationSeconds || 214;
  const progressRatio = Math.min(positionSeconds / totalSeconds, 1);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressBarPress = (e: any) => {
    const { locationX } = e.nativeEvent;
    // estimando proporção com base na largura da barra
    const newRatio = Math.max(0, Math.min(locationX / 330, 1));
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
            tintColor={Colors.textPrimary}
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
            tintColor={Colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
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
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <Pressable
            hitSlop={10}
            onPress={toggleLike}
            accessibilityRole="button"
            accessibilityLabel={currentTrack.liked ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <SymbolView
              name={{
                ios: currentTrack.liked ? 'checkmark.circle.fill' : 'heart',
                android: currentTrack.liked ? 'check_circle' : 'favorite_border',
                web: currentTrack.liked ? 'check_circle' : 'favorite_border',
              }}
              size={28}
              tintColor={currentTrack.liked ? Colors.primary : Colors.textSecondary}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Barra de Progresso com Marcação de Tempo */}
        <View style={styles.progressSection}>
          <Pressable
            style={styles.progressBarBackground}
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
            <Text style={styles.timeText}>{currentTrack.duration}</Text>
          </View>
        </View>

        {/* Controles Principais de Mídia (Shuffle, Anterior, Play/Pause Verde, Próxima, Repeat) */}
        <View style={styles.playbackControls}>
          <Pressable
            hitSlop={8}
            onPress={() => setIsShuffle(!isShuffle)}
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
              tintColor={isShuffle ? Colors.primary : Colors.textSecondary}
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
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
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>

          {/* Botão Play / Pause com anel verde metálico do Spotify */}
          <Pressable
            style={styles.mainPlayButton}
            onPress={togglePlayPause}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            <SymbolView
              name={{
                ios: isPlaying ? 'pause.fill' : 'play.fill',
                android: isPlaying ? 'pause' : 'play_arrow',
                web: isPlaying ? 'pause' : 'play_arrow',
              }}
              size={36}
              tintColor="#121212"
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
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
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={() => setIsRepeat(!isRepeat)}
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
              tintColor={isRepeat ? Colors.primary : Colors.textSecondary}
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
              tintColor={Colors.textSecondary}
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
                tintColor={Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>

            <Pressable
              hitSlop={8}
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
                tintColor={Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3E1C1A', // tom acastanhado/vinho escuro do print oficial do Cazuza
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
    ...Typography.caption,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  playlistName: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    width: 320,
    height: 320,
    borderRadius: 8,
    backgroundColor: Colors.surfaceCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  trackDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  trackTextGroup: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  trackTitle: {
    ...Typography.titleLarge,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  trackArtist: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textPrimary,
    top: -3,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
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

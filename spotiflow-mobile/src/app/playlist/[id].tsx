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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_PLAYLISTS, Track } from '../../constants/mockData';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { usePlayer } from '../../context/PlayerContext';

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();

  // Encontra a playlist mockada ou usa a primeira como fallback
  const playlist =
    MOCK_PLAYLISTS.find((p) => p.id === id) || MOCK_PLAYLISTS[0];

  const [isSaved, setIsSaved] = useState(false);

  const isCurrentPlaylistPlaying =
    isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayFirst = () => {
    if (playlist.tracks.length > 0) {
      if (playlist.tracks.some((t) => t.id === currentTrack?.id)) {
        togglePlayPause();
      } else {
        playTrack(playlist.tracks[0]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Barra de Topo com Voltar e Menu */}
      <View style={styles.topBar}>
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
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Capa Grande em Destaque */}
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: playlist.coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
        </View>

        {/* Informações da Playlist */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{playlist.title}</Text>
          <Text style={styles.subtitle}>{playlist.subtitle}</Text>
          <Text style={styles.metaText}>
            Feita por <Text style={styles.author}>{playlist.author}</Text> •{' '}
            {playlist.tracksCount} músicas
          </Text>
        </View>

        {/* Barra de Ações (Download, Salvar, Play Verde Circular) */}
        <View style={styles.actionsBar}>
          <View style={styles.leftActions}>
            <Pressable
              hitSlop={8}
              onPress={() => setIsSaved(!isSaved)}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remover da biblioteca' : 'Adicionar a biblioteca'}
            >
              <SymbolView
                name={{
                  ios: isSaved ? 'checkmark.circle.fill' : 'plus.circle',
                  android: isSaved ? 'check_circle' : 'add_circle',
                  web: isSaved ? 'check_circle' : 'add_circle',
                }}
                size={26}
                tintColor={isSaved ? Colors.primary : Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>

            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Baixar playlist">
              <SymbolView
                name={{
                  ios: playlist.isDownloaded ? 'arrow.down.circle.fill' : 'arrow.down.circle',
                  android: 'download_for_offline',
                  web: 'download_for_offline',
                }}
                size={26}
                tintColor={playlist.isDownloaded ? Colors.primary : Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>

            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Mais opcoes">
              <SymbolView
                name={{
                  ios: 'ellipsis',
                  android: 'more_vert',
                  web: 'more_vert',
                }}
                size={24}
                tintColor={Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>
          </View>

          {/* Botão de Play Verde Circular do Spotify */}
          <Pressable
            style={styles.playButton}
            onPress={handlePlayFirst}
            accessibilityRole="button"
            accessibilityLabel={isCurrentPlaylistPlaying ? 'Pausar playlist' : 'Reproduzir playlist'}
          >
            <SymbolView
              name={{
                ios: isCurrentPlaylistPlaying ? 'pause.fill' : 'play.fill',
                android: isCurrentPlaylistPlaying ? 'pause' : 'play_arrow',
                web: isCurrentPlaylistPlaying ? 'pause' : 'play_arrow',
              }}
              size={28}
              tintColor={Colors.background}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Espaço reservado para a lista de faixas */}
        <View style={styles.trackListHeader}>
          <Text style={styles.sectionHeading}>Faixas em destaque</Text>
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
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 110,
  },
  coverWrapper: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  coverImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
    backgroundColor: Colors.surfaceCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  infoSection: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.titleLarge,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  author: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  trackListHeader: {
    marginTop: Spacing.sm,
  },
  sectionHeading: {
    ...Typography.titleMedium,
    color: Colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

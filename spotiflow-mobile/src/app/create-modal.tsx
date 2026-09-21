import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';

interface CreateOption {
  id: string;
  icon: SymbolViewProps['name'];
  title: string;
  subtitle: string;
  isBeta?: boolean;
}

const CREATE_OPTIONS: CreateOption[] = [
  {
    id: 'playlist',
    icon: {
      ios: 'music.note',
      android: 'music_note',
      web: 'music_note',
    },
    title: 'Playlist',
    subtitle: 'Crie uma playlist com músicas ou episódios',
  },
  {
    id: 'collaborative',
    icon: {
      ios: 'person.2.fill',
      android: 'group',
      web: 'group',
    },
    title: 'Playlist colaborativa',
    subtitle: 'Crie uma playlist com a galera',
  },
  {
    id: 'mixed',
    icon: {
      ios: 'slider.horizontal.3',
      android: 'tune',
      web: 'tune',
    },
    title: 'Playlist mixada',
    subtitle: 'Mixe músicas com transições suaves',
    isBeta: true,
  },
  {
    id: 'match',
    icon: {
      ios: 'circle.circle.fill',
      android: 'join_inner',
      web: 'join_inner',
    },
    title: 'Match',
    subtitle: 'Junte os gostos musicais da sua galera em uma playlist',
  },
  {
    id: 'jam',
    icon: {
      ios: 'speaker.wave.2.fill',
      android: 'spatial_audio',
      web: 'spatial_audio',
    },
    title: 'Jam',
    subtitle: 'Ouça junto, de qualquer lugar',
  },
];

export default function CreateModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [createdFeedback, setCreatedFeedback] = useState<string | null>(null);

  const handleSelectOption = (option: CreateOption) => {
    setCreatedFeedback(`Criando "${option.title}"...`);
    setTimeout(() => {
      setCreatedFeedback(null);
      router.back();
      router.push('/(tabs)/library');
    }, 800);
  };

  return (
    <View style={styles.overlay}>
      {/* Área superior com backdrop escuro que fecha ao tocar fora */}
      <Pressable
        style={styles.backdrop}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Fechar menu criar"
      />

      {/* Folha do BottomSheet que encosta até a borda inferior real da tela */}
      <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
          bounces={false}
        >
          {CREATE_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionRow}
              onPress={() => handleSelectOption(option)}
              accessibilityRole="button"
              accessibilityLabel={option.title}
            >
              <View style={styles.iconCircle}>
                <SymbolView
                  name={option.icon}
                  size={22}
                  tintColor={Colors.textPrimary}
                  type="hierarchical"
                />
              </View>

              <View style={styles.optionInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.isBeta && (
                    <View style={styles.betaBadge}>
                      <Text style={styles.betaText}>Beta</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  {option.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Feedback visual temporário */}
        {createdFeedback && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{createdFeedback}</Text>
          </View>
        )}

        {/* Botão de Fechar 'X' redondo no canto inferior direito */}
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <SymbolView
              name={{
                ios: 'xmark',
                android: 'close',
                web: 'close',
              }}
              size={22}
              tintColor="#121212"
              type="hierarchical"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sheetContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  optionTitle: {
    ...Typography.titleMedium,
    fontSize: 16,
  },
  betaBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  betaText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '800',
  },
  optionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  feedbackBanner: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  feedbackText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 13,
  },
  bottomBar: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
    paddingRight: Spacing.xs,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { useTheme } from '../../../context/ThemeContext';

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

export default function CreateScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
  const [createdFeedback, setCreatedFeedback] = useState<string | null>(null);

  const handleSelectOption = (option: CreateOption) => {
    if (option.id === 'jam') {
      setCreatedFeedback(`Iniciando "${option.title}"...`);
      setTimeout(() => {
        setCreatedFeedback(null);
        router.push('/queue');
      }, 600);
      return;
    }

    router.push({
      pathname: '/create-playlist',
      params: { mode: option.title },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Área superior clicável para fechar ao tocar fora */}
      <Pressable
        style={styles.backdrop}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Fechar menu criar"
      />

      {/* Container que preenche toda a metade inferior até o final da tela */}
      <View style={styles.sheetContainer}>
        <View style={styles.sheetContent}>
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
                  tintColor={colors.textPrimary}
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

          {/* Feedback temporário */}
          {createdFeedback && (
            <View style={styles.feedbackBanner}>
              <Text style={styles.feedbackText}>{createdFeedback}</Text>
            </View>
          )}

          {/* Botão de Fechar redondo */}
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
                tintColor={colors.closeButtonIcon}
                type="hierarchical"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
    },
    sheetContainer: {
      backgroundColor: colors.sheetBackground,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.lg,
    },
    sheetContent: {
      gap: Spacing.sm,
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
      backgroundColor: colors.sheetIconBg,
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
      ...typography.titleMedium,
      fontSize: 16,
    },
    betaBadge: {
      backgroundColor: colors.primary,
      borderRadius: Radius.xs,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    betaText: {
      color: colors.onPrimary,
      fontSize: 10,
      fontWeight: '800',
    },
    optionSubtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontSize: 13,
    },
    feedbackBanner: {
      backgroundColor: colors.primary,
      padding: Spacing.sm,
      borderRadius: Radius.md,
      alignItems: 'center',
      marginVertical: Spacing.xs,
    },
    feedbackText: {
      color: colors.onPrimary,
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
      backgroundColor: colors.closeButtonBg,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.floating,
    },
  });
}

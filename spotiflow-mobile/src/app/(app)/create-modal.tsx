import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  SlideInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScalePressable } from '../../components/AnimatedMotion';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

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
  const reducedMotion = useReducedMotion();
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
        router.back();
        router.push('/queue');
      }, 600);
      return;
    }

    router.back();
    router.push({
      pathname: '/create-playlist',
      params: { mode: option.title },
    });
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
      <Animated.View
        entering={
          reducedMotion
            ? undefined
            : SlideInDown.duration(200).easing(Easing.out(Easing.cubic))
        }
        style={[
          styles.sheetContainer,
          { paddingBottom: Math.max(insets.bottom, 16) + 12 },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
          bounces={false}
        >
          {CREATE_OPTIONS.map((option) => (
            <ScalePressable
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
            </ScalePressable>
          ))}
        </ScrollView>

        {/* Feedback visual temporário */}
        {createdFeedback && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{createdFeedback}</Text>
          </View>
        )}

        {/* Botão de Fechar redondo no canto inferior direito */}
        <View style={styles.bottomBar}>
          <ScalePressable
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
          </ScalePressable>
        </View>
      </Animated.View>
    </View>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
    },
    sheetContainer: {
      backgroundColor: colors.sheetBackground,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      paddingTop: Spacing.lg,
      paddingHorizontal: Spacing.md,
      width: '100%',
      maxWidth: 540,
      alignSelf: 'center',
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

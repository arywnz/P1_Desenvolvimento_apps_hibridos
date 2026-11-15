import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface ResourceNotFoundProps {
  title: string;
  description: string;
}

/**
 * Estado exibido quando um parâmetro [id] recebido por rota dinâmica não existe.
 */
export function ResourceNotFound({ title, description }: ResourceNotFoundProps) {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            tintColor={colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{
              ios: 'questionmark.circle',
              android: 'help_outline',
              web: 'help_outline',
            }}
            size={34}
            tintColor={colors.textSecondary}
            type="hierarchical"
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable
          style={styles.button}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topBar: {
      height: 52,
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      gap: Spacing.md,
    },
    iconCircle: {
      width: 68,
      height: 68,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typography.titleLarge,
      textAlign: 'center',
    },
    description: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
      lineHeight: 20,
    },
    button: {
      height: 44,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.xs,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
  });
}

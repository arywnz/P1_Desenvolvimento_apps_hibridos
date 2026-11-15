import { SymbolView } from 'expo-symbols';
import { useMemo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface StateViewProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  retryLabel?: string;
  children: ReactNode;
}

/**
 * Gerencia os 4 estados da tela previstos na Aula 9: carregando, erro, vazio e conteúdo.
 */
export function StateView({
  loading,
  error,
  isEmpty = false,
  loadingLabel = 'Carregando catálogo...',
  emptyTitle = 'Nada por aqui',
  emptyDescription = 'Nenhum item foi encontrado para exibir no momento.',
  onRetry,
  retryLabel = 'Tentar de novo',
  children,
}: StateViewProps) {
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  if (loading) {
    return (
      <View style={styles.stateBox}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.subtitle}>{loadingLabel}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateBox}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{
              ios: 'wifi.slash',
              android: 'cloud_off',
              web: 'cloud_off',
            }}
            size={28}
            tintColor={colors.danger}
            type="hierarchical"
          />
        </View>
        <Text style={styles.title}>Falha ao carregar</Text>
        <Text style={styles.subtitle}>{error}</Text>
        {onRetry && (
          <Pressable
            style={styles.retryButton}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
          >
            <Text style={styles.retryText}>{retryLabel}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.stateBox}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{
              ios: 'tray',
              android: 'inbox',
              web: 'inbox',
            }}
            size={28}
            tintColor={colors.textSecondary}
            type="hierarchical"
          />
        </View>
        <Text style={styles.title}>{emptyTitle}</Text>
        <Text style={styles.subtitle}>{emptyDescription}</Text>
        {onRetry && (
          <Pressable
            style={styles.secondaryButton}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Atualizar"
          >
            <Text style={styles.secondaryText}>Atualizar</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return <>{children}</>;
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    stateBox: {
      flex: 1,
      minHeight: 220,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xl,
      gap: Spacing.sm,
    },
    iconCircle: {
      width: 58,
      height: 58,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xs,
    },
    title: {
      ...typography.titleMedium,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
      lineHeight: 19,
    },
    retryButton: {
      height: 42,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.xs,
    },
    retryText: {
      color: colors.onPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    secondaryButton: {
      height: 40,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.xs,
    },
    secondaryText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
  });
}

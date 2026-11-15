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

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{
              ios: 'exclamationmark.triangle',
              android: 'warning_amber',
              web: 'warning_amber',
            }}
            size={36}
            tintColor={colors.primary}
            type="hierarchical"
          />
        </View>
        <Text style={styles.title}>Tela não encontrada</Text>
        <Text style={styles.subtitle}>
          O endereço acessado não existe ou foi movido no aplicativo.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o início"
        >
          <Text style={styles.buttonText}>Voltar para o início</Text>
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
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      gap: Spacing.md,
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typography.titleLarge,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
      lineHeight: 20,
    },
    button: {
      height: 46,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.sm,
    },
    buttonText: {
      color: colors.onPrimary,
      fontWeight: '700',
      fontSize: 14,
    },
  });
}

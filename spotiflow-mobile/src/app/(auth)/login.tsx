import { Link, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Radius,
  Shadows,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Informe seu e-mail ou nome de usuário.');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMessage('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setErrorMessage(null);
    signIn({ email: trimmedEmail });
    router.replace('/');
  };

  const handleDemoLogin = () => {
    setErrorMessage(null);
    signIn({
      email: 'jao.estudante@univassouras.edu.br',
      name: 'Jão',
    });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <View style={styles.logoCircle}>
              <SymbolView
                name={{
                  ios: 'waveform',
                  android: 'graphic_eq',
                  web: 'graphic_eq',
                }}
                size={34}
                tintColor={colors.onPrimary}
                type="hierarchical"
              />
            </View>
            <Text style={styles.brandTitle}>Spotiflow</Text>
            <Text style={styles.brandSubtitle}>
              Entre para ouvir suas playlists, explorar lançamentos e acompanhar
              amigos.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail ou usuário</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="seu.email@univassouras.edu.br"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                >
                  <SymbolView
                    name={{
                      ios: showPassword ? 'eye.slash' : 'eye',
                      android: showPassword ? 'visibility_off' : 'visibility',
                      web: showPassword ? 'visibility_off' : 'visibility',
                    }}
                    size={20}
                    tintColor={colors.textSecondary}
                    type="hierarchical"
                  />
                </Pressable>
              </View>
            </View>

            {errorMessage && (
              <View style={styles.errorBox}>
                <SymbolView
                  name={{
                    ios: 'exclamationmark.circle',
                    android: 'error_outline',
                    web: 'error_outline',
                  }}
                  size={16}
                  tintColor={colors.danger}
                  type="hierarchical"
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={handleLogin}
              accessibilityRole="button"
              accessibilityLabel="Entrar no aplicativo"
            >
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleDemoLogin}
              accessibilityRole="button"
              accessibilityLabel="Entrar com conta de demonstração"
            >
              <Text style={styles.secondaryButtonText}>
                Entrar com conta demo
              </Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Ainda não tem conta?</Text>
            <Link href="/cadastro" asChild>
              <Pressable accessibilityRole="button">
                <Text style={styles.footerLink}>Criar conta</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xl,
      gap: Spacing.lg,
    },
    brandBlock: {
      alignItems: 'center',
      gap: Spacing.sm,
    },
    logoCircle: {
      width: 68,
      height: 68,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xs,
      ...Shadows.floating,
    },
    brandTitle: {
      ...typography.titleLarge,
      fontSize: 30,
      letterSpacing: -0.6,
    },
    brandSubtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 300,
      lineHeight: 20,
    },
    formCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.md,
    },
    fieldGroup: {
      gap: Spacing.xs,
    },
    label: {
      ...typography.bodySmall,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    input: {
      height: 48,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      color: colors.textPrimary,
      fontSize: 14,
    },
    passwordWrapper: {
      height: 48,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    passwordInput: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 14,
      height: '100%',
    },
    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.sm,
      backgroundColor: colors.backgroundHighlight,
    },
    errorText: {
      ...typography.bodySmall,
      color: colors.danger,
      flex: 1,
    },
    primaryButton: {
      height: 50,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.xs,
    },
    primaryButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    secondaryButton: {
      height: 46,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    footerText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    footerLink: {
      ...typography.bodySmall,
      color: colors.primary,
      fontWeight: '700',
    },
  });
}

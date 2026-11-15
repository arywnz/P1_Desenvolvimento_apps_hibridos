import { Link, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  const { loginWithApi, signIn } = useAuth();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const executeApiLogin = async (userInput: string, passInput: string) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithApi(userInput, passInput);
      router.replace('/');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Não foi possível autenticar na API.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMessage('Informe seu usuário (ex.: emilys).');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMessage('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    void executeApiLogin(trimmedUser, password);
  };

  const handleTestApiLogin = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    void executeApiLogin('emilys', 'emilyspass');
  };

  const handleOfflineDemo = () => {
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
              <Text style={styles.label}>Usuário (API DummyJSON)</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="ex.: emilys"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!submitting}
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
                  placeholder="ex.: emilyspass"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!submitting}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                  disabled={submitting}
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

            <Text style={styles.helperHint}>
              Credencial pública para teste POST: emilys / emilyspass
            </Text>

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
              style={[
                styles.primaryButton,
                submitting && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Entrar com API"
            >
              {submitting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>Entrar</Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.secondaryButton,
                submitting && styles.buttonDisabled,
              ]}
              onPress={handleTestApiLogin}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Entrar com conta de teste na API"
            >
              <Text style={styles.secondaryButtonText}>
                Entrar com conta de teste (API)
              </Text>
            </Pressable>

            <Pressable
              style={styles.textButton}
              onPress={handleOfflineDemo}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Entrar em modo demonstração local"
            >
              <Text style={styles.textButtonLabel}>
                Entrar em modo demonstração (sem rede)
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
    helperHint: {
      ...typography.caption,
      color: colors.textMuted,
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
    textButton: {
      alignItems: 'center',
      paddingVertical: Spacing.xs,
    },
    textButtonLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    buttonDisabled: {
      opacity: 0.65,
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

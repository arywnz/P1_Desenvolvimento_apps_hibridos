import { useRouter } from 'expo-router';
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
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = () => {
    if (name.trim().length < 2) {
      setErrorMessage('Informe seu nome completo.');
      return;
    }
    if (!email.trim().includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMessage('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não conferem.');
      return;
    }

    setErrorMessage(null);
    register({ name, email });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o login"
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
        <Text style={styles.headerTitle}>Criar conta</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.subtitle}>
              Crie seu acesso ao Spotiflow para organizar playlists e salvar
              suas preferências.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Seu nome"
                placeholderTextColor={colors.textMuted}
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
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
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Mínimo 4 caracteres"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Repita a senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
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
              onPress={handleRegister}
              accessibilityRole="button"
              accessibilityLabel="Concluir cadastro"
            >
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            </Pressable>
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
    topBar: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: Spacing.sm,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.titleLarge,
      fontSize: 20,
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xl * 2,
    },
    formCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.md,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      lineHeight: 20,
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
  });
}

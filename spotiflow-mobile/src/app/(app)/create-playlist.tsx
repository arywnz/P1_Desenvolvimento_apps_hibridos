import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';

const STYLE_TAGS = ['Mix diário', 'Treino', 'Foco', 'Clássicos', 'Acústico'];

export default function CreatePlaylistScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { user } = useAuth();
  const { createPlaylist } = useLibrary();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedTag, setSelectedTag] = useState(STYLE_TAGS[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = () => {
    const trimmed = title.trim();
    if (trimmed.length < 2) {
      setErrorMessage('Digite um nome com pelo menos 2 caracteres.');
      return;
    }

    const created = createPlaylist({
      title: trimmed,
      subtitle: subtitle.trim() || `${mode || 'Playlist'} • ${selectedTag}`,
      authorName: user?.name ?? 'Você',
      isPinned,
    });

    router.replace({
      pathname: '/playlist/[id]',
      params: { id: created.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar criação de playlist"
        >
          <SymbolView
            name={{
              ios: 'xmark',
              android: 'close',
              web: 'close',
            }}
            size={22}
            tintColor={colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.headerTitle}>
          {mode ? `Nova ${mode}` : 'Nova Playlist'}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome da playlist</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Ex.: Estrada de fim de semana"
                placeholderTextColor={colors.textMuted}
                maxLength={50}
                autoFocus
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={subtitle}
                onChangeText={setSubtitle}
                placeholder="Descreva o clima ou tema da seleção..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={120}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Estilo principal</Text>
              <View style={styles.tagsWrap}>
                {STYLE_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <Pressable
                      key={tag}
                      style={[
                        styles.tagPill,
                        isSelected && styles.tagPillActive,
                      ]}
                      onPress={() => setSelectedTag(tag)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextActive,
                        ]}
                      >
                        {tag}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={styles.label}>Fixar na biblioteca</Text>
                <Text style={styles.helperText}>
                  Mantém a playlist no topo da Sua Biblioteca
                </Text>
              </View>
              <Switch
                value={isPinned}
                onValueChange={setIsPinned}
                trackColor={{
                  false: colors.switchTrackOff,
                  true: colors.primary,
                }}
                thumbColor={colors.switchThumb}
              />
            </View>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </View>

          <Pressable
            style={styles.createButton}
            onPress={handleCreate}
            accessibilityRole="button"
            accessibilityLabel="Criar playlist"
          >
            <Text style={styles.createButtonText}>Criar playlist</Text>
          </Pressable>
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
    flex: {
      flex: 1,
    },
    header: {
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.titleMedium,
      fontSize: 17,
    },
    content: {
      padding: Spacing.lg,
      gap: Spacing.lg,
    },
    card: {
      backgroundColor: colors.surfaceCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.lg,
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
      minHeight: 46,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      color: colors.textPrimary,
      fontSize: 14,
    },
    textArea: {
      minHeight: 84,
      textAlignVertical: 'top',
    },
    tagsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    tagPill: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs + 2,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tagText: {
      ...typography.bodySmall,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    tagTextActive: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.md,
      paddingTop: Spacing.xs,
    },
    switchTextGroup: {
      flex: 1,
      gap: 2,
    },
    helperText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    errorText: {
      ...typography.bodySmall,
      color: colors.danger,
      fontWeight: '600',
    },
    createButton: {
      height: 50,
      borderRadius: Radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}

import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [dataSaver, setDataSaver] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [crossfade, setCrossfade] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [explicitContent, setExplicitContent] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.header}>
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
            tintColor={Colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Conta</Text>
          <View style={styles.card}>
            <Pressable
              style={styles.rowAction}
              onPress={() => router.push('/profile')}
              accessibilityRole="button"
              accessibilityLabel="Ver perfil do usuario"
            >
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Perfil do usuario</Text>
                <Text style={styles.rowSubtitle}>Ver amigos, mensagens e atividade recente</Text>
              </View>
              <SymbolView
                name={{
                  ios: 'chevron.forward',
                  android: 'chevron_right',
                  web: 'chevron_right',
                }}
                size={18}
                tintColor={Colors.textSecondary}
                type="hierarchical"
              />
            </Pressable>
            <View style={styles.row}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>E-mail</Text>
                <Text style={styles.rowSubtitle}>jao.estudante@univassouras.edu.br</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Plano Atual</Text>
                <Text style={styles.rowSubtitle}>Premium Universitário (Ativo)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seção Economia de Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Economia de Dados</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Economizador de dados</Text>
                <Text style={styles.rowSubtitle}>
                  Define a qualidade da música para baixa e desativa vídeos
                </Text>
              </View>
              <Switch
                value={dataSaver}
                onValueChange={setDataSaver}
                trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Seção Reprodução de Áudio */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Reprodução</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Modo offline</Text>
                <Text style={styles.rowSubtitle}>
                  Toca apenas músicas que já foram baixadas
                </Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Transição suave (Crossfade)</Text>
                <Text style={styles.rowSubtitle}>
                  Permite transição contínua entre faixas
                </Text>
              </View>
              <Switch
                value={crossfade}
                onValueChange={setCrossfade}
                trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Normalizar volume</Text>
                <Text style={styles.rowSubtitle}>
                  Define o mesmo nível de volume para todas as faixas
                </Text>
              </View>
              <Switch
                value={normalizeVolume}
                onValueChange={setNormalizeVolume}
                trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Seção Conteúdo e Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacidade e Conteúdo</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Permitir conteúdo explícito</Text>
                <Text style={styles.rowSubtitle}>
                  Exibe faixas marcadas com a tag Explícito (E)
                </Text>
              </View>
              <Switch
                value={explicitContent}
                onValueChange={setExplicitContent}
                trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Informações sobre o App */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sobre</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowTitle}>Spotiflow Mobile</Text>
                <Text style={styles.rowSubtitle}>Versão 1.0.0 (Engenharia de Software - P1)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleLarge,
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    ...Typography.titleMedium,
    fontSize: 14,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowTextGroup: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  rowTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  rowSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_PLAYLISTS, USER_PROFILE } from '../constants/mockData';
import { Colors, Spacing, Typography } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';

export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: string }>();
  const { playTrack } = usePlayer();

  const getScreenDetails = () => {
    switch (type) {
      case 'premium':
        return {
          title: 'Seu Premium',
          subtitle: 'Você é membro do Spotify Premium',
          badge: 'Universitário',
          infoTitle: 'Detalhes da Assinatura',
          infoItems: [
            { label: 'Plano', val: 'Premium Universitário' },
            { label: 'Valor', val: 'R$ 11,90 / mês' },
            { label: 'Próxima cobrança', val: '12 de Outubro de 2026' },
            { label: 'Forma de pagamento', val: 'Cartão de crédito •••• 4128' },
            { label: 'Benefícios', val: 'Música sem anúncios, download offline, áudio em altíssima qualidade' },
          ],
        };
      case 'stats':
        return {
          title: 'Estatísticas Musicais',
          subtitle: 'Suas tendências e histórico de reprodução',
          badge: '2026',
          infoTitle: 'Top Artistas & Gêneros',
          infoItems: [
            { label: 'Top Artista', val: 'Cazuza (Mais de 320 minutos ouvidos)' },
            { label: 'Top Gênero', val: 'MPB / Rock Nacional' },
            { label: 'Total de Faixas', val: '1.240 músicas reproduzidas neste mês' },
            { label: 'Minutos totais', val: '4.850 minutos' },
            { label: 'Vibe predominante', val: 'Nostálgica & Poética' },
          ],
        };
      case 'recents':
        return {
          title: 'Tocadas Recentemente',
          subtitle: 'Histórico cronológico das últimas faixas e álbuns',
          badge: 'Histórico',
          infoTitle: 'Últimas Reproduções',
          infoItems: [
            { label: '14:20', val: 'Exagerado — Cazuza' },
            { label: '13:50', val: 'Codinome Beija-Flor — Cazuza' },
            { label: '12:15', val: 'O Tempo Não Para — Cazuza' },
            { label: 'Ontem', val: 'Ideologia — Cazuza' },
            { label: 'Ontem', val: 'Playlist: Echos of us' },
          ],
        };
      case 'updates':
        return {
          title: 'Suas Atualizações',
          subtitle: 'Novidades de artistas e podcasts que você segue',
          badge: 'Novidades',
          infoTitle: 'Lançamentos Recentes',
          infoItems: [
            { label: 'Hoje', val: 'Novo single de Jão disponível' },
            { label: 'Há 2 dias', val: 'Novo episódio do podcast Café da Manhã' },
            { label: 'Esta semana', val: 'Remaster de álbum clássico lançado' },
            { label: 'Recomendação', val: 'Turnê nacional anunciada na sua cidade' },
          ],
        };
      case 'add-account':
      default:
        return {
          title: 'Adicionar Conta',
          subtitle: 'Alterne entre contas ou crie um perfil infantil',
          badge: 'Multicontas',
          infoTitle: 'Opções de Conta',
          infoItems: [
            { label: 'Conta Principal', val: `${USER_PROFILE.name} (${USER_PROFILE.plan})` },
            { label: 'Perfil Kids', val: 'Criar ambiente seguro para crianças' },
            { label: 'Entrar com outra conta', val: 'Conecte outro login do Spotify' },
            { label: 'Sessão Convidado', val: 'Tocar sem alterar seu algoritmo' },
          ],
        };
    }
  };

  const details = getScreenDetails();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {details.title}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner do Cabeçalho */}
        <View style={styles.bannerCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{details.badge}</Text>
          </View>
          <Text style={styles.bannerTitle}>{details.title}</Text>
          <Text style={styles.bannerSubtitle}>{details.subtitle}</Text>
        </View>

        {/* Lista de Informações / Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{details.infoTitle}</Text>
          <View style={styles.card}>
            {details.infoItems.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{item.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Atalho de Reprodução Rápida */}
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            if (MOCK_PLAYLISTS[0].tracks.length > 0) {
              playTrack(MOCK_PLAYLISTS[0].tracks[0]);
            }
          }}
          accessibilityRole="button"
        >
          <SymbolView
            name={{
              ios: 'play.fill',
              android: 'play_arrow',
              web: 'play_arrow',
            }}
            size={20}
            tintColor={Colors.background}
            type="hierarchical"
          />
          <Text style={styles.actionButtonText}>Ouvir recomendação do dia</Text>
        </Pressable>
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
    ...Typography.titleMedium,
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  bannerCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: '#121212',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    ...Typography.titleLarge,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    ...Typography.titleMedium,
    fontSize: 14,
    color: Colors.textSecondary,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowLabel: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 11,
    marginBottom: 2,
  },
  rowValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 24,
    marginTop: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.bodyMedium,
    color: Colors.background,
    fontWeight: '800',
    fontSize: 14,
  },
});

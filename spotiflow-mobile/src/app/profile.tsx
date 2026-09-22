import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DIRECT_MESSAGES,
  FRIENDS_ACTIVITY,
  USER_PROFILE,
} from '../constants/mockData';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Barra de Topo com Botão Voltar */}
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
            tintColor={Colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho do Perfil (Avatar, Nome Jão, Ver perfil) */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: USER_PROFILE.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.profileTextGroup}>
            <Text style={styles.userName}>{USER_PROFILE.name}</Text>
            <Text style={styles.viewProfileText}>Ver perfil</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Lista de Ações da Conta */}
        <View style={styles.menuSection}>
          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'plus',
                android: 'add',
                web: 'add',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Adicionar conta</Text>
              <Text style={styles.menuSubtitle}>
                Adicionar uma criança ou outra pessoa
              </Text>
            </View>
          </Pressable>

          {/* Badge de Assinatura Premium Universitário */}
          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'sparkles',
                android: 'star',
                web: 'star',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Seu Premium</Text>
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>{USER_PROFILE.plan}</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'chart.xyaxis.line',
                android: 'insights',
                web: 'insights',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Estatísticas Musicais</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'clock',
                android: 'history',
                web: 'history',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Recentes</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'megaphone',
                android: 'campaign',
                web: 'campaign',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Suas atualizações</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuRow} accessibilityRole="button">
            <SymbolView
              name={{
                ios: 'gearshape',
                android: 'settings',
                web: 'settings',
              }}
              size={24}
              tintColor={Colors.textPrimary}
              type="hierarchical"
            />
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuTitle}>Configurações e privacidade</Text>
            </View>
          </Pressable>
        </View>

        {/* Carrossel de Atividade de Amigos (Nomes Reais/Normais) */}
        <View style={styles.friendsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsList}
          >
            {FRIENDS_ACTIVITY.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <Image
                  source={{ uri: friend.avatarUrl }}
                  style={styles.friendAvatar}
                  contentFit="cover"
                />
                <Text style={styles.friendName} numberOfLines={1}>
                  {friend.name}
                </Text>
                <Text style={styles.friendTrack} numberOfLines={1}>
                  {friend.currentTrack || friend.lastActive}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Seção de Mensagens */}
        <View style={styles.messagesSection}>
          <View style={styles.messagesHeader}>
            <View style={styles.messagesHeadingGroup}>
              <Text style={styles.messagesTitle}>Mensagens</Text>
              <SymbolView
                name={{
                  ios: 'chevron.forward',
                  android: 'chevron_right',
                  web: 'chevron_right',
                }}
                size={18}
                tintColor={Colors.textPrimary}
                type="hierarchical"
              />
            </View>

            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Escrever mensagem">
              <SymbolView
                name={{
                  ios: 'square.and.pencil',
                  android: 'edit',
                  web: 'edit',
                }}
                size={22}
                tintColor={Colors.textPrimary}
                type="hierarchical"
              />
            </Pressable>
          </View>

          {/* Lista de Mensagens Diretas */}
          <View style={styles.messagesList}>
            {DIRECT_MESSAGES.map((dm) => (
              <View key={dm.id} style={styles.dmRow}>
                <Image
                  source={{ uri: dm.avatarUrl }}
                  style={styles.dmAvatar}
                  contentFit="cover"
                />
                <View style={styles.dmContent}>
                  <Text style={styles.dmName}>{dm.senderName}</Text>
                  <Text style={styles.dmPreview}>
                    {dm.previewText} • {dm.date}
                  </Text>
                </View>
              </View>
            ))}

            <Pressable style={styles.newChatRow} accessibilityRole="button">
              <View style={styles.newChatIconCircle}>
                <SymbolView
                  name={{
                    ios: 'square.and.pencil',
                    android: 'edit',
                    web: 'edit',
                  }}
                  size={20}
                  tintColor={Colors.textPrimary}
                  type="hierarchical"
                />
              </View>
              <Text style={styles.newChatText}>Nova mensagem</Text>
            </Pressable>
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
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.backgroundCard,
  },
  profileTextGroup: {
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  userName: {
    ...Typography.titleLarge,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  viewProfileText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  menuSection: {
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuTextGroup: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  menuTitle: {
    ...Typography.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: '#7CD1B8', // tom verde pastel do Universitário no print
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  premiumBadgeText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: '700',
  },
  friendsSection: {
    marginVertical: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  friendsList: {
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  friendCard: {
    alignItems: 'center',
    width: 68,
  },
  friendAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
    backgroundColor: Colors.surfaceCard,
  },
  friendName: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  friendTrack: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  messagesSection: {
    marginTop: Spacing.md,
  },
  messagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  messagesHeadingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messagesTitle: {
    ...Typography.titleMedium,
    fontSize: 18,
    fontWeight: '800',
  },
  messagesList: {
    gap: Spacing.md,
  },
  dmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dmAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceCard,
  },
  dmContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  dmName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  dmPreview: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  newChatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  newChatIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: Spacing.md,
  },
});

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MOCK_PLAYLISTS,
  SEARCH_CATEGORIES,
  USER_PROFILE,
} from '../../../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../../../constants/theme';
import { useTheme } from '../../../context/ThemeContext';

export default function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryWidth = Math.floor((width - Spacing.md * 3) / 2);
  const styles = useMemo(
    () => createStyles(colors, typography, categoryWidth),
    [colors, typography, categoryWidth]
  );

  const filteredCategories = SEARCH_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
          >
            <Image
              source={
                USER_PROFILE.avatarSource ?? { uri: USER_PROFILE.avatarUrl }
              }
              style={styles.avatar}
              contentFit="cover"
            />
          </Pressable>

          <Text style={styles.headerTitle}>Buscar</Text>

          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Buscar com câmera"
          >
            <SymbolView
              name={{
                ios: 'camera',
                android: 'photo_camera',
                web: 'photo_camera',
              }}
              size={24}
              tintColor={colors.textPrimary}
              type="hierarchical"
            />
          </Pressable>
        </View>

        {/* Barra de Busca Branca Estilo Spotify */}
        <View style={styles.searchBarContainer}>
          <SymbolView
            name={{
              ios: 'magnifyingglass',
              android: 'search',
              web: 'search',
            }}
            size={22}
            tintColor={colors.searchBarText}
            type="hierarchical"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você quer ouvir?"
            placeholderTextColor={colors.searchBarPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              hitSlop={8}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
            >
              <SymbolView
                name={{
                  ios: 'xmark.circle.fill',
                  android: 'cancel',
                  web: 'cancel',
                }}
                size={18}
                tintColor={colors.searchBarPlaceholder}
                type="hierarchical"
              />
            </Pressable>
          )}
        </View>

        {/* Carrossel de Destaques: Playlists que você pode assistir */}
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>
            Playlists que você pode assistir
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {MOCK_PLAYLISTS.slice(0, 3).map((playlist) => (
              <Pressable
                key={playlist.id}
                style={styles.featuredCard}
                onPress={() =>
                  router.push({
                    pathname: '/playlist/[id]',
                    params: { id: playlist.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Ver ${playlist.title}`}
              >
                <Image
                  source={playlist.coverSource ?? { uri: playlist.coverUrl }}
                  style={styles.featuredCover}
                  contentFit="cover"
                />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredBadge}>VÍDEOS PARA VOCÊ</Text>
                  <Text style={styles.featuredTitle} numberOfLines={2}>
                    {playlist.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Grid de Seções e Gêneros Musicais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navegar por todas as seções</Text>
          <View style={styles.gridContainer}>
            {filteredCategories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Categoria ${category.title}`}
              >
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryImage}
                  contentFit="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ThemeColors,
  typography: ThemeTypography,
  categoryWidth: number
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: 110,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundCard,
    },
    headerTitle: {
      ...typography.titleLarge,
      fontSize: 24,
      flex: 1,
      marginLeft: Spacing.md,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchBarBg,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      height: 48,
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.searchBarText,
      height: '100%',
    },
    carouselSection: {
      marginBottom: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...typography.titleMedium,
      fontSize: 18,
      marginBottom: Spacing.md,
    },
    horizontalScroll: {
      gap: Spacing.md,
      paddingRight: Spacing.md,
    },
    featuredCard: {
      width: 150,
      height: 200,
      borderRadius: Radius.md,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.backgroundCard,
    },
    featuredCover: {
      width: '100%',
      height: '100%',
    },
    featuredOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.sm,
      backgroundColor: colors.overlayCard,
    },
    featuredBadge: {
      backgroundColor: colors.accentPink,
      color: colors.badgeText,
      fontSize: 9,
      fontWeight: '900',
      alignSelf: 'flex-start',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 2,
      marginBottom: 4,
    },
    featuredTitle: {
      ...typography.bodyMedium,
      color: colors.badgeText,
      fontWeight: '700',
      fontSize: 13,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: categoryWidth,
      height: 96,
      borderRadius: Radius.md,
      padding: Spacing.sm,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'flex-start',
    },
    categoryTitle: {
      ...typography.titleMedium,
      color: colors.badgeText,
      fontSize: 15,
      maxWidth: '75%',
    },
    categoryImage: {
      width: 64,
      height: 64,
      position: 'absolute',
      bottom: -6,
      right: -12,
      transform: [{ rotate: '25deg' }],
      borderRadius: Radius.xs,
    },
  });
}

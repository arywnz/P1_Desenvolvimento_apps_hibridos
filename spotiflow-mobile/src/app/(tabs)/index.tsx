import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { USER_PROFILE } from '../../constants/mockData';

const MEDIA_FILTERS = ['Tudo', 'Musicas', 'Podcasts'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState(MEDIA_FILTERS[0]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileGroup}>
            <Image
              source={{ uri: USER_PROFILE.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              accessibilityLabel="Avatar do perfil"
            />
            <View>
              <Text style={styles.eyebrow}>{USER_PROFILE.plan}</Text>
              <Text style={styles.title}>Boa noite</Text>
            </View>
          </View>
        </View>

        <View style={styles.filters} accessibilityRole="tablist">
          {MEDIA_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 96,
  },
  header: {
    marginBottom: Spacing.md,
  },
  profileGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
  },
  eyebrow: {
    ...Typography.bodySmall,
    marginBottom: 2,
  },
  title: {
    ...Typography.titleLarge,
    fontSize: 24,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterPill: {
    minHeight: 34,
    borderRadius: 17,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundCard,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
  },
  filterTextActive: {
    color: Colors.background,
  },
});

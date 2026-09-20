import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar</Text>
      <Text style={styles.subtitle}>Entrada para criacao de playlists</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  title: {
    ...Typography.titleLarge,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Spotiflow</Text>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.subtitle}>Feed inicial em construcao</Text>
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
  eyebrow: {
    ...Typography.bodySmall,
    marginBottom: Spacing.sm,
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

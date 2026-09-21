import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function PlayerModal() {
  return (
    <View style={styles.container}>
      <Text style={{ color: Colors.textPrimary }}>Player</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

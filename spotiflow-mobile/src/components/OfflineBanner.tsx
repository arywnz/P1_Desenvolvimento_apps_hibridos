import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useOnline } from '../hooks/useOnline';

export function OfflineBanner() {
  const online = useOnline();
  const { colors } = useTheme();
  if (online !== false) return null;
  return (
    <View accessibilityLiveRegion="polite" style={{ padding: 10, backgroundColor: colors.backgroundCard }}>
      <Text style={{ color: colors.textPrimary, textAlign: 'center' }}>Você está offline</Text>
    </View>
  );
}

import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Tabs, useRouter } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../context/ThemeContext';
import { MiniPlayer } from '../../../components/MiniPlayer';

type TabIconName = SymbolViewProps['name'];

function TabIcon({
  color,
  focused,
  name,
}: {
  color: ColorValue;
  focused: boolean;
  name: TabIconName;
}) {
  return (
    <SymbolView
      name={name}
      size={focused ? 27 : 24}
      tintColor={color}
      type="hierarchical"
    />
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const bottomPadding = Math.max(insets.bottom, 12);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.textPrimary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.border,
            height: tabBarHeight,
            paddingBottom: bottomPadding,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            ...typography.caption,
            fontWeight: '600',
          },
          tabBarItemStyle: {
            minHeight: 52,
          },
          sceneStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarLabel: 'Início',
            tabBarAccessibilityLabel: 'Abrir início',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name={{
                  ios: focused ? 'house.fill' : 'house',
                  android: 'home',
                  web: 'home',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
            tabBarLabel: 'Buscar',
            tabBarAccessibilityLabel: 'Abrir busca',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name={{
                  ios: 'magnifyingglass',
                  android: 'search',
                  web: 'search',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Biblioteca',
            tabBarLabel: 'Biblioteca',
            tabBarAccessibilityLabel: 'Abrir biblioteca',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name={{
                  ios: focused ? 'books.vertical.fill' : 'books.vertical',
                  android: 'library_music',
                  web: 'library_music',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Criar',
            tabBarLabel: 'Criar',
            tabBarAccessibilityLabel: 'Criar playlist',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name={{
                  ios: focused ? 'plus.circle.fill' : 'plus.circle',
                  android: 'add_circle',
                  web: 'add_circle',
                }}
              />
            ),
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              router.push('/create-modal');
            },
          })}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  );
}

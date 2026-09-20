import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.border,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...Typography.caption,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          minHeight: 56,
        },
        sceneStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Abrir inicio',
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
      />
    </Tabs>
  );
}

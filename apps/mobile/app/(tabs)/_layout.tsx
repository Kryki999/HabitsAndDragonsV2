import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { type ColorValue, StyleSheet, View } from 'react-native';

import AccountBar from '@/components/AccountBar';
import Colors from '@/constants/colors';
import { colors } from '@/theme/colors';

function tabIcon(name: keyof typeof Ionicons.glyphMap) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={typeof color === 'string' ? color : colors.gold} />
  );
}

export default function TabLayout() {
  return (
    <View style={styles.shell}>
      <AccountBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Questy',
            tabBarIcon: tabIcon('checkbox-outline'),
          }}
        />
        <Tabs.Screen
          name="world"
          options={{
            title: 'World',
            tabBarIcon: tabIcon('map-outline'),
          }}
        />
        <Tabs.Screen
          name="hero"
          options={{
            title: 'Hero',
            tabBarIcon: tabIcon('person-outline'),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: 'Społeczność',
            tabBarIcon: tabIcon('people-outline'),
          }}
        />
        <Tabs.Screen
          name="mentor"
          options={{
            title: 'Mentor',
            tabBarIcon: tabIcon('chatbubbles-outline'),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});

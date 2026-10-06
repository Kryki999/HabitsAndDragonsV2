import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DevToolsButton } from '@/components/DevToolsButton';
import { useOnboardingStore } from '@/onboarding/store';
import { TabBar } from '@/ui/TabBar';
import { tokens } from '@/ui/tokens';

export default function TabLayout() {
  const complete = useOnboardingStore((s) => s.complete);
  if (!complete) return <Redirect href="/onboarding" />;

  return (
    <View style={styles.shell}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: tokens.canvas },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Quests' }} />
        <Tabs.Screen name="world" options={{ title: 'World' }} />
        <Tabs.Screen name="hero" options={{ title: 'Hero' }} />
        <Tabs.Screen name="social" options={{ title: 'Social' }} />
        <Tabs.Screen name="mentor" options={{ title: 'Path' }} />
      </Tabs>
      <DevToolsButton />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
});

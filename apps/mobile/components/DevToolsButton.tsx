import { useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

type DevToolsPanelProps = { visible: boolean; onClose: () => void };

const DevToolsPanel: ComponentType<DevToolsPanelProps> | null = __DEV__
  ? (require('./DevToolsPanel').default as ComponentType<DevToolsPanelProps>)
  : null;

/** Same gold DEV chip as the old account bar. Sits above the tab bar on every tab. */
export function DevToolsButton() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  if (!__DEV__ || !DevToolsPanel) return null;

  const padBottom = Math.max(insets.bottom, 30);

  return (
    <>
      <DevToolsPanel visible={open} onClose={() => setOpen(false)} />
      <Pressable
        testID="account-dev-badge"
        accessibilityRole="button"
        accessibilityLabel="Open DEV tools"
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Medium);
          setOpen(true);
        }}
        hitSlop={8}
        style={[styles.badge, { bottom: 66 + padBottom + 8 }]}
      >
        <Text style={styles.label}>DEV</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    left: 12,
    zIndex: 80,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.gold,
    backgroundColor: 'rgba(13, 10, 20, 0.88)',
  },
  label: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});

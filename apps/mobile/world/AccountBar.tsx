import React, { useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, KeyRound } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { ACCOUNT_BAR_RESERVE } from './accountBarLayout';

export { ACCOUNT_BAR_RESERVE };

type DevToolsPanelProps = { onClose: () => void };

/** Production builds never require the panel — no UI entry, no extra module. */
const DevToolsPanel: ComponentType<DevToolsPanelProps> | null = __DEV__
  ? (require('./DevToolsPanel').default as ComponentType<DevToolsPanelProps>)
  : null;

/** Edge HUD: level / gold / keys. Center stays open for the still. */
export default function AccountBar() {
  const insets = useSafeAreaInsets();
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const [devOpen, setDevOpen] = useState(false);

  const openDev = __DEV__
    ? () => {
        impactAsync(ImpactFeedbackStyle.Medium);
        setDevOpen(true);
      }
    : undefined;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill} testID="account-bar">
      {DevToolsPanel && devOpen ? <DevToolsPanel onClose={() => setDevOpen(false)} /> : null}
      <View
        pointerEvents="box-none"
        style={[styles.row, { paddingTop: Math.max(insets.top, 10), zIndex: 2 }]}
      >
        <Chip
          testID="account-level"
          accessibilityLabel={`Level ${playerLevel}`}
          onLongPress={openDev}
        >
          <Text style={styles.levelLabel}>Lv.{playerLevel}</Text>
        </Chip>
        <View pointerEvents="none" style={styles.gap} />
        <View pointerEvents={openDev ? 'box-none' : 'none'} style={styles.cluster}>
          <Chip testID="account-gold" accessibilityLabel={`${gold} gold`} onLongPress={openDev}>
            <Coins size={14} color={Colors.dark.gold} strokeWidth={2.4} />
            <Text style={styles.goldValue}>{gold}</Text>
          </Chip>
          <Chip
            testID="account-keys"
            accessibilityLabel={`${dungeonKeys} keys`}
            onLongPress={openDev}
          >
            <KeyRound size={14} color={Colors.dark.cyan} strokeWidth={2.4} />
            <Text style={styles.keysValue}>{dungeonKeys}</Text>
          </Chip>
        </View>
      </View>
    </View>
  );
}

function Chip({
  children,
  testID,
  accessibilityLabel,
  onLongPress,
}: {
  children: React.ReactNode;
  testID: string;
  accessibilityLabel: string;
  onLongPress?: () => void;
}) {
  if (!onLongPress) {
    return (
      <View
        testID={testID}
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel}
        pointerEvents="none"
        style={styles.chip}
      >
        {children}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}. Long press for DEV tools`}
      onLongPress={onLongPress}
      delayLongPress={450}
      style={styles.chip}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: ACCOUNT_BAR_RESERVE,
  },
  gap: {
    flex: 1,
  },
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: 'rgba(13, 10, 20, 0.72)',
  },
  levelLabel: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontVariant: ['tabular-nums'],
  },
  goldValue: {
    color: Colors.dark.gold,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  keysValue: {
    color: Colors.dark.cyan,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

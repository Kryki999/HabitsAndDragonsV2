import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, KeyRound } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';

/** Chip row below the status inset. OverlayHud title/nav sits under this. */
export const ACCOUNT_BAR_RESERVE = 36;

/** Edge HUD: level / gold / keys. Center stays open for the still. */
export default function AccountBar() {
  const insets = useSafeAreaInsets();
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const playerLevel = useHeroStore((s) => s.playerLevel);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill} testID="account-bar">
      <View pointerEvents="box-none" style={[styles.row, { paddingTop: Math.max(insets.top, 10) }]}>
        <Chip testID="account-level" accessibilityLabel={`Level ${playerLevel}`}>
          <Text style={styles.levelLabel}>Lv.{playerLevel}</Text>
        </Chip>
        <View pointerEvents="none" style={styles.gap} />
        <View pointerEvents="none" style={styles.cluster}>
          <Chip testID="account-gold" accessibilityLabel={`${gold} gold`}>
            <Coins size={14} color={Colors.dark.gold} strokeWidth={2.4} />
            <Text style={styles.goldValue}>{gold}</Text>
          </Chip>
          <Chip testID="account-keys" accessibilityLabel={`${dungeonKeys} keys`}>
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
}: {
  children: React.ReactNode;
  testID: string;
  accessibilityLabel: string;
}) {
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

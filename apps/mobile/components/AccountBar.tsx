import React, { useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, KeyRound } from 'lucide-react-native';

import CircularProgress from '@/components/CircularProgress';
import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

type DevToolsPanelProps = { visible: boolean; onClose: () => void };

/** Production builds never require the panel — no UI entry, no extra module. */
const DevToolsPanel: ComponentType<DevToolsPanelProps> | null = __DEV__
  ? (require('./DevToolsPanel').default as ComponentType<DevToolsPanelProps>)
  : null;

/**
 * Global account HUD — V1 tab-shell layout (avatar XP ring, name, Lv, gold, keys).
 * Lives above Questy / World / Hero (and the other tabs), not over the World still.
 */
export default function AccountBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const gold = useHeroStore((s) => s.gold);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const currentLevelXP = useHeroStore((s) => s.currentLevelXP);
  const xpForNextLevel = useHeroStore((s) => s.xpForNextLevel);
  const heroDisplayName = useHeroStore((s) => s.heroDisplayName);
  const [devOpen, setDevOpen] = useState(false);

  const xpProgress = xpForNextLevel > 0 ? currentLevelXP / xpForNextLevel : 0;
  const hudPlayerName = (heroDisplayName?.trim() || 'Wayfarer').slice(0, 48);

  const openDev = __DEV__
    ? () => {
        impactAsync(ImpactFeedbackStyle.Medium);
        setDevOpen(true);
      }
    : undefined;

  return (
    <View
      testID="account-bar"
      accessibilityRole="header"
      style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}
    >
      {DevToolsPanel ? <DevToolsPanel visible={devOpen} onClose={() => setDevOpen(false)} /> : null}

      <View style={styles.topBarRow}>
        <Pressable
          testID="account-level"
          accessibilityRole="button"
          accessibilityLabel={`${hudPlayerName}, Level ${playerLevel}`}
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            router.navigate('/hero');
          }}
          onLongPress={openDev}
          delayLongPress={450}
          style={({ pressed }) => [styles.hudLeft, pressed && styles.hudLeftPressed]}
        >
          <CircularProgress
            progress={xpProgress}
            size={40}
            strokeWidth={3}
            color={Colors.dark.gold}
            backgroundColor={Colors.dark.border}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>🧙‍♂️</Text>
            </View>
          </CircularProgress>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
              {hudPlayerName}
            </Text>
            <Text style={styles.playerLevelText}>Lv.{playerLevel}</Text>
          </View>
        </Pressable>

        <View style={styles.hudStatsCluster}>
          <StatItem
            testID="account-gold"
            accessibilityLabel={`${gold} gold`}
            onLongPress={openDev}
          >
            <Coins color={Colors.dark.gold} size={15} strokeWidth={2.2} />
            <Text style={styles.hudStatValueGold}>{gold}</Text>
          </StatItem>
          <StatItem
            testID="account-keys"
            accessibilityLabel={`${dungeonKeys} keys`}
            onLongPress={openDev}
          >
            <KeyRound color={Colors.dark.cyan} size={15} strokeWidth={2.2} />
            <Text style={styles.hudStatValueKeys}>{dungeonKeys}</Text>
          </StatItem>
        </View>

        <View style={styles.hudRight}>
          {openDev ? (
            <Pressable
              testID="account-dev-badge"
              accessibilityRole="button"
              accessibilityLabel="Open DEV tools"
              onPress={openDev}
              hitSlop={8}
              style={({ pressed }) => [styles.devBadge, pressed && styles.hudLeftPressed]}
            >
              <Text style={styles.devBadgeLabel}>DEV</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function StatItem({
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
        style={styles.hudStatItem}
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
      style={styles.hudStatItem}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 6,
    backgroundColor: Colors.dark.background,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
  },
  hudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  hudLeftPressed: {
    opacity: 0.9,
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.dark.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  playerInfo: {
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  playerName: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '800',
    maxWidth: '100%',
  },
  playerLevelText: {
    color: Colors.dark.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  hudStatsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    flexShrink: 0,
    paddingHorizontal: 4,
  },
  hudStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hudStatValueGold: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dark.gold,
    fontVariant: ['tabular-nums'],
  },
  hudStatValueKeys: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dark.cyan,
    fontVariant: ['tabular-nums'],
  },
  hudRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    minWidth: 36,
  },
  devBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.gold,
    backgroundColor: Colors.dark.gold + '22',
  },
  devBadgeLabel: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});

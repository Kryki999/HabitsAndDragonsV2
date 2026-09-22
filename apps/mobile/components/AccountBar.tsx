import React, { useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, KeyRound, Mail, Settings as SettingsIcon } from 'lucide-react-native';

import CircularProgress from '@/components/CircularProgress';
import SettingsModal from '@/components/SettingsModal';
import Colors from '@/constants/colors';
import { useHeroStore } from '@/hero/store';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

type DevToolsPanelProps = { visible: boolean; onClose: () => void };

/** Production builds never require the panel — no UI entry, no extra module. */
const DevToolsPanel: ComponentType<DevToolsPanelProps> | null = __DEV__
  ? (require('./DevToolsPanel').default as ComponentType<DevToolsPanelProps>)
  : null;

/**
 * Account HUD on Quests, Hero, Social, and Mentor.
 * The World tab omits this so the kingdom board can run full-bleed.
 * Pills: gold + keys (ui-upgrade variant). Mail is a disabled stub.
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
  const [settingsOpen, setSettingsOpen] = useState(false);

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
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />

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
          style={({ pressed }) => [styles.hudLeft, pressed && styles.pressed]}
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

        <View style={styles.pillBadgesContainer}>
          <StatPill
            testID="account-gold"
            accessibilityLabel={`${gold} gold`}
            onLongPress={openDev}
          >
            <Coins color={Colors.dark.gold} size={14} />
            <Text style={styles.pillValueGold}>{gold}</Text>
          </StatPill>
          <StatPill
            testID="account-keys"
            accessibilityLabel={`${dungeonKeys} keys`}
            onLongPress={openDev}
          >
            <KeyRound color={Colors.dark.cyan} size={14} />
            <Text style={styles.pillValueKeys}>{dungeonKeys}</Text>
          </StatPill>
        </View>

        <View style={styles.hudRight}>
          {openDev ? (
            <Pressable
              testID="account-dev-badge"
              accessibilityRole="button"
              accessibilityLabel="Open DEV tools"
              onPress={openDev}
              hitSlop={6}
              style={({ pressed }) => [styles.devBadge, pressed && styles.pressed]}
            >
              <Text style={styles.devBadgeLabel}>DEV</Text>
            </Pressable>
          ) : null}

          <Pressable
            testID="account-mail"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Mail, coming soon"
            disabled
            style={[styles.iconButton, styles.iconButtonDisabled]}
          >
            <Mail color={Colors.dark.textMuted} size={20} />
          </Pressable>

          <Pressable
            testID="account-settings"
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Light);
              setSettingsOpen(true);
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <SettingsIcon color={Colors.dark.text} size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatPill({
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
        style={styles.pillBadge}
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
      style={styles.pillBadge}
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
  pressed: {
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
  pillBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 0,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  pillValueGold: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dark.gold,
    fontVariant: ['tabular-nums'],
  },
  pillValueKeys: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.dark.cyan,
    fontVariant: ['tabular-nums'],
  },
  hudRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconButtonDisabled: {
    opacity: 0.42,
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

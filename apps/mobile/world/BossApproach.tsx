import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoorOpen, HelpCircle, KeyRound } from 'lucide-react-native';

import Colors from '@/constants/colors';
import BuyKeySheet from '@/components/BuyKeySheet';
import LootDetailModal, { type LootModalPayload } from '@/components/LootDetailModal';
import { impactAsync, notificationAsync, selectionAsync, ImpactFeedbackStyle, NotificationFeedbackType } from '@/lib/hapticsGate';
import { useHeroStore } from '@/hero/store';
import {
  decideDungeonEntry,
  dungeonCdMs,
  formatCooldownRemaining,
  KEY_PRICE_GOLD,
} from '@/lib/economy';
import BattleSimulationModal from '@/combat/BattleSimulationModal';
import BossVictoryLootModal from '@/combat/BossVictoryLootModal';
import FightLootTray from '@/combat/FightLootTray';
import WinChanceBreakdownModal from '@/combat/WinChanceBreakdownModal';
import {
  computeWinChance,
  resolveFight,
  rollPlaygroundLoot,
  rollWeightedLoot,
  wineInPack,
  GUTTERJACK_WINE_ID,
} from '@/combat/engine';
import { winChanceColor } from '@/combat/winChanceColor';
import type { CombatChallenge, FightLootPrize, FightPhase, FightResolution, WinChanceBreakdown } from '@/combat/types';
import type { DungeonLootEntry } from '@/types/dungeonLoot';

import OverlayHud from './OverlayHud';
import StillFrame, { type CoverAnchor } from './StillFrame';
import { useWorldStore } from './store';

function payloadFromEntry(entry: DungeonLootEntry): LootModalPayload {
  if (entry.kind === 'gold') return { type: 'gold', entry };
  if (entry.kind === 'empty') return { type: 'empty', entry };
  return { type: 'item', entry };
}

export type BossApproachProps = {
  art: ImageSourcePropType;
  intrinsic: { width: number; height: number };
  anchor?: CoverAnchor;
  challenge: CombatChallenge;
  lootTable: readonly DungeonLootEntry[];
  isFirstClear: boolean;
  onBack: () => void;
  onCleared: () => void;
  /** Gutterjack wine sip + Gutterjack loot roller. */
  sipWine?: boolean;
  /** Only Gutterjack first clear is a 100% tutorial lock. */
  tutorialLock?: boolean;
  /** First Gutterjack: no key/CD gate. Still starts Common CD after the fight. */
  skipEntryGate?: boolean;
  farmWeights?: readonly { id: string; weight: number }[];
  rollLoot?: (isFirstClear: boolean) => FightLootPrize;
  headerExtra?: ReactNode;
  whisper?: string | null;
};

export default function BossApproach({
  art,
  intrinsic,
  anchor = 'bottom',
  challenge,
  lootTable,
  isFirstClear,
  onBack,
  onCleared,
  sipWine = false,
  tutorialLock = false,
  skipEntryGate = false,
  farmWeights,
  rollLoot,
  headerExtra,
  whisper,
}: BossApproachProps) {
  const insets = useSafeAreaInsets();

  const playerLevel = useHeroStore((s) => s.playerLevel);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);
  const ownedItemIds = useHeroStore((s) => s.ownedItemIds);
  const consumeOwnedItem = useHeroStore((s) => s.consumeOwnedItem);
  const applyLootPrize = useHeroStore((s) => s.applyLootPrize);
  const addGold = useHeroStore((s) => s.addGold);
  const recordBossWin = useHeroStore((s) => s.recordBossWin);
  const dungeonKeys = useHeroStore((s) => s.dungeonKeys ?? 0);
  const gold = useHeroStore((s) => s.gold);
  const spendDungeonKey = useHeroStore((s) => s.spendDungeonKey);
  const cooldownUntil = useWorldStore((s) => s.encounterCooldownUntil?.[challenge.id]);
  const startEncounterCooldown = useWorldStore((s) => s.startEncounterCooldown);

  const [phase, setPhase] = useState<FightPhase>('approach');
  const [resolution, setResolution] = useState<FightResolution | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [inspect, setInspect] = useState<LootModalPayload | null>(null);
  const [buyKeysOpen, setBuyKeysOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  const hasWine = sipWine && wineInPack(ownedItemIds);
  const willSipWine = Boolean(hasWine && !isFirstClear);

  const breakdown: WinChanceBreakdown = useMemo(
    () =>
      computeWinChance(
        challenge,
        {
          isFirstClear,
          playerLevel,
          equippedRelicId,
          ownedItemIds,
          willSipWine,
        },
        { sipWine, tutorialLock },
      ),
    [challenge, equippedRelicId, isFirstClear, ownedItemIds, playerLevel, sipWine, tutorialLock, willSipWine],
  );

  const chanceColor = winChanceColor(breakdown.displayPct);
  const lootRoller =
    rollLoot ??
    (farmWeights ? () => rollWeightedLoot(farmWeights) : sipWine ? undefined : rollPlaygroundLoot);

  const entry = useMemo(
    () =>
      decideDungeonEntry({
        skipGate: skipEntryGate,
        cooldownUntil,
        dungeonKeys,
        now: nowMs,
      }),
    [cooldownUntil, dungeonKeys, nowMs, skipEntryGate],
  );

  const entryHint = !entry.ok
    ? `Free entry in ${formatCooldownRemaining(entry.readyAt, nowMs)} · need 1 key`
    : entry.cost === 'key'
      ? `Free entry in ${formatCooldownRemaining(cooldownUntil ?? '', nowMs)} · 1 key to enter now`
      : entry.cost === 'tutorial'
        ? 'Tutorial — first fight is free'
        : 'Free entry ready';

  const fightLabel = !entry.ok
    ? gold >= KEY_PRICE_GOLD
      ? `Buy key · ${KEY_PRICE_GOLD}g`
      : 'Need a key'
    : entry.cost === 'key'
      ? 'Fight · 1 key'
      : 'Fight';

  const handleBack = useCallback(() => {
    if (phase === 'clash' || phase === 'loot') return;
    impactAsync(ImpactFeedbackStyle.Light);
    onBack();
  }, [onBack, phase]);

  const beginFight = useCallback(() => {
    selectionAsync();
    impactAsync(ImpactFeedbackStyle.Medium);
    const sipped = willSipWine ? consumeOwnedItem(GUTTERJACK_WINE_ID) : false;
    const next = resolveFight({
      breakdown,
      isFirstClear,
      sippedWine: sipped,
      challenge,
      rollLoot: lootRoller,
    });
    if (!next.won) addGold(next.consolationGold);
    setResolution(next);
    setPhase('clash');
  }, [addGold, breakdown, challenge, consumeOwnedItem, isFirstClear, lootRoller, willSipWine]);

  const onFight = useCallback(() => {
    if (phase !== 'approach') return;
    const decision = decideDungeonEntry({
      skipGate: skipEntryGate,
      cooldownUntil: useWorldStore.getState().encounterCooldownUntil?.[challenge.id],
      dungeonKeys: useHeroStore.getState().dungeonKeys ?? 0,
    });
    if (!decision.ok) {
      impactAsync(ImpactFeedbackStyle.Light);
      setBuyKeysOpen(true);
      return;
    }
    if (decision.cost === 'key') {
      if (!spendDungeonKey()) {
        notificationAsync(NotificationFeedbackType.Warning);
        setBuyKeysOpen(true);
        return;
      }
    } else {
      startEncounterCooldown(challenge.id, dungeonCdMs(challenge.tier));
    }
    beginFight();
  }, [beginFight, challenge.id, challenge.tier, phase, skipEntryGate, spendDungeonKey, startEncounterCooldown]);

  const onOpenChest = useCallback(() => {
    if (!resolution?.won) return;
    applyLootPrize(resolution.loot);
    recordBossWin();
    if (isFirstClear) onCleared();
    setPhase('loot');
  }, [applyLootPrize, isFirstClear, onCleared, recordBossWin, resolution]);

  const onRematch = useCallback(() => {
    setResolution(null);
    setPhase('approach');
  }, []);

  const onCollectLoot = useCallback(() => {
    setResolution(null);
    setPhase('approach');
  }, []);

  const showApproachChrome = phase === 'approach';

  return (
    <View style={styles.root}>
      <StillFrame
        source={art}
        intrinsicWidth={intrinsic.width}
        intrinsicHeight={intrinsic.height}
        anchor={anchor}
      />

      {showApproachChrome ? (
        <>
          <OverlayHud
            insets={insets}
            kicker={challenge.dungeonName}
            title={challenge.bossName}
            left={{ icon: 'back', onPress: handleBack, accessibilityLabel: 'Back' }}
            right={
              <View style={styles.rightStack}>
                {headerExtra}
                <Pressable
                  testID="win-chance"
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Light);
                    setHelpOpen(true);
                  }}
                  hitSlop={8}
                  style={({ pressed }) => [styles.winBadge, pressed && styles.pressed]}
                >
                  <Text style={[styles.winPct, { color: chanceColor }]}>{breakdown.displayPct}%</Text>
                  <View style={styles.helpDot}>
                    <HelpCircle size={15} color={Colors.dark.cyan} strokeWidth={2.4} />
                  </View>
                </Pressable>
              </View>
            }
          />

          <LinearGradient
            pointerEvents="none"
            colors={['transparent', 'transparent', 'rgba(7,5,16,0.28)', 'rgba(7,5,16,0.7)']}
            locations={[0, 0.52, 0.8, 1]}
            style={styles.floorVeil}
          />

          <View pointerEvents="box-none" style={[styles.sheetWrap, { paddingBottom: 12 + insets.bottom }]}>
            <View style={styles.bottom}>
              <FightLootTray table={lootTable} onInspect={(entry) => setInspect(payloadFromEntry(entry))} />
              <Text style={styles.entryHint}>{entryHint}</Text>
              <Pressable
                testID="fight-button"
                onPress={onFight}
                style={({ pressed }) => [styles.fightOuter, pressed && styles.fightPressed]}
              >
                <LinearGradient
                  colors={[...Colors.gradients.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.fightGradient}
                >
                  {entry.ok && entry.cost === 'key' ? (
                    <KeyRound size={18} color="#1a1228" />
                  ) : (
                    <DoorOpen size={18} color="#1a1228" />
                  )}
                  <Text style={styles.fightLabel}>{fightLabel}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      <BattleSimulationModal
        visible={phase === 'clash' || phase === 'outcome'}
        dungeonName={challenge.dungeonName}
        bossName={challenge.bossName}
        resolution={resolution}
        onOpenChest={onOpenChest}
        onRematch={onRematch}
      />

      <BossVictoryLootModal
        visible={phase === 'loot' && resolution?.won === true}
        bossName={challenge.bossName}
        dungeonName={challenge.dungeonName}
        accentColor={challenge.accentColor}
        lootTable={lootTable}
        prize={resolution?.won ? resolution.loot : null}
        onCollect={onCollectLoot}
      />

      <WinChanceBreakdownModal visible={helpOpen} breakdown={breakdown} onClose={() => setHelpOpen(false)} />

      {whisper ? (
        <View pointerEvents="none" style={[styles.whisperWrap, { top: 56 }]}>
          <Text style={styles.whisper}>{whisper}</Text>
        </View>
      ) : null}

      <LootDetailModal
        visible={inspect != null}
        onClose={() => setInspect(null)}
        payload={inspect}
        accentHint={
          inspect?.type === 'item' ? undefined : inspect?.type === 'gold' ? Colors.dark.gold : undefined
        }
      />

      <BuyKeySheet
        visible={buyKeysOpen}
        onClose={() => setBuyKeysOpen(false)}
        dungeonHint={
          !entry.ok
            ? `Free entry in ${formatCooldownRemaining(entry.readyAt, nowMs)}. Buy a key to fight now.`
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  rightStack: {
    alignItems: 'flex-end',
    gap: 8,
  },
  winBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  winPct: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  helpDot: {
    padding: 1,
  },
  floorVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '58%',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottom: {
    paddingHorizontal: 12,
  },
  fightOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  fightPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  fightGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  fightLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1228',
  },
  entryHint: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  whisperWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  whisper: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

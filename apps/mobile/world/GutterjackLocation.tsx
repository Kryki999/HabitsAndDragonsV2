import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoorOpen, HelpCircle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import LootDetailModal, { type LootModalPayload } from '@/components/LootDetailModal';
import { impactAsync, selectionAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { useHeroStore } from '@/hero/store';
import BattleSimulationModal from '@/combat/BattleSimulationModal';
import BossVictoryLootModal from '@/combat/BossVictoryLootModal';
import FightLootTray from '@/combat/FightLootTray';
import WinChanceBreakdownModal from '@/combat/WinChanceBreakdownModal';
import {
  computeGutterjackWinChance,
  resolveFight,
  wineInPack,
  GUTTERJACK_WINE_ID,
} from '@/combat/engine';
import { winChanceColor } from '@/combat/winChanceColor';
import type { FightLootPrize, FightPhase, FightResolution, WinChanceBreakdown } from '@/combat/types';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import {
  GUTTERJACK_ART,
  GUTTERJACK_ART_INTRINSIC,
  GUTTERJACK_CHALLENGE,
  GUTTERJACK_LOOT_TABLE,
} from './content';
import { useWorldStore } from './store';
import type { DungeonLootEntry } from '@/types/dungeonLoot';

function payloadFromEntry(entry: DungeonLootEntry): LootModalPayload {
  if (entry.kind === 'gold') return { type: 'gold', entry };
  if (entry.kind === 'empty') return { type: 'empty', entry };
  return { type: 'item', entry };
}

function grantPrize(
  prize: FightLootPrize,
  grantInventoryItem: (id: string) => void,
  addGold: (n: number) => void,
) {
  if (prize.kind === 'gold') addGold(prize.amount);
  if (prize.kind === 'item') grantInventoryItem(prize.item.id);
  if (prize.kind === 'items') {
    for (const item of prize.items) grantInventoryItem(item.id);
  }
}

export default function GutterjackLocation() {
  const insets = useSafeAreaInsets();
  const openHub = useWorldStore((s) => s.openHub);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.gutterjackCleared);

  const playerLevel = useHeroStore((s) => s.playerLevel);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);
  const ownedItemIds = useHeroStore((s) => s.ownedItemIds);
  const consumeOwnedItem = useHeroStore((s) => s.consumeOwnedItem);
  const grantInventoryItem = useHeroStore((s) => s.grantInventoryItem);
  const addGold = useHeroStore((s) => s.addGold);
  const recordBossWin = useHeroStore((s) => s.recordBossWin);

  const [phase, setPhase] = useState<FightPhase>('approach');
  const [resolution, setResolution] = useState<FightResolution | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [inspect, setInspect] = useState<LootModalPayload | null>(null);

  const isFirstClear = !alreadyCleared;
  const hasWine = wineInPack(ownedItemIds);
  const willSipWine = hasWine && !isFirstClear;

  const breakdown: WinChanceBreakdown = useMemo(
    () =>
      computeGutterjackWinChance({
        isFirstClear,
        playerLevel,
        equippedRelicId,
        ownedItemIds,
        willSipWine,
      }),
    [isFirstClear, playerLevel, equippedRelicId, ownedItemIds, willSipWine],
  );

  const chanceColor = winChanceColor(breakdown.displayPct);

  const onBack = useCallback(() => {
    if (phase === 'clash' || phase === 'loot') return;
    impactAsync(ImpactFeedbackStyle.Light);
    openHub();
  }, [openHub, phase]);

  const onFight = useCallback(() => {
    selectionAsync();
    impactAsync(ImpactFeedbackStyle.Medium);
    const sipped = willSipWine ? consumeOwnedItem(GUTTERJACK_WINE_ID) : false;
    const next = resolveFight({
      breakdown,
      isFirstClear,
      sippedWine: sipped,
    });
    if (!next.won) addGold(next.consolationGold);
    setResolution(next);
    setPhase('clash');
  }, [addGold, breakdown, consumeOwnedItem, isFirstClear, willSipWine]);

  const onOpenChest = useCallback(() => {
    if (!resolution?.won) return;
    grantPrize(resolution.loot, grantInventoryItem, addGold);
    recordBossWin();
    if (isFirstClear) markGutterjackCleared();
    setPhase('loot');
  }, [addGold, grantInventoryItem, isFirstClear, markGutterjackCleared, recordBossWin, resolution]);

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
        source={GUTTERJACK_ART.fight}
        intrinsicWidth={GUTTERJACK_ART_INTRINSIC.width}
        intrinsicHeight={GUTTERJACK_ART_INTRINSIC.height}
      />

      {showApproachChrome ? (
        <>
          <OverlayHud
            insets={insets}
            kicker={GUTTERJACK_CHALLENGE.dungeonName}
            title={GUTTERJACK_CHALLENGE.bossName}
            left={{ icon: 'back', onPress: onBack, accessibilityLabel: 'Back' }}
            right={
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
            }
          />

          <View pointerEvents="box-none" style={[styles.sheetWrap, { paddingBottom: 12 + insets.bottom }]}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.94)']} style={styles.fade} />
            <View style={styles.bottom}>
              <FightLootTray table={GUTTERJACK_LOOT_TABLE} onInspect={(entry) => setInspect(payloadFromEntry(entry))} />
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
                  <DoorOpen size={18} color="#1a1228" />
                  <Text style={styles.fightLabel}>Fight</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      <BattleSimulationModal
        visible={phase === 'clash' || phase === 'outcome'}
        dungeonName={GUTTERJACK_CHALLENGE.dungeonName}
        bossName={GUTTERJACK_CHALLENGE.bossName}
        resolution={resolution}
        onOpenChest={onOpenChest}
        onRematch={onRematch}
      />

      <BossVictoryLootModal
        visible={phase === 'loot' && resolution?.won === true}
        bossName={GUTTERJACK_CHALLENGE.bossName}
        dungeonName={GUTTERJACK_CHALLENGE.dungeonName}
        accentColor={GUTTERJACK_CHALLENGE.accentColor}
        lootTable={GUTTERJACK_LOOT_TABLE}
        prize={resolution?.won ? resolution.loot : null}
        onCollect={onCollectLoot}
      />

      <WinChanceBreakdownModal visible={helpOpen} breakdown={breakdown} onClose={() => setHelpOpen(false)} />

      <LootDetailModal
        visible={inspect != null}
        onClose={() => setInspect(null)}
        payload={inspect}
        accentHint={
          inspect?.type === 'item' ? undefined : inspect?.type === 'gold' ? Colors.dark.gold : undefined
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
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    height: 56,
  },
  bottom: {
    paddingHorizontal: 12,
    paddingBottom: 12,
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
  pressed: {
    opacity: 0.8,
  },
});

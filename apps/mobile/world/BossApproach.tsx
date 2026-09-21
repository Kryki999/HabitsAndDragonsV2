import React, { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
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
  computeWinChance,
  resolveFight,
  rollPlaygroundLoot,
  wineInPack,
  GUTTERJACK_WINE_ID,
} from '@/combat/engine';
import { winChanceColor } from '@/combat/winChanceColor';
import type { CombatChallenge, FightLootPrize, FightPhase, FightResolution, WinChanceBreakdown } from '@/combat/types';
import type { DungeonLootEntry } from '@/types/dungeonLoot';

import OverlayHud from './OverlayHud';
import StillFrame, { type CoverAnchor } from './StillFrame';

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
  rollLoot,
  headerExtra,
  whisper,
}: BossApproachProps) {
  const insets = useSafeAreaInsets();

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
        { sipWine },
      ),
    [challenge, equippedRelicId, isFirstClear, ownedItemIds, playerLevel, sipWine, willSipWine],
  );

  const chanceColor = winChanceColor(breakdown.displayPct);
  const lootRoller = rollLoot ?? (sipWine ? undefined : rollPlaygroundLoot);

  const handleBack = useCallback(() => {
    if (phase === 'clash' || phase === 'loot') return;
    impactAsync(ImpactFeedbackStyle.Light);
    onBack();
  }, [onBack, phase]);

  const onFight = useCallback(() => {
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

  const onOpenChest = useCallback(() => {
    if (!resolution?.won) return;
    grantPrize(resolution.loot, grantInventoryItem, addGold);
    recordBossWin();
    if (isFirstClear) onCleared();
    setPhase('loot');
  }, [addGold, grantInventoryItem, isFirstClear, onCleared, recordBossWin, resolution]);

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
        <View pointerEvents="none" style={[styles.whisperWrap, { top: Math.max(insets.top, 10) + 132 }]}>
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

import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import WinChanceBreakdownModal from '@/combat/WinChanceBreakdownModal';
import {
  computeWinChance,
  resolveFight,
  rollPlaygroundLoot,
  rollWeightedLoot,
  wineInPack,
  GUTTERJACK_WINE_ID,
} from '@/combat/engine';
import type { CombatChallenge, FightLootPrize, FightPhase, FightResolution, WinChanceBreakdown } from '@/combat/types';
import type { DungeonLootEntry } from '@/types/dungeonLoot';
import { EncounterCard } from '@/ui/EncounterCard';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

import StillFrame, { type CoverAnchor } from './StillFrame';
import { useWorldStore } from './store';
import { WorldNotice } from './WorldNotice';

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
  sceneKicker?: string;
  sceneName?: string;
  levelNav?: ReactNode;
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
  sceneKicker,
  sceneName,
  levelNav,
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
  const fightSticker: StickerName = !entry.ok || entry.cost === 'key' ? 'key' : 'swords';

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
          <ScrimTop />
          <SeamDock fade={60} />
          <SceneHead
            kicker={sceneKicker ?? challenge.dungeonName}
            name={sceneName ?? challenge.bossName}
            onBack={handleBack}
          />
          {levelNav ? (
            <View pointerEvents="box-none" style={[styles.nav, { top: insets.top + 8 }]}>
              {levelNav}
            </View>
          ) : null}
          <EncounterCard
            name={challenge.bossName}
            winPct={breakdown.displayPct}
            onWinPress={() => {
              impactAsync(ImpactFeedbackStyle.Light);
              setHelpOpen(true);
            }}
            entryHint={entryHint}
            loot={lootTable}
            onInspect={(entry) => setInspect(payloadFromEntry(entry))}
            fightLabel={fightLabel}
            fightSticker={fightSticker}
            onFight={onFight}
          />
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

      {whisper ? <WorldNotice message={whisper} top={insets.top + 72} /> : null}

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
    backgroundColor: tokens.canvas,
  },
  nav: {
    position: 'absolute',
    right: tokens.screenX,
    zIndex: 30,
  },
});

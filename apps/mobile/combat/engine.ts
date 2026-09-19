import {
  GUTTERJACK_CHALLENGE,
  GUTTERJACK_EMPTY,
  GUTTERJACK_FARM_WEIGHTS,
  GUTTERJACK_GOLD,
  GUTTERJACK_ITEMS,
  GUTTERJACK_TULIP_ID,
  GUTTERJACK_WINE_ID,
  GUTTER_CORK_ID,
} from '@/world/content';
import type { LootItemEntry } from '@/types/dungeonLoot';

import type { FightLootPrize, FightResolution, WinChanceBreakdown, WinChanceLine } from './types';

/** V1 `BATTLE_SIMULATION_MS` — sword clash hold. */
export const BATTLE_CLASH_MS = 2800;

const CHANCE_FLOOR = 0.05;
const CHANCE_CEIL = 0.95;
const LEVEL_STEP = 0.02;
const TULIP_FIRST_CLEAR_CHANCE = 0.05;

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function itemById(id: string): LootItemEntry | null {
  return GUTTERJACK_ITEMS.find((i) => i.id === id) ?? null;
}

function equippedCommonBonus(equippedRelicId: string | null): { bonus: number; name: string | null } {
  if (!equippedRelicId) return { bonus: 0, name: null };
  const item = itemById(equippedRelicId);
  if (!item || item.consumable) return { bonus: 0, name: null };
  const vsCommon = item.synergyTier === 'common';
  const vsBoss = item.synergyBossId === GUTTERJACK_CHALLENGE.bossId;
  if (!vsCommon && !vsBoss) return { bonus: 0, name: null };
  return { bonus: item.synergyWinChanceBonus ?? 0, name: item.name };
}

export function wineInPack(ownedItemIds: readonly string[]): boolean {
  return ownedItemIds.includes(GUTTERJACK_WINE_ID);
}

export type WinChanceInput = {
  isFirstClear: boolean;
  playerLevel: number;
  equippedRelicId: string | null;
  ownedItemIds: readonly string[];
  /** When true, Fight will sip a wine if one is in the pack (skipped on 100% tutorial). */
  willSipWine: boolean;
};

/**
 * V2 Bible combat (Act 1): level Δ + equipped affixes + one pot.
 * No hex, no class, no dragons. First Gutterjack = 100% tutorial lock.
 */
export function computeGutterjackWinChance(input: WinChanceInput): WinChanceBreakdown {
  const c = GUTTERJACK_CHALLENGE;
  const levelDelta = input.playerLevel - c.bossLevel;
  const levelBonus = levelDelta * LEVEL_STEP;
  const gear = equippedCommonBonus(input.equippedRelicId);
  const hasWine = wineInPack(input.ownedItemIds);
  const potionBonus = input.willSipWine && hasWine ? 0.05 : 0;

  const raw = c.baseWinChance + levelBonus + gear.bonus + potionBonus;
  const farm = clamp01(Math.min(CHANCE_CEIL, Math.max(CHANCE_FLOOR, raw)));
  const tutorialLock = input.isFirstClear;
  const chance = tutorialLock ? 1 : farm;

  const pct = (x: number) => `${x >= 0 ? '+' : ''}${Math.round(x * 100)}%`;

  const lines: WinChanceLine[] = [
    { label: 'Base chance', pct: Math.round(c.baseWinChance * 100) },
    {
      label: `Level difference (${levelDelta >= 0 ? '+' : ''}${levelDelta})`,
      pct: Math.round(levelBonus * 100),
    },
    {
      label: gear.bonus > 0 ? `${gear.name} (equipped)` : 'Gear affix',
      detail: gear.bonus > 0 ? '+10% vs Common' : 'None equipped',
      pct: Math.round(gear.bonus * 100),
    },
    {
      label: potionBonus > 0 ? "Gutterjack's Wine (sip)" : "Gutterjack's Wine",
      detail: potionBonus > 0 ? 'Sipped on Fight' : hasWine ? 'In pack — Fight sips it' : 'Not in pack',
      pct: Math.round(potionBonus * 100),
    },
  ];

  if (tutorialLock) {
    lines.push({
      label: 'Tutorial lock',
      detail: 'First Gutterjack always falls',
      pct: 100,
    });
  } else if (Math.abs(raw - farm) > 1e-6) {
    lines.push({
      label: 'Clamped',
      detail: `${Math.round(raw * 100)}% → ${Math.round(farm * 100)}%`,
      pct: Math.round(farm * 100),
    });
  }

  const howToImprove: string[] = [];
  if (gear.bonus <= 0) {
    howToImprove.push("Equip Gutterjack's Tulip — +10% vs Common.");
  }
  if (!hasWine) {
    howToImprove.push("Keep Gutterjack's Wine in your pack — Fight sips it for +5%.");
  } else if (!input.willSipWine) {
    howToImprove.push("Wine stays for later — this tutorial fight is already 100%.");
  }
  if (levelDelta < 3) {
    howToImprove.push('Raise hero level — +2% win per level over the boss.');
  }
  if (howToImprove.length === 0) {
    howToImprove.push('This cellar is as stacked as it gets. Farm for the Tulip flex, or move on.');
  }

  return {
    chance,
    displayPct: Math.round(chance * 100),
    tutorialLock,
    lines,
    howToImprove,
  };
}

function pickFarmRow(): string {
  const total = GUTTERJACK_FARM_WEIGHTS.reduce((s, r) => s + r.weight, 0);
  let u = Math.random() * total;
  for (const row of GUTTERJACK_FARM_WEIGHTS) {
    if (u < row.weight) return row.id;
    u -= row.weight;
  }
  return GUTTERJACK_EMPTY.id;
}

function prizeFromRow(id: string): FightLootPrize {
  if (id === GUTTERJACK_EMPTY.id) {
    return { kind: 'empty', entry: GUTTERJACK_EMPTY };
  }
  if (id === GUTTERJACK_GOLD.id) {
    return {
      kind: 'gold',
      amount: randomInt(GUTTERJACK_GOLD.goldMin, GUTTERJACK_GOLD.goldMax),
      entry: GUTTERJACK_GOLD,
    };
  }
  const item = itemById(id);
  if (!item) return { kind: 'empty', entry: GUTTERJACK_EMPTY };
  return { kind: 'item', item };
}

/** First clear: guaranteed Cork + separate 5% Tulip. Farm: weighted table (empty OK). */
export function rollGutterjackLoot(isFirstClear: boolean): FightLootPrize {
  if (isFirstClear) {
    const cork = itemById(GUTTER_CORK_ID)!;
    const extraTulip = Math.random() < TULIP_FIRST_CLEAR_CHANCE;
    if (extraTulip) {
      const tulip = itemById(GUTTERJACK_TULIP_ID)!;
      return { kind: 'items', items: [cork, tulip], headline: tulip };
    }
    return { kind: 'item', item: cork };
  }
  return prizeFromRow(pickFarmRow());
}

export function headlineLootId(prize: FightLootPrize): string {
  if (prize.kind === 'empty') return prize.entry.id;
  if (prize.kind === 'gold') return prize.entry.id;
  if (prize.kind === 'item') return prize.item.id;
  return prize.headline.id;
}

export function resolveFight(opts: {
  breakdown: WinChanceBreakdown;
  isFirstClear: boolean;
  sippedWine: boolean;
}): FightResolution {
  const won = opts.breakdown.tutorialLock || Math.random() < opts.breakdown.chance;
  if (won) {
    return {
      won: true,
      chance: opts.breakdown.chance,
      loot: rollGutterjackLoot(opts.isFirstClear),
      sippedWine: opts.sippedWine,
    };
  }
  const [lo, hi] = GUTTERJACK_CHALLENGE.failureConsolationGoldRange;
  return {
    won: false,
    chance: opts.breakdown.chance,
    consolationGold: randomInt(lo, hi),
    sippedWine: opts.sippedWine,
  };
}

export { GUTTERJACK_WINE_ID };

import type { ImageSourcePropType } from 'react-native';

import type {
  CombatSynergyTier,
  DungeonLootEntry,
  LootEmptyEntry,
  LootGoldEntry,
  LootItemEntry,
} from '@/types/dungeonLoot';

/**
 * Act 1 world content. Gutterjack drop table LOCK: docs/23 §B2c.
 * Map stills / bosses: `locations.ts` (existing assets only).
 */

export const GUTTERJACK_BOSS_ID = 'gutterjack' as const;
export const GUTTERJACK_TIER: CombatSynergyTier = 'common';

export const GUTTER_CORK_ID = 'gutter_cork';
export const GUTTERJACK_WINE_ID = 'gutterjack_wine';
export const GUTTERJACK_TULIP_ID = 'gutterjack_tulip';
export const GUTTERJACK_GOLD_ID = 'gutterjack_gold';
export const GUTTERJACK_EMPTY_ID = 'gutterjack_empty';

export const GUTTERJACK_ART = {
  fight: require('@/assets/images/mietek.png') as ImageSourcePropType,
};

export const GUTTERJACK_ART_INTRINSIC = { width: 941, height: 1672 } as const;

export const GUTTERJACK_ITEMS: LootItemEntry[] = [
  {
    id: GUTTER_CORK_ID,
    kind: 'item',
    name: 'Gutter Cork',
    rarity: 'common',
    description:
      'A wine cork on a greasy string. Smells like the undercroft. Looks like a necklace if you squint.',
    icon: 'orb',
    itemSlot: 'relic',
  },
  {
    id: GUTTERJACK_WINE_ID,
    kind: 'item',
    name: "Gutterjack's Wine",
    rarity: 'common',
    description:
      'Cheap, sour, and somehow still corked. One gulp before a fight. You will regret the taste, not the courage.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.05,
    combatHint: '+5% win · 1 fight',
  },
  {
    id: GUTTERJACK_TULIP_ID,
    kind: 'item',
    name: "Gutterjack's Tulip",
    rarity: 'rare',
    description:
      'In Crownhaven alley slang, a smashed bottle is a “tulip.” Gutterjack’s favorite. Still sharp. Still lucky — if you’re the one holding it.',
    icon: 'sword',
    itemSlot: 'relic',
    synergyBossId: GUTTERJACK_BOSS_ID,
    synergyTier: 'common',
    synergyWinChanceBonus: 0.1,
    combatHint: '+10% win vs Common',
  },
];

export const GUTTERJACK_GOLD: LootGoldEntry = {
  id: GUTTERJACK_GOLD_ID,
  kind: 'gold',
  name: 'Sticky coins',
  rarity: 'common',
  description: 'Coins sticky with something you refuse to identify.',
  goldMin: 20,
  goldMax: 40,
};

export const GUTTERJACK_EMPTY: LootEmptyEntry = {
  id: GUTTERJACK_EMPTY_ID,
  kind: 'empty',
  name: 'Nothing',
  rarity: 'common',
  description: 'The pockets were already empty. Farm wins can roll blank.',
};

/** Approach tray — 5 rarity squares (4–6 lock). */
export const GUTTERJACK_LOOT_TABLE: DungeonLootEntry[] = [
  GUTTERJACK_EMPTY,
  GUTTERJACK_GOLD,
  GUTTERJACK_ITEMS.find((i) => i.id === GUTTER_CORK_ID)!,
  GUTTERJACK_ITEMS.find((i) => i.id === GUTTERJACK_WINE_ID)!,
  GUTTERJACK_ITEMS.find((i) => i.id === GUTTERJACK_TULIP_ID)!,
];

/** Farm weights after first clear. Sum = 100. */
export const GUTTERJACK_FARM_WEIGHTS: { id: string; weight: number }[] = [
  { id: GUTTERJACK_EMPTY_ID, weight: 25 },
  { id: GUTTERJACK_GOLD_ID, weight: 30 },
  { id: GUTTER_CORK_ID, weight: 20 },
  { id: GUTTERJACK_WINE_ID, weight: 20 },
  { id: GUTTERJACK_TULIP_ID, weight: 5 },
];

export const GUTTERJACK_CHALLENGE = {
  id: GUTTERJACK_BOSS_ID,
  dungeonName: 'Tavern cellar',
  bossId: GUTTERJACK_BOSS_ID,
  bossName: 'Gutterjack',
  accentColor: '#c4a35a',
  tier: GUTTERJACK_TIER,
  bossLevel: 1,
  /** Farm baseline at even level. First clear is a separate 100% lock. */
  baseWinChance: 0.72,
  failureConsolationGoldRange: [8, 16] as [number, number],
} as const;

/** Shared playground tray for map bosses — unique drop tables are a later PR. */
export const PLAYGROUND_GOLD_ID = 'playground_gold';
export const PLAYGROUND_EMPTY_ID = 'playground_empty';

export const PLAYGROUND_GOLD: LootGoldEntry = {
  id: PLAYGROUND_GOLD_ID,
  kind: 'gold',
  name: 'Pocket coins',
  rarity: 'common',
  description: 'A handful of coins from the road. Placeholder loot until this dungeon has a table.',
  goldMin: 18,
  goldMax: 32,
};

export const PLAYGROUND_EMPTY: LootEmptyEntry = {
  id: PLAYGROUND_EMPTY_ID,
  kind: 'empty',
  name: 'Nothing',
  rarity: 'common',
  description: 'The pockets were already empty. Farm wins can roll blank.',
};

export const PLAYGROUND_LOOT_TABLE: DungeonLootEntry[] = [PLAYGROUND_EMPTY, PLAYGROUND_GOLD];

export const PLAYGROUND_FARM_WEIGHTS: { id: string; weight: number }[] = [
  { id: PLAYGROUND_EMPTY_ID, weight: 40 },
  { id: PLAYGROUND_GOLD_ID, weight: 60 },
];

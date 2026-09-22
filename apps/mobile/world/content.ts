import type { ImageSourcePropType } from 'react-native';

import type { CombatChallenge } from '@/combat/types';
import type {
  CombatSynergyTier,
  DungeonLootEntry,
  LootEmptyEntry,
  LootGoldEntry,
  LootItemEntry,
} from '@/types/dungeonLoot';

import type { CoverAnchor } from './StillFrame';
import type { InteriorFloorDef } from './interiors';
import { WORLD_ART } from './layout';
import type { MapLocationId } from './types';

/**
 * Act 1 world content — single catalog for ids, floors, art, loot, unlocks.
 *
 * Sources: docs/23, docs/21, docs/25. Existing repo art only.
 * Gutterjack drop table LOCK: docs/23 §B2c.
 *
 * Hub: Crownhaven stall / tavern / palace.
 * R1: Approaches · Teeth · Anvil Glade.
 * Main: Closed Way ★1 · Raven Castle ★2 · Pyramid ★3 · Ananiel Titan.
 * R2: Pallglass (ally) · Tideglass Isle (seed) · Vampire House (seed).
 */

export const LOCATION_STILL_INTRINSIC = { width: 941, height: 1672 } as const;

export const SKARNE_ENCOUNTER_ID = 'skarne';

/* -------------------------------------------------------------------------- */
/*  Shared loot helpers                                                        */
/* -------------------------------------------------------------------------- */

function emptyLoot(id: string, description: string): LootEmptyEntry {
  return { id, kind: 'empty', name: 'Nothing', rarity: 'common', description };
}

function goldLoot(
  id: string,
  name: string,
  description: string,
  goldMin: number,
  goldMax: number,
): LootGoldEntry {
  return { id, kind: 'gold', name, rarity: 'common', description, goldMin, goldMax };
}

/* -------------------------------------------------------------------------- */
/*  Gutterjack (tavern cellar) — LOCK docs/23 §B2c                             */
/* -------------------------------------------------------------------------- */

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

export const GUTTERJACK_ART_INTRINSIC = LOCATION_STILL_INTRINSIC;

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

export const GUTTERJACK_GOLD: LootGoldEntry = goldLoot(
  GUTTERJACK_GOLD_ID,
  'Sticky coins',
  'Coins sticky with something you refuse to identify.',
  20,
  40,
);

export const GUTTERJACK_EMPTY: LootEmptyEntry = emptyLoot(
  GUTTERJACK_EMPTY_ID,
  'The pockets were already empty. Farm wins can roll blank.',
);

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

/** Shared tray for seed dungeons without a Bible drop table yet. */
export const PLAYGROUND_GOLD_ID = 'playground_gold';
export const PLAYGROUND_EMPTY_ID = 'playground_empty';

export const PLAYGROUND_GOLD: LootGoldEntry = goldLoot(
  PLAYGROUND_GOLD_ID,
  'Pocket coins',
  'A handful of coins from the road. Placeholder loot until this dungeon has a table.',
  18,
  32,
);

export const PLAYGROUND_EMPTY: LootEmptyEntry = emptyLoot(
  PLAYGROUND_EMPTY_ID,
  'The pockets were already empty. Farm wins can roll blank.',
);

export const PLAYGROUND_LOOT_TABLE: DungeonLootEntry[] = [PLAYGROUND_EMPTY, PLAYGROUND_GOLD];

export const PLAYGROUND_FARM_WEIGHTS: { id: string; weight: number }[] = [
  { id: PLAYGROUND_EMPTY_ID, weight: 40 },
  { id: PLAYGROUND_GOLD_ID, weight: 60 },
];

/* -------------------------------------------------------------------------- */
/*  Bible loot — Teeth, Approaches, Anvil, Closed Way                          */
/* -------------------------------------------------------------------------- */

const TEETH_COMMON_ITEMS: LootItemEntry[] = [
  {
    id: 'saltbone_hook_charm',
    kind: 'item',
    name: 'Saltbone Hook Charm',
    rarity: 'common',
    description: 'Too small to climb a cliff. Perfect for looking dangerous.',
    icon: 'anchor',
    itemSlot: 'relic',
  },
  {
    id: 'blackpowder_pinch',
    kind: 'item',
    name: 'Blackpowder Pinch',
    rarity: 'common',
    description: 'Loud courage. Short fuse.',
    icon: 'flame',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.05,
    combatHint: '+5% win · 1 fight',
  },
];

const TEETH_COMMON_GOLD = goldLoot(
  'teeth_common_gold',
  'Tide coins',
  'Coins that still smell like the tide.',
  25,
  50,
);
const TEETH_COMMON_EMPTY = emptyLoot('teeth_common_empty', 'The crew already split this pile.');

const TEETH_ELITE_ITEMS: LootItemEntry[] = [
  {
    id: 'marrow_doubloon',
    kind: 'item',
    name: "Marrow's Doubloon",
    rarity: 'common',
    description: 'He paid crews with these. They never stayed paid.',
    icon: 'coins',
    itemSlot: 'relic',
  },
  {
    id: 'captains_grogg',
    kind: 'item',
    name: "Captain's Grogg",
    rarity: 'common',
    description: "Stronger than Gutterjack's. Still a bad idea.",
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.08,
    combatHint: '+8% win · 1 fight',
  },
  {
    id: 'corsair_eyepatch',
    kind: 'item',
    name: "Corsair's Eyepatch",
    rarity: 'rare',
    description: 'You see less. You swagger more.',
    icon: 'moon',
    itemSlot: 'relic',
    combatHint: 'Unikat — gold/Common affix later',
  },
  {
    id: 'necklace_still_tide',
    kind: 'item',
    name: 'Necklace of the Still Tide',
    rarity: 'epic',
    description:
      'Crownhaven hung him. The fog sailed him home. Now the tide answers you — once.',
    icon: 'gem',
    itemSlot: 'relic',
    combatHint: 'Heroic — Second Tide (later)',
  },
];

const TEETH_ELITE_GOLD = goldLoot(
  'teeth_elite_gold',
  'Chest coins',
  'Heavy. Wet. Worth it.',
  40,
  80,
);
const TEETH_ELITE_EMPTY = emptyLoot('teeth_elite_empty', 'The tide already took this share.');

const APPROACHES_COMMON_ITEMS: LootItemEntry[] = [
  {
    id: 'forged_pass',
    kind: 'item',
    name: 'Forged Pass',
    rarity: 'common',
    description: 'A warrant that was never written. Still looks official if you do not squint.',
    icon: 'scroll',
    itemSlot: 'relic',
  },
  {
    id: 'quiet_flask',
    kind: 'item',
    name: 'Quiet Flask',
    rarity: 'common',
    description: 'Whatever is in it, the camp laughs louder after a sip.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.08,
    combatHint: '+8% win · 1 fight',
  },
];

const APPROACHES_COMMON_GOLD = goldLoot(
  'approaches_common_gold',
  'Road coins',
  'Lifted under the walls. Nobody wrote it down.',
  22,
  44,
);
const APPROACHES_COMMON_EMPTY = emptyLoot(
  'approaches_common_empty',
  'They already drank this share.',
);

const APPROACHES_ELITE_ITEMS: LootItemEntry[] = [
  {
    id: 'clerks_broken_seal',
    kind: 'item',
    name: "Clerk's Broken Seal",
    rarity: 'rare',
    description: 'The stamp cracked. The books still pretend not to see you.',
    icon: 'sparkles',
    itemSlot: 'relic',
    combatHint: 'Unikat — gold/stall affix later',
  },
  {
    id: 'blank_warrant',
    kind: 'item',
    name: 'The Blank Warrant',
    rarity: 'epic',
    description: 'A page with no name. In Crownhaven, that is a weapon.',
    icon: 'scroll',
    itemSlot: 'relic',
    combatHint: 'Heroic — key skip (later)',
  },
];

const APPROACHES_ELITE_GOLD = goldLoot(
  'approaches_elite_gold',
  'Camp coins',
  'Split after the hooting. Heavy enough to matter.',
  36,
  70,
);
const APPROACHES_ELITE_EMPTY = emptyLoot(
  'approaches_elite_empty',
  'Rook already pocketed the interesting bits.',
);

const ANVIL_ITEMS: LootItemEntry[] = [
  {
    id: 'bent_nail_charm',
    kind: 'item',
    name: 'Bent Nail Charm',
    rarity: 'common',
    description: 'Almost a masterpiece. Almost.',
    icon: 'sword',
    itemSlot: 'relic',
  },
  {
    id: 'cooling_slag',
    kind: 'item',
    name: 'Cooling Slag',
    rarity: 'common',
    description: 'Forge heat that never became a blade.',
    icon: 'flame',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.05,
    combatHint: '+5% win · 1 fight',
  },
  {
    id: 'star_wait_ring',
    kind: 'item',
    name: 'Star-Wait Ring',
    rarity: 'rare',
    description: 'He wore it while counting constellations.',
    icon: 'star',
    itemSlot: 'relic',
    combatHint: 'Unikat — QoL affix later',
  },
];

const ANVIL_GOLD = goldLoot(
  'anvil_gold',
  'Unfinished pay',
  "Paid for work that wasn't finished.",
  25,
  50,
);
const ANVIL_EMPTY = emptyLoot('anvil_empty', 'Even the discards were already picked over.');

const CLOSED_WAY_ITEMS: LootItemEntry[] = [
  {
    id: 'trail_trophy',
    kind: 'item',
    name: 'Trail Trophy',
    rarity: 'common',
    description: 'A tooth, a claw, a scrap of green cord. Proof you were on the path.',
    icon: 'skull',
    itemSlot: 'relic',
  },
  {
    id: 'greenway_draught',
    kind: 'item',
    name: 'Greenway Draught',
    rarity: 'common',
    description: 'Bitter sap. The forest does not offer it kindly.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    synergyWinChanceBonus: 0.05,
    combatHint: '+5% win · 1 fight',
  },
  {
    id: 'hunters_snare_charm',
    kind: 'item',
    name: "Hunter's Snare Charm",
    rarity: 'rare',
    description: 'A loop of living vine. It remembers who walked into it.',
    icon: 'orb',
    itemSlot: 'relic',
    combatHint: 'Unikat — forest / cleared affix later',
  },
  {
    id: 'horn_of_the_closed_way',
    kind: 'item',
    name: 'Horn of the Closed Way',
    rarity: 'epic',
    description: 'He used it to call the lost. Now it answers you — sometimes.',
    icon: 'crown',
    itemSlot: 'relic',
    combatHint: 'Heroic — Main QoL later',
  },
];

const CLOSED_WAY_ELITE_GOLD = goldLoot(
  'closed_way_elite_gold',
  'Pack spoils',
  'What the thornpack did not swallow.',
  32,
  60,
);
const CLOSED_WAY_ELITE_EMPTY = emptyLoot('closed_way_elite_empty', 'The trees already took a share.');
const CLOSED_WAY_CHAMP_GOLD = goldLoot(
  'closed_way_champ_gold',
  'Guide coins',
  'Payment for a path that was never meant to end.',
  44,
  80,
);
const CLOSED_WAY_CHAMP_EMPTY = emptyLoot(
  'closed_way_champ_empty',
  'The guide travels light. Most pockets were a lure.',
);

export const WORLD_LOOT_ITEMS: LootItemEntry[] = [
  ...GUTTERJACK_ITEMS,
  ...TEETH_COMMON_ITEMS,
  ...TEETH_ELITE_ITEMS,
  ...APPROACHES_COMMON_ITEMS,
  ...APPROACHES_ELITE_ITEMS,
  ...ANVIL_ITEMS,
  ...CLOSED_WAY_ITEMS,
];

const ALL_GOLD: LootGoldEntry[] = [
  GUTTERJACK_GOLD,
  PLAYGROUND_GOLD,
  TEETH_COMMON_GOLD,
  TEETH_ELITE_GOLD,
  APPROACHES_COMMON_GOLD,
  APPROACHES_ELITE_GOLD,
  ANVIL_GOLD,
  CLOSED_WAY_ELITE_GOLD,
  CLOSED_WAY_CHAMP_GOLD,
];

const ALL_EMPTY: LootEmptyEntry[] = [
  GUTTERJACK_EMPTY,
  PLAYGROUND_EMPTY,
  TEETH_COMMON_EMPTY,
  TEETH_ELITE_EMPTY,
  APPROACHES_COMMON_EMPTY,
  APPROACHES_ELITE_EMPTY,
  ANVIL_EMPTY,
  CLOSED_WAY_ELITE_EMPTY,
  CLOSED_WAY_CHAMP_EMPTY,
];

export function lootItemById(id: string): LootItemEntry | null {
  return WORLD_LOOT_ITEMS.find((item) => item.id === id) ?? null;
}

export function lootGoldById(id: string): LootGoldEntry | null {
  return ALL_GOLD.find((entry) => entry.id === id) ?? null;
}

export function lootEmptyById(id: string): LootEmptyEntry | null {
  return ALL_EMPTY.find((entry) => entry.id === id) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  NPCs                                                                       */
/* -------------------------------------------------------------------------- */

export type NpcDef = {
  id: string;
  name: string;
  still: ImageSourcePropType;
  flavor: string;
  stillAnchor?: CoverAnchor;
};

export const NPCS: Record<string, NpcDef> = {
  vendor: {
    id: 'vendor',
    name: 'Stall keeper',
    still: WORLD_ART.hub,
    stillAnchor: 'bottom',
    flavor:
      'Vegetables, gossip, and a barn loft if you need a roof. Shop inventory stitches later — she is still the first person who asked who you are.',
  },
  advisor: {
    id: 'advisor',
    name: 'Royal advisor',
    still: WORLD_ART.hub,
    stillAnchor: 'top',
    flavor:
      'The palace noticed the Closed Way. A cottage is waiting — house upgrades stitch later. He remembers who you were in the square.',
  },
  pell: {
    id: 'pell',
    name: 'Sergeant Pell',
    still: require('@/assets/images/przedmiescia.png') as ImageSourcePropType,
    flavor:
      'He took the watch “for a while.” The Inkless drink in the trees. He knows. He does not go.',
  },
  torrik: {
    id: 'torrik',
    name: 'Torrik',
    still: require('@/assets/images/krasnolud.png') as ImageSourcePropType,
    flavor:
      'The masterpiece waits for a perfect sky. Rejected blades feed something that stares. He does not walk the Closed Way.',
  },
  miro: {
    id: 'miro',
    name: 'Miro',
    still: require('@/assets/images/mage.png') as ImageSourcePropType,
    flavor: 'The glass turns. Miro does not fight — he watches, and sometimes he helps.',
  },
};

/* -------------------------------------------------------------------------- */
/*  Dungeons (floors + fights)                                                 */
/* -------------------------------------------------------------------------- */

export type FightEncounterDef = {
  id: string;
  name: string;
  dungeonName: string;
  still: ImageSourcePropType;
  accentColor: string;
  tier: CombatSynergyTier;
  bossLevel: number;
  baseWinChance: number;
  failureConsolationGoldRange: readonly [number, number];
};

export type DungeonFloorDef = {
  id: string;
  label: string;
  cdHint: string;
  unlockAfterEncounterId?: string;
  lockedHint?: string;
  encounter: FightEncounterDef;
  lootTable: readonly DungeonLootEntry[];
  farmWeights?: readonly { id: string; weight: number }[];
};

export type DungeonDef = {
  id: string;
  name: string;
  defaultFloorId: string;
  source: string;
  floors: DungeonFloorDef[];
};

function fight(
  partial: FightEncounterDef['id'] extends never ? never : FightEncounterDef,
): FightEncounterDef {
  return partial;
}

export const DUNGEONS: Record<string, DungeonDef> = {
  'saltbone-den': {
    id: 'saltbone-den',
    name: 'Saltbone den',
    defaultFloorId: 'common',
    source: 'docs/23 §D1',
    floors: [
      {
        id: 'common',
        label: 'Common',
        cdHint: 'Common · free CD',
        encounter: fight({
          id: 'saltbone-crew',
          name: 'Saltbone Crew',
          dungeonName: 'Saltbone den',
          still: require('@/assets/images/pirates.png') as ImageSourcePropType,
          accentColor: '#6ec8c4',
          tier: 'common',
          bossLevel: 4,
          baseWinChance: 0.68,
          failureConsolationGoldRange: [10, 20],
        }),
        lootTable: [...TEETH_COMMON_ITEMS, TEETH_COMMON_GOLD, TEETH_COMMON_EMPTY],
        farmWeights: [
          { id: TEETH_COMMON_EMPTY.id, weight: 30 },
          { id: TEETH_COMMON_GOLD.id, weight: 40 },
          { id: 'saltbone_hook_charm', weight: 18 },
          { id: 'blackpowder_pinch', weight: 12 },
        ],
      },
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        unlockAfterEncounterId: 'saltbone-crew',
        lockedHint: 'Clear the crew first.',
        encounter: fight({
          id: 'marrow',
          name: 'Captain Marrow',
          dungeonName: 'Saltbone den',
          still: require('@/assets/images/marrow.png') as ImageSourcePropType,
          accentColor: '#6ec8c4',
          tier: 'elite',
          bossLevel: 6,
          baseWinChance: 0.52,
          failureConsolationGoldRange: [14, 26],
        }),
        lootTable: [...TEETH_ELITE_ITEMS, TEETH_ELITE_GOLD, TEETH_ELITE_EMPTY],
        farmWeights: [
          { id: TEETH_ELITE_EMPTY.id, weight: 23 },
          { id: TEETH_ELITE_GOLD.id, weight: 30 },
          { id: 'marrow_doubloon', weight: 19 },
          { id: 'captains_grogg', weight: 19 },
          { id: 'corsair_eyepatch', weight: 7 },
          { id: 'necklace_still_tide', weight: 2 },
        ],
      },
    ],
  },
  'inkless-camp': {
    id: 'inkless-camp',
    name: 'Inkless camp',
    defaultFloorId: 'common',
    source: 'docs/23 §D2',
    floors: [
      {
        id: 'common',
        label: 'Common',
        cdHint: 'Common · free CD',
        encounter: fight({
          id: 'inkless-hands',
          name: 'Inkless Hands',
          dungeonName: 'Inkless camp',
          still: require('@/assets/images/rozbojnicy.png') as ImageSourcePropType,
          accentColor: '#c4a35a',
          tier: 'common',
          bossLevel: 3,
          baseWinChance: 0.72,
          failureConsolationGoldRange: [10, 18],
        }),
        lootTable: [...APPROACHES_COMMON_ITEMS, APPROACHES_COMMON_GOLD, APPROACHES_COMMON_EMPTY],
        farmWeights: [
          { id: APPROACHES_COMMON_EMPTY.id, weight: 30 },
          { id: APPROACHES_COMMON_GOLD.id, weight: 40 },
          { id: 'forged_pass', weight: 18 },
          { id: 'quiet_flask', weight: 12 },
        ],
      },
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        unlockAfterEncounterId: 'inkless-hands',
        lockedHint: 'Clear the camp first.',
        encounter: fight({
          id: 'rook',
          name: 'Boss Rook',
          dungeonName: 'Inkless camp',
          still: require('@/assets/images/herszt.png') as ImageSourcePropType,
          accentColor: '#c4a35a',
          tier: 'elite',
          bossLevel: 5,
          baseWinChance: 0.58,
          failureConsolationGoldRange: [12, 22],
        }),
        lootTable: [
          ...APPROACHES_ELITE_ITEMS,
          ...APPROACHES_COMMON_ITEMS,
          APPROACHES_ELITE_GOLD,
          APPROACHES_ELITE_EMPTY,
        ],
        farmWeights: [
          { id: APPROACHES_ELITE_EMPTY.id, weight: 23 },
          { id: APPROACHES_ELITE_GOLD.id, weight: 30 },
          { id: 'forged_pass', weight: 19 },
          { id: 'quiet_flask', weight: 19 },
          { id: 'clerks_broken_seal', weight: 7 },
          { id: 'blank_warrant', weight: 2 },
        ],
      },
    ],
  },
  'moss-gate': {
    id: 'moss-gate',
    name: 'Moss gate',
    defaultFloorId: 'common',
    source: 'docs/23 §D3 — Common only',
    floors: [
      {
        id: 'common',
        label: 'Common',
        cdHint: 'Common · free CD',
        encounter: fight({
          id: 'stillgaze',
          name: 'Stillgaze Basilisk',
          dungeonName: 'Moss gate',
          still: require('@/assets/images/bazyliszek.png') as ImageSourcePropType,
          accentColor: '#7bc47a',
          tier: 'common',
          bossLevel: 2,
          baseWinChance: 0.7,
          failureConsolationGoldRange: [8, 16],
        }),
        lootTable: [...ANVIL_ITEMS, ANVIL_GOLD, ANVIL_EMPTY],
        farmWeights: [
          { id: ANVIL_EMPTY.id, weight: 30 },
          { id: ANVIL_GOLD.id, weight: 35 },
          { id: 'bent_nail_charm', weight: 14 },
          { id: 'cooling_slag', weight: 14 },
          { id: 'star_wait_ring', weight: 7 },
        ],
      },
    ],
  },
  'closed-way': {
    id: 'closed-way',
    name: 'Closed Way',
    defaultFloorId: 'elite',
    source: 'docs/23 §D4 — Elite → Champion',
    floors: [
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        encounter: fight({
          id: 'thornpack',
          name: 'Thornpack',
          dungeonName: 'Closed Way',
          still: require('@/assets/images/zakazanylas.png') as ImageSourcePropType,
          accentColor: '#6a9a5a',
          tier: 'elite',
          bossLevel: 6,
          baseWinChance: 0.55,
          failureConsolationGoldRange: [14, 24],
        }),
        lootTable: [
          CLOSED_WAY_ITEMS.find((i) => i.id === 'trail_trophy')!,
          CLOSED_WAY_ITEMS.find((i) => i.id === 'greenway_draught')!,
          CLOSED_WAY_ITEMS.find((i) => i.id === 'hunters_snare_charm')!,
          CLOSED_WAY_ITEMS.find((i) => i.id === 'horn_of_the_closed_way')!,
          CLOSED_WAY_ELITE_GOLD,
          CLOSED_WAY_ELITE_EMPTY,
        ],
        farmWeights: [
          { id: CLOSED_WAY_ELITE_EMPTY.id, weight: 23 },
          { id: CLOSED_WAY_ELITE_GOLD.id, weight: 30 },
          { id: 'trail_trophy', weight: 20 },
          { id: 'greenway_draught', weight: 18 },
          { id: 'hunters_snare_charm', weight: 7 },
          { id: 'horn_of_the_closed_way', weight: 2 },
        ],
      },
      {
        id: 'champion',
        label: 'Champion',
        cdHint: 'Champion · free CD',
        unlockAfterEncounterId: 'thornpack',
        lockedHint: 'Clear the pack first.',
        encounter: fight({
          id: SKARNE_ENCOUNTER_ID,
          name: 'Skarne',
          dungeonName: 'Closed Way',
          still: require('@/assets/images/przewodniklas.png') as ImageSourcePropType,
          accentColor: '#6a9a5a',
          tier: 'champion',
          bossLevel: 7,
          baseWinChance: 0.42,
          failureConsolationGoldRange: [16, 28],
        }),
        lootTable: [...CLOSED_WAY_ITEMS, CLOSED_WAY_CHAMP_GOLD, CLOSED_WAY_CHAMP_EMPTY],
        farmWeights: [
          { id: CLOSED_WAY_CHAMP_EMPTY.id, weight: 20 },
          { id: CLOSED_WAY_CHAMP_GOLD.id, weight: 28 },
          { id: 'trail_trophy', weight: 19 },
          { id: 'greenway_draught', weight: 19 },
          { id: 'hunters_snare_charm', weight: 10 },
          { id: 'horn_of_the_closed_way', weight: 4 },
        ],
      },
    ],
  },
  'raven-nave': {
    id: 'raven-nave',
    name: 'Raven nave',
    defaultFloorId: 'elite',
    source: 'docs/23 §D5 — Elite → Champion (★2 face working)',
    floors: [
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        encounter: fight({
          id: 'wax-acolyte',
          name: 'Wax Acolyte',
          dungeonName: 'Raven nave',
          still: require('@/assets/images/elitamnich.png') as ImageSourcePropType,
          accentColor: '#8b6bb0',
          tier: 'elite',
          bossLevel: 8,
          baseWinChance: 0.5,
          failureConsolationGoldRange: [16, 28],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
      {
        id: 'champion',
        label: 'Champion',
        cdHint: 'Champion · free CD',
        unlockAfterEncounterId: 'wax-acolyte',
        lockedHint: 'Clear the nave first.',
        encounter: fight({
          id: 'wax-abbot',
          name: 'Wax Abbot',
          dungeonName: 'Raven nave',
          still: require('@/assets/images/mnich.png') as ImageSourcePropType,
          accentColor: '#8b6bb0',
          tier: 'champion',
          bossLevel: 9,
          baseWinChance: 0.4,
          failureConsolationGoldRange: [18, 30],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
    ],
  },
  'lake-shrine': {
    id: 'lake-shrine',
    name: 'Lake shrine',
    defaultFloorId: 'elite',
    source: 'docs/23 §D7 seed — 1 floor (TBD Common→Elite)',
    floors: [
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        encounter: fight({
          id: 'tide-spirit',
          name: 'Tide Spirit',
          dungeonName: 'Lake shrine',
          still: require('@/assets/images/waterboss.png') as ImageSourcePropType,
          accentColor: '#4aa3c8',
          tier: 'elite',
          bossLevel: 5,
          baseWinChance: 0.58,
          failureConsolationGoldRange: [12, 22],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
    ],
  },
  'pale-house': {
    id: 'pale-house',
    name: 'Pale house',
    defaultFloorId: 'elite',
    source: 'docs/23 §D7 seed — Elite vampire-cleric',
    floors: [
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        encounter: fight({
          id: 'pale-cleric',
          name: 'Pale Cleric',
          dungeonName: 'Pale house',
          still: require('@/assets/images/vampire.png') as ImageSourcePropType,
          accentColor: '#b05070',
          tier: 'elite',
          bossLevel: 6,
          baseWinChance: 0.52,
          failureConsolationGoldRange: [14, 24],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
    ],
  },
  'sandglass-tomb': {
    id: 'sandglass-tomb',
    name: 'Sandglass tomb',
    defaultFloorId: 'elite',
    source: 'docs/23 §D8 — Elite devotee → Champion Osiris',
    floors: [
      {
        id: 'elite',
        label: 'Elite',
        cdHint: 'Elite · free CD',
        encounter: fight({
          id: 'osiris-devotee',
          name: 'Embalmed Devotee',
          dungeonName: 'Sandglass tomb',
          still: require('@/assets/images/pyramid_elite.png') as ImageSourcePropType,
          accentColor: '#d4a84a',
          tier: 'elite',
          bossLevel: 10,
          baseWinChance: 0.45,
          failureConsolationGoldRange: [20, 32],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
      {
        id: 'champion',
        label: 'Champion',
        cdHint: 'Champion · free CD',
        unlockAfterEncounterId: 'osiris-devotee',
        lockedHint: 'Clear the devotee first.',
        encounter: fight({
          id: 'osiris',
          name: 'Osiris',
          dungeonName: 'Sandglass tomb',
          still: require('@/assets/images/oziris.png') as ImageSourcePropType,
          accentColor: '#d4a84a',
          tier: 'champion',
          bossLevel: 11,
          baseWinChance: 0.35,
          failureConsolationGoldRange: [22, 36],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
    ],
  },
  'dream-siphon': {
    id: 'dream-siphon',
    name: 'Dream-Siphon',
    defaultFloorId: 'titan',
    source: 'docs/23 §D9 — Titan only (no Bible Elite floor)',
    floors: [
      {
        id: 'titan',
        label: 'Titan',
        cdHint: 'Titan · free CD',
        encounter: fight({
          id: 'ananiel',
          name: 'Ananiel',
          dungeonName: 'Dream-Siphon',
          still: require('@/assets/images/ananiel.png') as ImageSourcePropType,
          accentColor: '#9b6cff',
          tier: 'titan',
          bossLevel: 13,
          baseWinChance: 0.28,
          failureConsolationGoldRange: [28, 44],
        }),
        lootTable: PLAYGROUND_LOOT_TABLE,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Map locations (close-up + hotspots)                                        */
/* -------------------------------------------------------------------------- */

export type LocationHotspotDef =
  | {
      id: string;
      x: number;
      y: number;
      label: string;
      hint: string;
      kind: 'npc';
      npcId: string;
    }
  | {
      id: string;
      x: number;
      y: number;
      label: string;
      hint: string;
      kind: 'dungeon';
      dungeonId: string;
    };

export type MapLocationDef = {
  id: MapLocationId;
  name: string;
  kicker: string;
  still: ImageSourcePropType;
  ring: 'r1' | 'r2' | 'main';
  hotspots: LocationHotspotDef[];
};

/** Discover seed order: Approaches first; Teeth/Anvil optional sides; Main ★ separate. */
export const MAP_LOCATION_IDS: readonly MapLocationId[] = [
  'crown-approaches',
  'smugglers-teeth',
  'anvil-glade',
  'closed-way',
  'water-temple',
  'pallglass',
  'raven-castle',
  'vampire-house',
  'pyramid',
  'ananiel',
] as const;

export const MAP_LOCATIONS: Record<MapLocationId, MapLocationDef> = {
  'smugglers-teeth': {
    id: 'smugglers-teeth',
    name: "Smuggler's Teeth",
    kicker: 'Coast',
    still: require('@/assets/images/piraci.png') as ImageSourcePropType,
    ring: 'r1',
    hotspots: [
      { id: 'cave', x: 0.62, y: 0.42, label: 'Cave', hint: 'Saltbone', kind: 'dungeon', dungeonId: 'saltbone-den' },
    ],
  },
  'crown-approaches': {
    id: 'crown-approaches',
    name: 'Crown Approaches',
    kicker: 'South road',
    still: require('@/assets/images/przedmiescia.png') as ImageSourcePropType,
    ring: 'r1',
    hotspots: [
      { id: 'watch', x: 0.22, y: 0.32, label: 'Watch', hint: 'Pell', kind: 'npc', npcId: 'pell' },
      { id: 'camp', x: 0.72, y: 0.48, label: 'Camp', hint: 'Inkless', kind: 'dungeon', dungeonId: 'inkless-camp' },
    ],
  },
  'anvil-glade': {
    id: 'anvil-glade',
    name: 'Anvil Glade',
    kicker: 'Forest',
    still: require('@/assets/images/las.png') as ImageSourcePropType,
    ring: 'r1',
    hotspots: [
      { id: 'house', x: 0.28, y: 0.5, label: 'House', hint: 'Torrik', kind: 'npc', npcId: 'torrik' },
      { id: 'gate', x: 0.7, y: 0.38, label: 'Gate', hint: 'Stillgaze', kind: 'dungeon', dungeonId: 'moss-gate' },
    ],
  },
  'closed-way': {
    id: 'closed-way',
    name: 'The Closed Way',
    kicker: 'Main ★1',
    still: require('@/assets/images/zakazanylas.png') as ImageSourcePropType,
    ring: 'main',
    hotspots: [
      { id: 'seal', x: 0.5, y: 0.48, label: 'Seal', hint: 'Skarne', kind: 'dungeon', dungeonId: 'closed-way' },
    ],
  },
  'raven-castle': {
    id: 'raven-castle',
    name: 'Raven Castle',
    kicker: 'Main ★2',
    still: require('@/assets/images/ravencastle.png') as ImageSourcePropType,
    ring: 'main',
    hotspots: [
      { id: 'doors', x: 0.58, y: 0.48, label: 'Doors', hint: 'Abbot', kind: 'dungeon', dungeonId: 'raven-nave' },
    ],
  },
  pallglass: {
    id: 'pallglass',
    name: 'Pallglass Spire',
    kicker: 'Ally',
    still: require('@/assets/images/palantirtower.png') as ImageSourcePropType,
    ring: 'r2',
    hotspots: [
      { id: 'door', x: 0.48, y: 0.72, label: 'Door', hint: 'Miro', kind: 'npc', npcId: 'miro' },
    ],
  },
  'vampire-house': {
    id: 'vampire-house',
    name: 'Vampire House',
    kicker: 'Side',
    still: require('@/assets/images/wampirhouse.png') as ImageSourcePropType,
    ring: 'r2',
    hotspots: [
      {
        id: 'threshold',
        x: 0.5,
        y: 0.55,
        label: 'Threshold',
        hint: 'Cleric',
        kind: 'dungeon',
        dungeonId: 'pale-house',
      },
    ],
  },
  'water-temple': {
    id: 'water-temple',
    name: 'Tideglass Isle',
    kicker: 'Isle',
    still: require('@/assets/images/watertemple.png') as ImageSourcePropType,
    ring: 'r2',
    hotspots: [
      { id: 'shrine', x: 0.52, y: 0.38, label: 'Shrine', hint: 'Tide', kind: 'dungeon', dungeonId: 'lake-shrine' },
    ],
  },
  pyramid: {
    id: 'pyramid',
    name: "Osiris' Pyramid",
    kicker: 'Main ★3',
    still: require('@/assets/images/piramid.png') as ImageSourcePropType,
    ring: 'main',
    hotspots: [
      { id: 'tomb', x: 0.5, y: 0.42, label: 'Tomb', hint: 'Osiris', kind: 'dungeon', dungeonId: 'sandglass-tomb' },
    ],
  },
  ananiel: {
    id: 'ananiel',
    name: "Ananiel's Spire",
    kicker: 'Titan',
    still: require('@/assets/images/ananieltower.png') as ImageSourcePropType,
    ring: 'main',
    hotspots: [
      { id: 'spire', x: 0.5, y: 0.62, label: 'Spire', hint: 'Ananiel', kind: 'dungeon', dungeonId: 'dream-siphon' },
    ],
  },
};

export function isMapLocationId(id: string): id is MapLocationId {
  return id in MAP_LOCATIONS;
}

export function challengeFor(encounter: FightEncounterDef): CombatChallenge {
  return {
    id: encounter.id,
    dungeonName: encounter.dungeonName,
    bossId: encounter.id,
    bossName: encounter.name,
    accentColor: encounter.accentColor,
    tier: encounter.tier,
    bossLevel: encounter.bossLevel,
    baseWinChance: encounter.baseWinChance,
    failureConsolationGoldRange: encounter.failureConsolationGoldRange,
  };
}

export function getLocationHotspot(
  locationId: MapLocationId,
  hotspotId: string | null,
): LocationHotspotDef | undefined {
  const location = MAP_LOCATIONS[locationId];
  if (!location) return undefined;
  if (hotspotId) {
    const found = location.hotspots.find((spot) => spot.id === hotspotId);
    if (found) return found;
  }
  return location.hotspots[0];
}

export function dungeonById(id: string): DungeonDef | undefined {
  return DUNGEONS[id];
}

export function dungeonForHotspot(hotspot: LocationHotspotDef | undefined): DungeonDef | undefined {
  if (hotspot?.kind !== 'dungeon') return undefined;
  return DUNGEONS[hotspot.dungeonId];
}

export function npcById(id: string): NpcDef | undefined {
  return NPCS[id];
}

export function dungeonFloorById(dungeon: DungeonDef, floorId: string | null): DungeonFloorDef {
  return dungeon.floors.find((floor) => floor.id === floorId) ?? dungeon.floors[0]!;
}

export function isDungeonFloorUnlocked(floor: DungeonFloorDef, clearedEncounterIds: string[]): boolean {
  if (!floor.unlockAfterEncounterId) return true;
  return clearedEncounterIds.includes(floor.unlockAfterEncounterId);
}

export function dungeonLiftFloors(
  dungeon: DungeonDef,
  clearedEncounterIds: string[],
): InteriorFloorDef[] {
  return dungeon.floors.map((floor) => {
    const open = isDungeonFloorUnlocked(floor, clearedEncounterIds);
    return {
      id: floor.id,
      label: floor.label,
      kind: open ? 'fight' : 'locked',
      hint: open ? floor.cdHint : (floor.lockedHint ?? floor.cdHint),
    };
  });
}

export function isHotspotCleared(hotspot: LocationHotspotDef, clearedEncounterIds: string[]): boolean {
  if (hotspot.kind === 'npc') return false;
  const dungeon = DUNGEONS[hotspot.dungeonId];
  if (!dungeon) return false;
  const last = dungeon.floors[dungeon.floors.length - 1];
  return Boolean(last && clearedEncounterIds.includes(last.encounter.id));
}

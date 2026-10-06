import type {
  DungeonLootEntry,
  LootEmptyEntry,
  LootGoldEntry,
  LootItemEntry,
} from '@/types/dungeonLoot';

/**
 * Bible loot for Act 1 floors that still had playground gold stubs:
 * ★2 Raven nave, R2 Tideglass / Pale House, ★3 Sandglass, Titan Dream-Siphon.
 *
 * Bands follow docs/06 + docs/23: Common = gold/Zwykłe (+ Unique only when the
 * Bible allows); Elite Unique ~7% / Heroic ~2%; Champion Unique/Heroic higher;
 * Artifact Titan-only. Affixes are catalog flavor — combat does not read them.
 *
 * Art: item icons / stickers only. No outfit PNG sets.
 */

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

const COSMETIC = 'Cosmetic — wear on Hero. Combat affix parked.';
const POT = 'Consumable — sip later. Not a loadout piece.';

/* -------------------------------------------------------------------------- */
/*  ★2 Raven nave — Wax Acolyte → Wax Abbot (docs/23 §D5)                      */
/* -------------------------------------------------------------------------- */

const RAVEN_COMMON_ITEMS: LootItemEntry[] = [
  {
    id: 'wax_wick_charm',
    kind: 'item',
    name: 'Wax-Wick Charm',
    rarity: 'common',
    description: 'A stub of black wax on a string. The nave still smells like it.',
    icon: 'flame',
    itemSlot: 'relic',
  },
  {
    id: 'choir_candle',
    kind: 'item',
    name: 'Choir Candle',
    rarity: 'common',
    description: 'It burns with almost no light. The choir never needed to see.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    combatHint: POT,
  },
];

const RAVEN_UNIQUE_ITEMS: LootItemEntry[] = [
  {
    id: 'raven_mark_badge',
    kind: 'item',
    name: "Raven-Mark Badge",
    rarity: 'rare',
    description: 'A brass pin the color of wet feathers. The desert birds wore the same.',
    icon: 'raven',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
  {
    id: 'nave_vestment',
    kind: 'item',
    name: 'Nave Vestment',
    rarity: 'rare',
    description: 'Wax-stained choir cloth. Looks like a blessing until you stand in it.',
    icon: 'cloak',
    itemSlot: 'outfit',
    combatHint: COSMETIC,
  },
];

const RAVEN_ELITE_HEROIC: LootItemEntry = {
  id: 'blackwax_rosary',
  kind: 'item',
  name: 'Blackwax Rosary',
  rarity: 'epic',
  description: 'Beads that never quite harden. Count them and the nave listens.',
  icon: 'orb',
  itemSlot: 'relic',
  combatHint: COSMETIC,
};

const RAVEN_CHAMP_HEROIC: LootItemEntry = {
  id: 'abbot_black_censer',
  kind: 'item',
  name: "Abbot's Black Censer",
  rarity: 'epic',
  description: 'He hired a guide for the Closed Way with smoke like this. The fog took the rest.',
  icon: 'crown',
  itemSlot: 'relic',
  combatHint: COSMETIC,
};

export const RAVEN_ELITE_GOLD = goldLoot(
  'raven_elite_gold',
  'Nave coins',
  'Offerings that never reached a living god.',
  40,
  80,
);
export const RAVEN_ELITE_EMPTY = emptyLoot(
  'raven_elite_empty',
  'The choir already took this share.',
);
export const RAVEN_CHAMP_GOLD = goldLoot(
  'raven_champ_gold',
  'Abbot coins',
  'Heavy. Cold. Counted for a desert letter that never left.',
  50,
  90,
);
export const RAVEN_CHAMP_EMPTY = emptyLoot(
  'raven_champ_empty',
  'The abbot travels with smoke, not pockets.',
);

export const RAVEN_ELITE_ITEMS: LootItemEntry[] = [
  ...RAVEN_COMMON_ITEMS,
  ...RAVEN_UNIQUE_ITEMS,
  RAVEN_ELITE_HEROIC,
];
export const RAVEN_CHAMP_ITEMS: LootItemEntry[] = [
  ...RAVEN_COMMON_ITEMS,
  ...RAVEN_UNIQUE_ITEMS,
  RAVEN_CHAMP_HEROIC,
];

export const RAVEN_ELITE_TABLE: DungeonLootEntry[] = [
  ...RAVEN_ELITE_ITEMS,
  RAVEN_ELITE_GOLD,
  RAVEN_ELITE_EMPTY,
];
export const RAVEN_CHAMP_TABLE: DungeonLootEntry[] = [
  ...RAVEN_CHAMP_ITEMS,
  RAVEN_CHAMP_GOLD,
  RAVEN_CHAMP_EMPTY,
];

/** Elite: Unique 7% · Heroic 2%. */
export const RAVEN_ELITE_WEIGHTS: { id: string; weight: number }[] = [
  { id: RAVEN_ELITE_EMPTY.id, weight: 23 },
  { id: RAVEN_ELITE_GOLD.id, weight: 30 },
  { id: 'wax_wick_charm', weight: 19 },
  { id: 'choir_candle', weight: 19 },
  { id: 'raven_mark_badge', weight: 4 },
  { id: 'nave_vestment', weight: 3 },
  { id: 'blackwax_rosary', weight: 2 },
];

/** Champion: Unique 10% · Heroic 4%. */
export const RAVEN_CHAMP_WEIGHTS: { id: string; weight: number }[] = [
  { id: RAVEN_CHAMP_EMPTY.id, weight: 20 },
  { id: RAVEN_CHAMP_GOLD.id, weight: 28 },
  { id: 'wax_wick_charm', weight: 19 },
  { id: 'choir_candle', weight: 19 },
  { id: 'raven_mark_badge', weight: 5 },
  { id: 'nave_vestment', weight: 5 },
  { id: 'abbot_black_censer', weight: 4 },
];

/* -------------------------------------------------------------------------- */
/*  R2 Tideglass Isle — Tide Spirit (docs/23 §D7 seed)                         */
/* -------------------------------------------------------------------------- */

export const TIDE_ITEMS: LootItemEntry[] = [
  {
    id: 'saltwake_charm',
    kind: 'item',
    name: 'Saltwake Charm',
    rarity: 'common',
    description: 'A glass bead that never dries. The isle keeps a share of every crossing.',
    icon: 'tide',
    itemSlot: 'relic',
  },
  {
    id: 'tideglass_sip',
    kind: 'item',
    name: 'Tideglass Sip',
    rarity: 'common',
    description: 'Water that remembers other water. One mouthful. Then the thirst comes back.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    combatHint: POT,
  },
  {
    id: 'seaglass_circlet',
    kind: 'item',
    name: 'Seaglass Circlet',
    rarity: 'rare',
    description: 'Green glass worn like a crown. The spirit did not drown. It waited.',
    icon: 'gem',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
  {
    id: 'tidecloak',
    kind: 'item',
    name: 'Tidecloak',
    rarity: 'rare',
    description: 'Salt-stiff cloth that still moves like a current. Identity, not armor.',
    icon: 'cloak',
    itemSlot: 'outfit',
    combatHint: COSMETIC,
  },
  {
    id: 'stillwater_pearl',
    kind: 'item',
    name: 'Stillwater Pearl',
    rarity: 'epic',
    description: 'A pearl that will not roll. The sea went quiet around it.',
    icon: 'orb',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
];

export const TIDE_GOLD = goldLoot(
  'tide_elite_gold',
  'Isle coins',
  'Wet. The portraits on them have no faces left.',
  36,
  70,
);
export const TIDE_EMPTY = emptyLoot('tide_elite_empty', 'The tide already took this share.');

export const TIDE_TABLE: DungeonLootEntry[] = [...TIDE_ITEMS, TIDE_GOLD, TIDE_EMPTY];

export const TIDE_WEIGHTS: { id: string; weight: number }[] = [
  { id: TIDE_EMPTY.id, weight: 23 },
  { id: TIDE_GOLD.id, weight: 30 },
  { id: 'saltwake_charm', weight: 19 },
  { id: 'tideglass_sip', weight: 19 },
  { id: 'seaglass_circlet', weight: 4 },
  { id: 'tidecloak', weight: 3 },
  { id: 'stillwater_pearl', weight: 2 },
];

/* -------------------------------------------------------------------------- */
/*  R2 Pale House — Pale Cleric (docs/23 §D7 seed)                             */
/* -------------------------------------------------------------------------- */

export const PALE_ITEMS: LootItemEntry[] = [
  {
    id: 'pale_host_token',
    kind: 'item',
    name: 'Pale Host Token',
    rarity: 'common',
    description: 'A communion chip that never stains. He has been handing these out for decades.',
    icon: 'sparkles',
    itemSlot: 'relic',
  },
  {
    id: 'bloodwine_sip',
    kind: 'item',
    name: 'Bloodwine',
    rarity: 'common',
    description: 'Sweet. Then iron. The house calls it sacrament.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    combatHint: POT,
  },
  {
    id: 'immortal_collar',
    kind: 'item',
    name: 'Immortal Collar',
    rarity: 'rare',
    description: 'Lace that does not yellow. He never aged. The fog just brought him more guests.',
    icon: 'fang',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
  {
    id: 'choir_night_cassock',
    kind: 'item',
    name: 'Choir-Night Cassock',
    rarity: 'rare',
    description: 'A clerical coat that drinks candlelight. Faith on the front. Hunger underneath.',
    icon: 'cloak',
    itemSlot: 'outfit',
    combatHint: COSMETIC,
  },
  {
    id: 'unaging_signet',
    kind: 'item',
    name: 'Unaging Signet',
    rarity: 'epic',
    description: 'A ring with no year cut into it. The house has no obituaries.',
    icon: 'gem',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
];

export const PALE_GOLD = goldLoot(
  'pale_elite_gold',
  'Offering coins',
  'Left in the plate. Never counted in daylight.',
  36,
  70,
);
export const PALE_EMPTY = emptyLoot('pale_elite_empty', 'The cleric already blessed this pile away.');

export const PALE_TABLE: DungeonLootEntry[] = [...PALE_ITEMS, PALE_GOLD, PALE_EMPTY];

export const PALE_WEIGHTS: { id: string; weight: number }[] = [
  { id: PALE_EMPTY.id, weight: 23 },
  { id: PALE_GOLD.id, weight: 30 },
  { id: 'pale_host_token', weight: 19 },
  { id: 'bloodwine_sip', weight: 19 },
  { id: 'immortal_collar', weight: 4 },
  { id: 'choir_night_cassock', weight: 3 },
  { id: 'unaging_signet', weight: 2 },
];

/* -------------------------------------------------------------------------- */
/*  ★3 Sandglass tomb — Embalmed Devotee → Osiris (docs/23 §D8)                */
/* -------------------------------------------------------------------------- */

const SAND_COMMON_ITEMS: LootItemEntry[] = [
  {
    id: 'sandglass_charm',
    kind: 'item',
    name: 'Sandglass Charm',
    rarity: 'common',
    description: 'A tiny glass that will not turn. The dunes keep their own time.',
    icon: 'sand',
    itemSlot: 'relic',
  },
  {
    id: 'natron_pinch',
    kind: 'item',
    name: 'Natron Pinch',
    rarity: 'common',
    description: 'Salt for a body that was never going to stay dead. One pinch. Then dust.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    combatHint: POT,
  },
];

const SAND_UNIQUE_ITEMS: LootItemEntry[] = [
  {
    id: 'embalmer_seal',
    kind: 'item',
    name: "Embalmer's Seal",
    rarity: 'rare',
    description: 'A clay stamp of a name you cannot read aloud. The devotees wore it into the wrappings.',
    icon: 'scroll',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
  {
    id: 'funerary_linen',
    kind: 'item',
    name: 'Funerary Linen',
    rarity: 'rare',
    description: 'Wraps the color of late sun. Looks like mourning until you walk in it.',
    icon: 'cloak',
    itemSlot: 'outfit',
    combatHint: COSMETIC,
  },
];

const SAND_ELITE_HEROIC: LootItemEntry = {
  id: 'hour_of_dunes',
  kind: 'item',
  name: 'Hour of the Dunes',
  rarity: 'epic',
  description: 'A stopped watch filled with sand. When the storms reach the kingdom, this is what they carry.',
  icon: 'star',
  itemSlot: 'relic',
  combatHint: COSMETIC,
};

const SAND_CHAMP_HEROIC: LootItemEntry = {
  id: 'dune_shroud',
  kind: 'item',
  name: 'Dune Shroud',
  rarity: 'epic',
  description: "Osiris' right-hand cloth. The fog in Crownhaven started as this sand.",
  icon: 'cloak',
  itemSlot: 'outfit',
  combatHint: COSMETIC,
};

export const SAND_ELITE_GOLD = goldLoot(
  'sand_elite_gold',
  'Tomb coins',
  'Struck for a cult that does not spend.',
  44,
  80,
);
export const SAND_ELITE_EMPTY = emptyLoot(
  'sand_elite_empty',
  'The wrappings were already picked clean.',
);
export const SAND_CHAMP_GOLD = goldLoot(
  'sand_champ_gold',
  'Pyramid coins',
  'Heavy enough to feel like a verdict.',
  55,
  100,
);
export const SAND_CHAMP_EMPTY = emptyLoot(
  'sand_champ_empty',
  'Osiris keeps the interesting hours.',
);

export const SAND_ELITE_ITEMS: LootItemEntry[] = [
  ...SAND_COMMON_ITEMS,
  ...SAND_UNIQUE_ITEMS,
  SAND_ELITE_HEROIC,
];
export const SAND_CHAMP_ITEMS: LootItemEntry[] = [
  ...SAND_COMMON_ITEMS,
  ...SAND_UNIQUE_ITEMS,
  SAND_CHAMP_HEROIC,
];

export const SAND_ELITE_TABLE: DungeonLootEntry[] = [
  ...SAND_ELITE_ITEMS,
  SAND_ELITE_GOLD,
  SAND_ELITE_EMPTY,
];
export const SAND_CHAMP_TABLE: DungeonLootEntry[] = [
  ...SAND_CHAMP_ITEMS,
  SAND_CHAMP_GOLD,
  SAND_CHAMP_EMPTY,
];

export const SAND_ELITE_WEIGHTS: { id: string; weight: number }[] = [
  { id: SAND_ELITE_EMPTY.id, weight: 23 },
  { id: SAND_ELITE_GOLD.id, weight: 30 },
  { id: 'sandglass_charm', weight: 19 },
  { id: 'natron_pinch', weight: 19 },
  { id: 'embalmer_seal', weight: 4 },
  { id: 'funerary_linen', weight: 3 },
  { id: 'hour_of_dunes', weight: 2 },
];

export const SAND_CHAMP_WEIGHTS: { id: string; weight: number }[] = [
  { id: SAND_CHAMP_EMPTY.id, weight: 20 },
  { id: SAND_CHAMP_GOLD.id, weight: 28 },
  { id: 'sandglass_charm', weight: 19 },
  { id: 'natron_pinch', weight: 19 },
  { id: 'embalmer_seal', weight: 5 },
  { id: 'funerary_linen', weight: 5 },
  { id: 'dune_shroud', weight: 4 },
];

/* -------------------------------------------------------------------------- */
/*  Titan — Ananiel Dream-Siphon (docs/23 §D9, docs/06 Artifact = Titan only)  */
/* -------------------------------------------------------------------------- */

export const TITAN_ITEMS: LootItemEntry[] = [
  {
    id: 'dream_ash_charm',
    kind: 'item',
    name: 'Dream-Ash Charm',
    rarity: 'rare',
    description: 'Grey dust that will not blow away. Someone dreamed it into a bead.',
    icon: 'orb',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
  {
    id: 'siphon_draught',
    kind: 'item',
    name: 'Siphon Draught',
    rarity: 'common',
    description: 'A sip of sleep that is not yours. You will want a second. There is no second.',
    icon: 'wine',
    itemSlot: 'relic',
    consumable: true,
    combatHint: POT,
  },
  {
    id: 'siphon_veil',
    kind: 'item',
    name: 'Siphon Veil',
    rarity: 'epic',
    description: 'Cloth the color of a shut eye. The tower wore it. Now you do.',
    icon: 'cloak',
    itemSlot: 'outfit',
    combatHint: COSMETIC,
  },
  {
    id: 'ananiel_shard',
    kind: 'item',
    name: 'Dream-Siphon Shard',
    rarity: 'legendary',
    description:
      'A sliver of the glass that drank the kingdom’s sleep. Act 1’s Artifact — holy, not a stat stick.',
    icon: 'gem',
    itemSlot: 'relic',
    combatHint: COSMETIC,
  },
];

export const TITAN_GOLD = goldLoot(
  'titan_gold',
  'Siphon coins',
  'They feel like they used to be hours.',
  80,
  140,
);
export const TITAN_EMPTY = emptyLoot(
  'titan_empty',
  'The siphon already drank this share.',
);

export const TITAN_TABLE: DungeonLootEntry[] = [...TITAN_ITEMS, TITAN_GOLD, TITAN_EMPTY];

/** Unique 22% · Heroic 14% · Artifact 4%. No pity. */
export const TITAN_WEIGHTS: { id: string; weight: number }[] = [
  { id: TITAN_EMPTY.id, weight: 20 },
  { id: TITAN_GOLD.id, weight: 24 },
  { id: 'dream_ash_charm', weight: 22 },
  { id: 'siphon_draught', weight: 16 },
  { id: 'siphon_veil', weight: 14 },
  { id: 'ananiel_shard', weight: 4 },
];

/* -------------------------------------------------------------------------- */
/*  Catalog slices for content.ts lookups                                      */
/* -------------------------------------------------------------------------- */

export const ACT1_LATER_ITEMS: LootItemEntry[] = [
  ...RAVEN_ELITE_ITEMS,
  RAVEN_CHAMP_HEROIC,
  ...TIDE_ITEMS,
  ...PALE_ITEMS,
  ...SAND_ELITE_ITEMS,
  SAND_CHAMP_HEROIC,
  ...TITAN_ITEMS,
];

export const ACT1_LATER_GOLD: LootGoldEntry[] = [
  RAVEN_ELITE_GOLD,
  RAVEN_CHAMP_GOLD,
  TIDE_GOLD,
  PALE_GOLD,
  SAND_ELITE_GOLD,
  SAND_CHAMP_GOLD,
  TITAN_GOLD,
];

export const ACT1_LATER_EMPTY: LootEmptyEntry[] = [
  RAVEN_ELITE_EMPTY,
  RAVEN_CHAMP_EMPTY,
  TIDE_EMPTY,
  PALE_EMPTY,
  SAND_ELITE_EMPTY,
  SAND_CHAMP_EMPTY,
  TITAN_EMPTY,
];

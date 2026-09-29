import type { StickerName } from '@/ui/stickerRegistry';
import type { LootRarity } from '@/types/dungeonLoot';

import { KEY_PRICE_GOLD } from '@/lib/economy';

export type ShopGrant = { kind: 'key' } | { kind: 'item'; itemId: string };

export type ShopSku = {
  id: string;
  name: string;
  sticker: StickerName;
  rarity: LootRarity;
  gold: number;
  featured?: boolean;
  soldOut?: boolean;
  /** Only set when a real wallet / inventory slot already exists. */
  grant?: ShopGrant;
};

/** Golden shop.png / lookdev/shop.html. Real catalog is 6 SKUs. */
export const STALL_BUY_STOCK: readonly ShopSku[] = [
  {
    id: 'dungeon-key',
    name: 'Dungeon key',
    sticker: 'key',
    rarity: 'common',
    gold: KEY_PRICE_GOLD,
    grant: { kind: 'key' },
  },
  {
    id: 'streak-freeze',
    name: 'Streak freeze',
    sticker: 'ice',
    rarity: 'rare',
    gold: 750,
  },
  {
    id: 'luck-potion',
    name: 'Luck potion',
    sticker: 'clover',
    rarity: 'rare',
    gold: 120,
  },
  {
    id: 'travelers-coat',
    name: "Traveler's coat",
    sticker: 'coat',
    rarity: 'epic',
    gold: 900,
    featured: true,
  },
  {
    id: 'seers-charm',
    name: "Seer's charm",
    sticker: 'nazar',
    rarity: 'epic',
    gold: 1400,
  },
  {
    id: 'iron-helm',
    name: 'Iron helm',
    sticker: 'helmet',
    rarity: 'common',
    gold: 0,
    soldOut: true,
  },
];

/** Temporary extra tiles so the catalog can scroll. Not real stock — remove after the founder checks the scroll. */
export const STALL_BUY_SCROLL_FIXTURES: readonly ShopSku[] = [
  {
    id: 'test-stock-a',
    name: 'Test stock',
    sticker: 'bread',
    rarity: 'common',
    gold: 0,
    soldOut: true,
  },
  {
    id: 'test-stock-b',
    name: 'Test stock',
    sticker: 'wine',
    rarity: 'common',
    gold: 0,
    soldOut: true,
  },
  {
    id: 'test-stock-c',
    name: 'Test stock',
    sticker: 'gem',
    rarity: 'common',
    gold: 0,
    soldOut: true,
  },
];

export const STALL_LINE = 'Keys, potions, a coat for the road. Take your pick, dear.';
export const STALL_RESTOCK_LABEL = 'New stock';
export const STALL_RESTOCK_VALUE = '3d';

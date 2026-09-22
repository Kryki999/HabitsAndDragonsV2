import { WORLD_LOOT_ITEMS } from '@/world/content';
import type { LootItemEntry } from '@/types/dungeonLoot';

/**
 * Hero catalog: demo stand-ins + Act 1 dungeon drop items.
 * V1 raster art was gitignored; slots use Lucide glyphs.
 */
const DEMO_ITEMS: LootItemEntry[] = [
  {
    id: 'wayfarer_cloak',
    kind: 'item',
    name: "Wayfarer's Cloak",
    rarity: 'common',
    description: 'Travel-stained wool. A stand-in outfit until dungeon loot exists.',
    icon: 'shield',
    itemSlot: 'outfit',
  },
  {
    id: 'ember_charm',
    kind: 'item',
    name: 'Ember Charm',
    rarity: 'uncommon',
    description: 'A warm stone on a cord. A stand-in relic until dungeon loot exists.',
    icon: 'flame',
    itemSlot: 'relic',
  },
];

const byId = new Map<string, LootItemEntry>([
  ...DEMO_ITEMS.map((item) => [item.id, item] as const),
  ...WORLD_LOOT_ITEMS.map((item) => [item.id, item] as const),
]);

export function resolveLootItemById(itemId: string): LootItemEntry | null {
  return byId.get(itemId) ?? null;
}

import { WORLD_LOOT_ITEMS } from '@/world/content';
import type { LootItemEntry } from '@/types/dungeonLoot';

/** Catalog: Act 1 dungeon drops. Legacy demo ids stay resolvable for old saves. */
const DEMO_ITEMS: LootItemEntry[] = [
  {
    id: 'wayfarer_cloak',
    kind: 'item',
    name: "Wayfarer's Cloak",
    rarity: 'common',
    description: 'Travel-stained wool. Legacy starter outfit from before dungeon loot.',
    icon: 'cloak',
    itemSlot: 'outfit',
  },
  {
    id: 'ember_charm',
    kind: 'item',
    name: 'Ember Charm',
    rarity: 'uncommon',
    description: 'A warm stone on a cord. Legacy starter relic from before dungeon loot.',
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

export function canEquipItem(item: LootItemEntry): boolean {
  return !item.consumable;
}

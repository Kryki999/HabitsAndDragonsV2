import type { LootRarity } from '@/types/dungeonLoot';

/**
 * Stall buyback — docs/06 §7 bands (not the Hero backpack recycle table).
 * Common 10–15 · Unique 120–200 · Heroic 300–600.
 * Artifact is not in §7; return null and do not invent a price.
 */
export function stallSellGold(rarity: LootRarity): number | null {
  if (rarity === 'common') return 15;
  if (rarity === 'uncommon' || rarity === 'rare') return 150;
  if (rarity === 'epic') return 400;
  return null;
}

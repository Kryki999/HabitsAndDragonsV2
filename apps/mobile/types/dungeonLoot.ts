export type LootRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/** Lucide-based keys resolved in UI. */
export type LootIconId =
  | "gem"
  | "crown"
  | "shield"
  | "sparkles"
  | "skull"
  | "flame"
  | "snowflake"
  | "key"
  | "scroll"
  | "star"
  | "coins"
  | "sword"
  | "orb"
  | "anchor"
  | "moon"
  | "wine";

/** Combat biome / tier affix (Act 1: Common only). */
export type CombatSynergyTier = "common";

/** Slot loadoutu: strój / zbroja vs relikwia / broń / artefakt / akcesoria. */
export type ItemLoadoutSlot = "outfit" | "relic";

export interface LootItemEntry {
  id: string;
  kind: "item";
  name: string;
  rarity: LootRarity;
  description: string;
  icon: LootIconId;
  itemSlot: ItemLoadoutSlot;
  /** Hidden combat relation used by auto-battler chance engine. */
  synergyBossId?: string | null;
  synergyWinChanceBonus?: number;
  /** Broad affix, e.g. Tulip +10% vs Common. */
  synergyTier?: CombatSynergyTier | null;
  /** Sipped on Fight; not a loadout piece. */
  consumable?: boolean;
  /** Short combat line for item preview, e.g. "+10% win vs Common". */
  combatHint?: string;
}

export interface LootGoldEntry {
  id: string;
  kind: "gold";
  name: string;
  rarity: LootRarity;
  description: string;
  goldMin: number;
  goldMax: number;
}

export interface LootEmptyEntry {
  id: string;
  kind: "empty";
  name: string;
  rarity: LootRarity;
  description: string;
}

export type DungeonLootEntry = LootItemEntry | LootGoldEntry | LootEmptyEntry;

/** Lower = more common (display / roll weight ordering). */
export const LOOT_RARITY_ORDER: Record<LootRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export function sortDungeonLootByRarity(entries: readonly DungeonLootEntry[]): DungeonLootEntry[] {
  return [...entries].sort((a, b) => LOOT_RARITY_ORDER[a.rarity] - LOOT_RARITY_ORDER[b.rarity]);
}

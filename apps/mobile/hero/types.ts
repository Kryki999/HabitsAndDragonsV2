import type { HeroHexStats } from '@/constants/heroHexStats';
import type { StatType } from '@/habits/types';
import type { ItemLoadoutSlot } from '@/types/dungeonLoot';

export type HeroXpReward = { stat: StatType; amount: number };

export type HeroState = {
  /** Display nick; titles win when unlocked. Null → epithet / Wayfarer. */
  heroDisplayName: string | null;
  unlockedTitleIds: string[];
  /** ISO date or datetime; used for "Joined the Realm". */
  createdAt: string | null;
  /** Local gold — loot / sell / quests write here until server economy. */
  gold: number;
  /** Dungeon keys. Starts at 0; DEV can bump via addDungeonKeys. */
  dungeonKeys: number;
  /** Demo level ring. Not the V1 XP curve. */
  playerLevel: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  hexStats: HeroHexStats;
  ownedItemIds: string[];
  equippedOutfitId: string | null;
  equippedRelicId: string | null;
  /** Lifetime dungeon wins — 0 until World/dungeons exist. */
  bossesDefeated: number;
  heroShopPurchaseEver: boolean;
  heroDailyQuestClaimsDate: string | null;
  heroDailyQuestClaimedIds: string[];
  heroEpicMilestoneClaimedIds: string[];
};

export type HeroActions = {
  claimHeroDailyQuest: (questId: string, goldReward: number, xpReward?: HeroXpReward) => boolean;
  claimHeroEpicMilestone: (questId: string, goldReward: number, xpReward?: HeroXpReward) => boolean;
  equipItemById: (itemId: string) => void;
  unequipLoadoutSlot: (slot: ItemLoadoutSlot) => void;
  sellInventoryItemAtIndex: (index: number) => void;
  addGold: (amount: number) => void;
  addDungeonKeys: (amount: number) => void;
  /** Demo / DEV. Clamps to 1–99. */
  setPlayerLevel: (level: number) => void;
  grantInventoryItem: (itemId: string) => void;
  /** Removes one stacked copy. Returns false if none owned. */
  consumeOwnedItem: (itemId: string) => boolean;
  recordBossWin: () => void;
};

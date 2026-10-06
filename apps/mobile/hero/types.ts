import type { FightLootPrize } from '@/combat/types';
import type { HeroHexStats } from '@/constants/heroHexStats';
import type { StatType } from '@/habits/types';
import type { HabitCompletionGrant } from '@/lib/economy';
import type { ItemLoadoutSlot } from '@/types/dungeonLoot';

export type HeroXpReward = { stat: StatType; amount: number };

export type HeroState = {
  /** Display nick; titles win when unlocked. Null → epithet / Wayfarer. */
  heroDisplayName: string | null;
  unlockedTitleIds: string[];
  /** ISO date or datetime; used for "Joined the Realm". */
  createdAt: string | null;
  /** Wallet — habits, fights, sell, and key shop write here. */
  gold: number;
  /** Dungeon keys. Starts at 0; buy 100g or habit drop / DEV. */
  dungeonKeys: number;
  /** Soft level from habit XP. Constant `XP_PER_LEVEL` until Bible locks the curve. */
  playerLevel: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  /** Revealed hex totals. Hero UI reads this — not MOCK_HERO_HEX_STATS. */
  hexStats: HeroHexStats;
  /**
   * Last calendar day whose habit hex deltas have been folded into `hexStats`.
   * Gains sit on grant logs until the next morning flow.
   */
  hexRevealedThroughDate: string | null;
  /** Once-per-calendar-day morning gate. Key: `YYYY-MM-DD` (same clock as habit reset). */
  lastMorningFlowDate: string | null;
  loginStreakDays: number;
  /** Dates the morning flow was finished; week strip + streak math. */
  morningLoginDates: string[];
  ownedItemIds: string[];
  equippedOutfitId: string | null;
  equippedRelicId: string | null;
  /** Lifetime dungeon wins. */
  bossesDefeated: number;
  heroShopPurchaseEver: boolean;
  heroDailyQuestClaimsDate: string | null;
  heroDailyQuestClaimedIds: string[];
  heroEpicMilestoneClaimedIds: string[];
  /** Per-completion gold/XP/key grants so uncomplete can reverse the same award. */
  habitGrantLogByDate: Record<string, HabitCompletionGrant[]>;
};

export type HeroActions = {
  claimHeroDailyQuest: (questId: string, goldReward: number, xpReward?: HeroXpReward) => boolean;
  claimHeroEpicMilestone: (questId: string, goldReward: number, xpReward?: HeroXpReward) => boolean;
  equipItemById: (itemId: string) => void;
  unequipLoadoutSlot: (slot: ItemLoadoutSlot) => void;
  sellInventoryItemAtIndex: (index: number) => void;
  /** Stall shop: one copy of itemId for this gold. Does not use Hero backpack prices. */
  sellOwnedItemForGold: (itemId: string, gold: number) => boolean;
  addGold: (amount: number) => void;
  /** Required display name from Day 0. Empty/whitespace is ignored. */
  setHeroDisplayName: (name: string) => void;
  /** Returns false if the wallet cannot cover it. */
  spendGold: (amount: number) => boolean;
  addDungeonKeys: (amount: number) => void;
  /** Demo / DEV. Clamps to 1–99. */
  setPlayerLevel: (level: number) => void;
  grantInventoryItem: (itemId: string) => void;
  /** Removes one stacked copy. Returns false if none owned. */
  consumeOwnedItem: (itemId: string) => boolean;
  recordBossWin: () => void;
  applyHabitGrant: (grant: HabitCompletionGrant) => void;
  reverseHabitGrant: (habitId: string, dateKey: string) => HabitCompletionGrant | null;
  buyDungeonKey: () => boolean;
  spendDungeonKey: () => boolean;
  applyLootPrize: (prize: FightLootPrize) => void;
  /**
   * Once per calendar day: fold unrevealed hex (through yesterday) into `hexStats`,
   * bump login streak, mark the morning gate done.
   */
  completeMorningLogin: () => { from: HeroHexStats; to: HeroHexStats; delta: HeroHexStats };
  previewMorningHexReveal: () => { from: HeroHexStats; to: HeroHexStats; delta: HeroHexStats };
  /** Day 0 finish: close the morning gate without hex reveal so quiz isn't stacked. */
  skipMorningToday: () => void;
};

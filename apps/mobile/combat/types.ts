import type { DungeonLootEntry, LootItemEntry } from '@/types/dungeonLoot';

export type FightPhase = 'approach' | 'clash' | 'outcome' | 'loot';

export type WinChanceLine = {
  label: string;
  detail?: string;
  pct: number | null;
};

export type WinChanceBreakdown = {
  /** 0–1, already clamped / tutorial-locked. */
  chance: number;
  displayPct: number;
  tutorialLock: boolean;
  lines: WinChanceLine[];
  howToImprove: string[];
};

export type FightLootPrize =
  | { kind: 'empty'; entry: DungeonLootEntry }
  | { kind: 'gold'; amount: number; entry: DungeonLootEntry }
  | { kind: 'item'; item: LootItemEntry }
  | { kind: 'items'; items: LootItemEntry[]; headline: LootItemEntry };

export type FightResolution =
  | {
      won: true;
      chance: number;
      loot: FightLootPrize;
      sippedWine: boolean;
    }
  | {
      won: false;
      chance: number;
      consolationGold: number;
      sippedWine: boolean;
    };

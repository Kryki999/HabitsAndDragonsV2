import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { FightLootPrize } from '@/combat/types';
import {
  addHex,
  cloneHex,
  emptyHex,
  looksLikeMockHeroHex,
  ZERO_HERO_HEX_STATS,
  type HeroHexStats,
} from '@/constants/heroHexStats';
import { applyXpDelta, KEY_PRICE_GOLD, XP_PER_LEVEL, type HabitCompletionGrant } from '@/lib/economy';
import { todayKey, yesterdayKey } from '@/lib/dateKey';
import { sumHexDeltas } from '@/lib/hexEconomy';
import { sellPriceForRarity } from '@/lib/inventoryEconomy';
import { resolveLootItemById } from '@/lib/itemCatalog';

import type { HeroActions, HeroState } from './types';

function uniqueDates(dates: readonly string[], extra?: string): string[] {
  const set = new Set(dates.filter(Boolean));
  if (extra) set.add(extra);
  return [...set].sort();
}

function pendingHexReveal(
  hexStats: HeroHexStats,
  grantLog: Record<string, HabitCompletionGrant[]>,
  revealedThrough: string | null,
  yesterday: string,
): { from: HeroHexStats; to: HeroHexStats; delta: HeroHexStats } {
  const from = cloneHex(hexStats);
  let delta = emptyHex();
  for (const [date, grants] of Object.entries(grantLog)) {
    if (date > yesterday) continue;
    if (revealedThrough && date <= revealedThrough) continue;
    delta = addHex(delta, sumHexDeltas(grants));
  }
  return { from, delta, to: addHex(from, delta) };
}

function nextLoginStreak(lastMorningFlowDate: string | null, loginStreakDays: number, today: string, yesterday: string): number {
  if (lastMorningFlowDate === today) return Math.max(1, loginStreakDays);
  if (lastMorningFlowDate === yesterday) return Math.max(1, loginStreakDays) + 1;
  return 1;
}

/** Visual stand-ins until dungeon loot exists. Lucide glyphs, not raster art. */
const DEMO_OWNED_ITEM_IDS = ['wayfarer_cloak', 'ember_charm'] as const;

type HeroStore = HeroState & HeroActions;

function withXp(
  state: Pick<HeroState, 'playerLevel' | 'currentLevelXP' | 'xpForNextLevel'>,
  delta: number,
): Pick<HeroState, 'playerLevel' | 'currentLevelXP'> {
  return applyXpDelta(state.playerLevel, state.currentLevelXP, state.xpForNextLevel, delta);
}

function ownedWithLoot(ownedItemIds: string[], prize: FightLootPrize): string[] {
  if (prize.kind === 'item') {
    if (!resolveLootItemById(prize.item.id)) return ownedItemIds;
    return [...ownedItemIds, prize.item.id];
  }
  if (prize.kind === 'items') {
    const next = [...ownedItemIds];
    for (const item of prize.items) {
      if (resolveLootItemById(item.id)) next.push(item.id);
    }
    return next;
  }
  return ownedItemIds;
}

export const useHeroStore = create<HeroStore>()(
  persist(
    (set, get) => ({
      heroDisplayName: null,
      unlockedTitleIds: [],
      createdAt: null,
      gold: 0,
      dungeonKeys: 0,
      playerLevel: 1,
      currentLevelXP: 0,
      xpForNextLevel: XP_PER_LEVEL,
      hexStats: { ...ZERO_HERO_HEX_STATS },
      hexRevealedThroughDate: null,
      lastMorningFlowDate: null,
      loginStreakDays: 0,
      morningLoginDates: [],
      ownedItemIds: [...DEMO_OWNED_ITEM_IDS],
      equippedOutfitId: null,
      equippedRelicId: null,
      bossesDefeated: 0,
      heroShopPurchaseEver: false,
      heroDailyQuestClaimsDate: null,
      heroDailyQuestClaimedIds: [],
      heroEpicMilestoneClaimedIds: [],
      habitGrantLogByDate: {},

      claimHeroDailyQuest: (questId, goldReward, xpReward) => {
        const today = todayKey();
        let claimed = false;
        set((state) => {
          const priorIds = state.heroDailyQuestClaimsDate === today ? state.heroDailyQuestClaimedIds : [];
          if (priorIds.includes(questId)) return state;
          claimed = true;
          return {
            gold: state.gold + goldReward,
            ...withXp(state, xpReward?.amount ?? 0),
            createdAt: state.createdAt ?? new Date().toISOString(),
            heroDailyQuestClaimsDate: today,
            heroDailyQuestClaimedIds: [...priorIds, questId],
          };
        });
        return claimed;
      },

      claimHeroEpicMilestone: (questId, goldReward, xpReward) => {
        let claimed = false;
        set((state) => {
          if (state.heroEpicMilestoneClaimedIds.includes(questId)) return state;
          claimed = true;
          return {
            gold: state.gold + goldReward,
            ...withXp(state, xpReward?.amount ?? 0),
            createdAt: state.createdAt ?? new Date().toISOString(),
            heroEpicMilestoneClaimedIds: [...state.heroEpicMilestoneClaimedIds, questId],
          };
        });
        return claimed;
      },

      equipItemById: (itemId) => {
        const entry = resolveLootItemById(itemId);
        if (!entry) return;
        if (entry.itemSlot === 'outfit') set({ equippedOutfitId: itemId });
        else set({ equippedRelicId: itemId });
      },

      unequipLoadoutSlot: (slot) => {
        if (slot === 'outfit') set({ equippedOutfitId: null });
        else set({ equippedRelicId: null });
      },

      sellInventoryItemAtIndex: (index) => {
        set((state) => {
          const owned = [...state.ownedItemIds];
          if (index < 0 || index >= owned.length) return state;
          const itemId = owned[index]!;
          const entry = resolveLootItemById(itemId);
          owned.splice(index, 1);
          const price = entry ? sellPriceForRarity(entry.rarity) : 0;
          let equippedOutfitId = state.equippedOutfitId;
          let equippedRelicId = state.equippedRelicId;
          if (equippedOutfitId === itemId) equippedOutfitId = null;
          if (equippedRelicId === itemId) equippedRelicId = null;
          return {
            ownedItemIds: owned,
            gold: state.gold + price,
            equippedOutfitId,
            equippedRelicId,
            heroShopPurchaseEver: true,
          };
        });
      },

      sellOwnedItemForGold: (itemId, gold) => {
        let sold = false;
        set((state) => {
          const owned = [...state.ownedItemIds];
          const index = owned.indexOf(itemId);
          if (index < 0 || gold < 0) return state;
          owned.splice(index, 1);
          sold = true;
          let equippedOutfitId = state.equippedOutfitId;
          let equippedRelicId = state.equippedRelicId;
          if (equippedOutfitId === itemId && !owned.includes(itemId)) equippedOutfitId = null;
          if (equippedRelicId === itemId && !owned.includes(itemId)) equippedRelicId = null;
          return {
            ownedItemIds: owned,
            gold: state.gold + gold,
            equippedOutfitId,
            equippedRelicId,
            heroShopPurchaseEver: true,
          };
        });
        return sold;
      },

      addGold: (amount) => {
        if (amount === 0) return;
        set((state) => ({ gold: Math.max(0, state.gold + amount) }));
      },

      spendGold: (amount) => {
        if (amount <= 0) return false;
        let spent = false;
        set((state) => {
          if (state.gold < amount) return state;
          spent = true;
          return { gold: state.gold - amount };
        });
        return spent;
      },

      addDungeonKeys: (amount) => {
        if (amount === 0) return;
        set((state) => ({ dungeonKeys: Math.max(0, (state.dungeonKeys ?? 0) + amount) }));
      },

      setPlayerLevel: (level) => {
        if (!Number.isFinite(level)) return;
        set({ playerLevel: Math.max(1, Math.min(99, Math.floor(level))) });
      },

      grantInventoryItem: (itemId) => {
        if (!resolveLootItemById(itemId)) return;
        set((state) => ({ ownedItemIds: [...state.ownedItemIds, itemId] }));
      },

      consumeOwnedItem: (itemId) => {
        let consumed = false;
        set((state) => {
          const owned = [...state.ownedItemIds];
          const index = owned.lastIndexOf(itemId);
          if (index < 0) return state;
          consumed = true;
          owned.splice(index, 1);
          let equippedOutfitId = state.equippedOutfitId;
          let equippedRelicId = state.equippedRelicId;
          if (equippedOutfitId === itemId && !owned.includes(itemId)) equippedOutfitId = null;
          if (equippedRelicId === itemId && !owned.includes(itemId)) equippedRelicId = null;
          return { ownedItemIds: owned, equippedOutfitId, equippedRelicId };
        });
        return consumed;
      },

      recordBossWin: () => {
        set((state) => ({ bossesDefeated: state.bossesDefeated + 1 }));
      },

      applyHabitGrant: (grant) => {
        const today = todayKey();
        set((state) => {
          const prior = (state.habitGrantLogByDate ?? {})[today] ?? [];
          return {
            gold: Math.max(0, state.gold + grant.gold),
            dungeonKeys: Math.max(0, (state.dungeonKeys ?? 0) + grant.keys),
            ...withXp(state, grant.xp),
            habitGrantLogByDate: { ...(state.habitGrantLogByDate ?? {}), [today]: [...prior, grant] },
            createdAt: state.createdAt ?? new Date().toISOString(),
          };
        });
      },

      reverseHabitGrant: (habitId, dateKey) => {
        let reversed: HabitCompletionGrant | null = null;
        set((state) => {
          const list = [...((state.habitGrantLogByDate ?? {})[dateKey] ?? [])];
          const idx = list.map((g) => g.habitId).lastIndexOf(habitId);
          if (idx < 0) return state;
          reversed = list[idx]!;
          list.splice(idx, 1);
          const habitGrantLogByDate = { ...(state.habitGrantLogByDate ?? {}) };
          if (list.length === 0) delete habitGrantLogByDate[dateKey];
          else habitGrantLogByDate[dateKey] = list;
          return {
            gold: Math.max(0, state.gold - reversed.gold),
            dungeonKeys: Math.max(0, (state.dungeonKeys ?? 0) - reversed.keys),
            ...withXp(state, -reversed.xp),
            habitGrantLogByDate,
          };
        });
        return reversed;
      },

      buyDungeonKey: () => {
        let bought = false;
        set((state) => {
          if (state.gold < KEY_PRICE_GOLD) return state;
          bought = true;
          return {
            gold: state.gold - KEY_PRICE_GOLD,
            dungeonKeys: (state.dungeonKeys ?? 0) + 1,
          };
        });
        return bought;
      },

      spendDungeonKey: () => {
        let spent = false;
        set((state) => {
          if ((state.dungeonKeys ?? 0) < 1) return state;
          spent = true;
          return { dungeonKeys: state.dungeonKeys - 1 };
        });
        return spent;
      },

      applyLootPrize: (prize) => {
        set((state) => {
          const gold = prize.kind === 'gold' ? state.gold + prize.amount : state.gold;
          return {
            gold,
            ownedItemIds: ownedWithLoot(state.ownedItemIds, prize),
          };
        });
      },

      previewMorningHexReveal: () => {
        const state = get();
        return pendingHexReveal(
          state.hexStats,
          state.habitGrantLogByDate ?? {},
          state.hexRevealedThroughDate ?? null,
          yesterdayKey(),
        );
      },

      completeMorningLogin: () => {
        const today = todayKey();
        const yesterday = yesterdayKey();
        let result = pendingHexReveal(emptyHex(), {}, null, yesterday);
        set((state) => {
          if (state.lastMorningFlowDate === today) {
            result = { from: cloneHex(state.hexStats), to: cloneHex(state.hexStats), delta: emptyHex() };
            return state;
          }
          result = pendingHexReveal(
            state.hexStats,
            state.habitGrantLogByDate ?? {},
            state.hexRevealedThroughDate ?? null,
            yesterday,
          );
          const loginStreakDays = nextLoginStreak(
            state.lastMorningFlowDate,
            state.loginStreakDays,
            today,
            yesterday,
          );
          return {
            hexStats: result.to,
            hexRevealedThroughDate: yesterday,
            lastMorningFlowDate: today,
            loginStreakDays,
            morningLoginDates: uniqueDates(state.morningLoginDates ?? [], today).slice(-90),
            createdAt: state.createdAt ?? new Date().toISOString(),
          };
        });
        return result;
      },
    }),
    {
      name: 'hnd-hero-local',
      version: 4,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<HeroState> | undefined;
        const hexStats = looksLikeMockHeroHex(prev?.hexStats)
          ? { ...ZERO_HERO_HEX_STATS }
          : { ...ZERO_HERO_HEX_STATS, ...(prev?.hexStats ?? {}) };
        return {
          ...prev,
          dungeonKeys: prev?.dungeonKeys ?? 0,
          xpForNextLevel: prev?.xpForNextLevel ?? XP_PER_LEVEL,
          habitGrantLogByDate: prev?.habitGrantLogByDate ?? {},
          hexStats,
          hexRevealedThroughDate: prev?.hexRevealedThroughDate ?? null,
          lastMorningFlowDate: prev?.lastMorningFlowDate ?? null,
          loginStreakDays: prev?.loginStreakDays ?? 0,
          morningLoginDates: prev?.morningLoginDates ?? [],
        };
      },
      partialize: (state) => ({
        heroDisplayName: state.heroDisplayName,
        unlockedTitleIds: state.unlockedTitleIds,
        createdAt: state.createdAt,
        gold: state.gold,
        dungeonKeys: state.dungeonKeys,
        playerLevel: state.playerLevel,
        currentLevelXP: state.currentLevelXP,
        xpForNextLevel: state.xpForNextLevel,
        hexStats: state.hexStats,
        hexRevealedThroughDate: state.hexRevealedThroughDate,
        lastMorningFlowDate: state.lastMorningFlowDate,
        loginStreakDays: state.loginStreakDays,
        morningLoginDates: state.morningLoginDates,
        ownedItemIds: state.ownedItemIds,
        equippedOutfitId: state.equippedOutfitId,
        equippedRelicId: state.equippedRelicId,
        bossesDefeated: state.bossesDefeated,
        heroShopPurchaseEver: state.heroShopPurchaseEver,
        heroDailyQuestClaimsDate: state.heroDailyQuestClaimsDate,
        heroDailyQuestClaimedIds: state.heroDailyQuestClaimedIds,
        heroEpicMilestoneClaimedIds: state.heroEpicMilestoneClaimedIds,
        habitGrantLogByDate: state.habitGrantLogByDate,
      }),
    },
  ),
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MOCK_HERO_HEX_STATS } from '@/constants/heroHexStats';
import { sellPriceForRarity } from '@/lib/inventoryEconomy';
import { resolveLootItemById } from '@/lib/itemCatalog';

import type { HeroActions, HeroState, HeroXpReward } from './types';

function todayKey(): string {
  return new Date().toISOString().split('T')[0]!;
}

/** Visual stand-ins until dungeon loot exists. Lucide glyphs, not raster art. */
const DEMO_OWNED_ITEM_IDS = ['wayfarer_cloak', 'ember_charm'] as const;

type HeroStore = HeroState & HeroActions;

export const useHeroStore = create<HeroStore>()(
  persist(
    (set) => ({
      heroDisplayName: null,
      unlockedTitleIds: [],
      createdAt: null,
      gold: 0,
      dungeonKeys: 0,
      playerLevel: 1,
      currentLevelXP: 0,
      xpForNextLevel: 100,
      hexStats: { ...MOCK_HERO_HEX_STATS },
      ownedItemIds: [...DEMO_OWNED_ITEM_IDS],
      equippedOutfitId: null,
      equippedRelicId: null,
      bossesDefeated: 0,
      heroShopPurchaseEver: false,
      heroDailyQuestClaimsDate: null,
      heroDailyQuestClaimedIds: [],
      heroEpicMilestoneClaimedIds: [],

      claimHeroDailyQuest: (questId, goldReward, xpReward) => {
        const today = todayKey();
        let claimed = false;
        set((state) => {
          const priorIds = state.heroDailyQuestClaimsDate === today ? state.heroDailyQuestClaimedIds : [];
          if (priorIds.includes(questId)) return state;
          claimed = true;
          return {
            gold: state.gold + goldReward,
            currentLevelXP: bumpDemoXp(state.currentLevelXP, state.xpForNextLevel, xpReward),
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
            currentLevelXP: bumpDemoXp(state.currentLevelXP, state.xpForNextLevel, xpReward),
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

      addGold: (amount) => {
        if (amount <= 0) return;
        set((state) => ({ gold: state.gold + amount }));
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
    }),
    {
      name: 'hnd-hero-local',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<HeroState> | undefined;
        return {
          ...prev,
          dungeonKeys: prev?.dungeonKeys ?? 0,
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
        ownedItemIds: state.ownedItemIds,
        equippedOutfitId: state.equippedOutfitId,
        equippedRelicId: state.equippedRelicId,
        bossesDefeated: state.bossesDefeated,
        heroShopPurchaseEver: state.heroShopPurchaseEver,
        heroDailyQuestClaimsDate: state.heroDailyQuestClaimsDate,
        heroDailyQuestClaimedIds: state.heroDailyQuestClaimedIds,
        heroEpicMilestoneClaimedIds: state.heroEpicMilestoneClaimedIds,
      }),
    },
  ),
);

function bumpDemoXp(current: number, cap: number, xpReward?: HeroXpReward): number {
  if (!xpReward) return current;
  return Math.min(cap, current + xpReward.amount);
}

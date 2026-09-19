import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ALWAYS_UNLOCKED, MAP_PIN_LOCATIONS } from './catalog';
import type { LocationWindowId, WorldActions, WorldLocationId, WorldState } from './types';
import { clampWorldLevel } from './unlock';

const ALWAYS = [...ALWAYS_UNLOCKED];

type WorldStore = WorldState & WorldActions;

function uniquePush(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids;
  return [...ids, id];
}

function uniqueDrop(ids: string[], id: string): string[] {
  return ids.filter((x) => x !== id);
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set) => ({
      currentScreen: 'map',
      currentLocationId: null,
      currentWindowId: 'approach',
      discoveredLocationIds: [...ALWAYS],
      unlockedLocationIds: [...ALWAYS],
      playerLevel: 1,
      gutterjackCleared: false,

      openHub: (window = 'approach') =>
        set({
          currentScreen: 'hub',
          currentLocationId: 'crownhaven',
          currentWindowId: window,
        }),

      openMap: () => set({ currentScreen: 'map', currentLocationId: null, currentWindowId: 'approach' }),

      openLocation: (id: WorldLocationId, window?: LocationWindowId) =>
        set((state) => {
          if (id === 'crownhaven') {
            return {
              currentScreen: 'hub',
              currentLocationId: 'crownhaven',
              currentWindowId: window ?? 'approach',
              discoveredLocationIds: uniquePush(state.discoveredLocationIds, id),
            };
          }
          return {
            currentScreen: 'location',
            currentLocationId: id,
            currentWindowId: window ?? (id === 'gutterjack' ? 'fight' : 'approach'),
            discoveredLocationIds: uniquePush(state.discoveredLocationIds, id),
          };
        }),

      setWindow: (window: LocationWindowId) => set({ currentWindowId: window }),

      markGutterjackCleared: () =>
        set((state) => ({
          gutterjackCleared: true,
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, 'gutterjack'),
        })),

      setPlayerLevel: (level: number) => set({ playerLevel: clampWorldLevel(level) }),

      unlockLocation: (id: WorldLocationId) =>
        set((state) => ({
          unlockedLocationIds: uniquePush(state.unlockedLocationIds, id),
        })),

      lockLocation: (id: WorldLocationId) =>
        set((state) => {
          if (ALWAYS.includes(id)) return state;
          return { unlockedLocationIds: uniqueDrop(state.unlockedLocationIds, id) };
        }),

      unlockAllLocations: () =>
        set({
          unlockedLocationIds: MAP_PIN_LOCATIONS.map((loc) => loc.id),
        }),

      resetFog: () =>
        set({
          playerLevel: 1,
          unlockedLocationIds: [...ALWAYS],
          discoveredLocationIds: [...ALWAYS],
          gutterjackCleared: false,
          currentScreen: 'map',
          currentLocationId: null,
          currentWindowId: 'approach',
        }),
    }),
    {
      name: 'hnd-world-local',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<WorldState> | undefined;
        return {
          discoveredLocationIds: prev?.discoveredLocationIds?.length ? prev.discoveredLocationIds : [...ALWAYS],
          unlockedLocationIds: prev?.unlockedLocationIds?.length ? prev.unlockedLocationIds : [...ALWAYS],
          playerLevel: clampWorldLevel(prev?.playerLevel ?? 1),
          gutterjackCleared: prev?.gutterjackCleared ?? false,
        };
      },
      partialize: (state) => ({
        discoveredLocationIds: state.discoveredLocationIds,
        unlockedLocationIds: state.unlockedLocationIds,
        playerLevel: state.playerLevel,
        gutterjackCleared: state.gutterjackCleared,
      }),
    },
  ),
);

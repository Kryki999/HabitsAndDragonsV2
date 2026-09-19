import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_REVEALED_REGION_IDS, MAP_FOG_REGIONS } from './layout';
import type { WorldActions, WorldLocationId, WorldState } from './types';

const ALWAYS_DISCOVERED = ['crownhaven'] as const;
const REGION_IDS = new Set(MAP_FOG_REGIONS.map((region) => region.id));

type WorldStore = WorldState & WorldActions;

function uniquePush(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids;
  return [...ids, id];
}

function withCapital(ids: string[]): string[] {
  return uniquePush(ids, 'crownhaven');
}

function asRegionIds(ids: string[] | undefined): string[] {
  const fromSave = (ids ?? []).filter((id) => REGION_IDS.has(id));
  return withCapital([...DEFAULT_REVEALED_REGION_IDS, ...fromSave]);
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set) => ({
      currentScreen: 'map',
      currentLocationId: null,
      discoveredLocationIds: [...ALWAYS_DISCOVERED],
      discoveredRegionIds: [...DEFAULT_REVEALED_REGION_IDS],
      gutterjackCleared: false,

      openHub: () => set({ currentScreen: 'hub', currentLocationId: null }),

      openMap: () => set({ currentScreen: 'map', currentLocationId: null }),

      openLocation: (id: WorldLocationId) =>
        set((state) => ({
          currentScreen: 'location',
          currentLocationId: id,
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, id),
        })),

      markGutterjackCleared: () =>
        set((state) => ({
          gutterjackCleared: true,
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, 'gutterjack'),
        })),

      discoverRegion: (id: string) =>
        set((state) => {
          if (!REGION_IDS.has(id)) return state;
          return { discoveredRegionIds: uniquePush(withCapital(state.discoveredRegionIds), id) };
        }),
    }),
    {
      name: 'hnd-world-local',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<WorldState> | undefined;
        return {
          discoveredLocationIds: prev?.discoveredLocationIds ?? [...ALWAYS_DISCOVERED],
          discoveredRegionIds: asRegionIds(prev?.discoveredRegionIds ?? prev?.discoveredLocationIds),
          gutterjackCleared: prev?.gutterjackCleared ?? false,
        };
      },
      partialize: (state) => ({
        discoveredLocationIds: state.discoveredLocationIds,
        discoveredRegionIds: state.discoveredRegionIds,
        gutterjackCleared: state.gutterjackCleared,
      }),
    },
  ),
);

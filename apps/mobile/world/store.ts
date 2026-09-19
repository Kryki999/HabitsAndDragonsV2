import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WorldActions, WorldLocationId, WorldState } from './types';

const ALWAYS_DISCOVERED = ['crownhaven'] as const;

type WorldStore = WorldState & WorldActions;

function uniquePush(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids;
  return [...ids, id];
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set) => ({
      currentScreen: 'map',
      currentLocationId: null,
      discoveredLocationIds: [...ALWAYS_DISCOVERED],
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
    }),
    {
      name: 'hnd-world-local',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<WorldState> | undefined;
        return {
          discoveredLocationIds: prev?.discoveredLocationIds ?? [...ALWAYS_DISCOVERED],
          gutterjackCleared: prev?.gutterjackCleared ?? false,
        };
      },
      partialize: (state) => ({
        discoveredLocationIds: state.discoveredLocationIds,
        gutterjackCleared: state.gutterjackCleared,
      }),
    },
  ),
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getLocation, isLocationUnlocked } from './content';
import type { LocationId, WorldActions, WorldFlags, WorldState } from './types';

const ALWAYS_DISCOVERED = ['crownhaven'] as const;

const DEFAULT_FLAGS: WorldFlags = {
  gutterjackCleared: false,
};

type WorldStore = WorldState & WorldActions;

function uniquePush(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids;
  return [...ids, id];
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set, get) => ({
      currentLocationId: null,
      discoveredLocationIds: [...ALWAYS_DISCOVERED],
      flags: { ...DEFAULT_FLAGS },

      openMap: () => set({ currentLocationId: null }),

      openHub: () =>
        set((state) => ({
          currentLocationId: 'crownhaven',
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, 'crownhaven'),
        })),

      openLocation: (id: LocationId) => {
        const loc = getLocation(id);
        if (!isLocationUnlocked(loc, get().flags)) return;
        set((state) => ({
          currentLocationId: id,
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, id),
        }));
      },

      goBack: () => {
        const id = get().currentLocationId;
        if (!id) return false;
        const parentId = getLocation(id).parentId;
        if (parentId) {
          get().openLocation(parentId);
        } else {
          set({ currentLocationId: null });
        }
        return true;
      },

      markGutterjackCleared: () =>
        set((state) => ({
          flags: { ...state.flags, gutterjackCleared: true },
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, 'gutterjack'),
        })),
    }),
    {
      name: 'hnd-world-local',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as (Partial<WorldState> & { gutterjackCleared?: boolean }) | undefined;
        return {
          discoveredLocationIds: prev?.discoveredLocationIds ?? [...ALWAYS_DISCOVERED],
          flags: {
            gutterjackCleared:
              prev?.flags?.gutterjackCleared ?? prev?.gutterjackCleared ?? false,
          },
        };
      },
      partialize: (state) => ({
        discoveredLocationIds: state.discoveredLocationIds,
        flags: state.flags,
      }),
    },
  ),
);

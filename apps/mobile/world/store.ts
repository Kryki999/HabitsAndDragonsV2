import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  dungeonFloorById,
  dungeonForHotspot,
  getLocationHotspot,
  isDungeonFloorUnlocked,
} from './content';
import { INTERIORS, floorById, isFloorOpen, resolveFloorId, type InteriorFloorId } from './interiors';
import { DEFAULT_REVEALED_REGION_IDS, MAP_FOG_REGIONS } from './layout';
import type { MapLocationId, WorldActions, WorldInteriorId, WorldState } from './types';

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

function asClearedEncounterIds(
  ids: string[] | undefined,
  gutterjackCleared: boolean | undefined,
): string[] {
  const next = [...(ids ?? [])];
  if (gutterjackCleared) return uniquePush(next, 'gutterjack');
  return next;
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set) => ({
      currentScreen: 'map',
      currentInteriorId: null,
      currentFloorId: null,
      currentLocationId: null,
      currentHotspotId: null,
      discoveredLocationIds: [...ALWAYS_DISCOVERED],
      discoveredRegionIds: [...DEFAULT_REVEALED_REGION_IDS],
      clearedEncounterIds: [],
      gutterjackCleared: false,
      encounterCooldownUntil: {},

      openHub: () =>
        set({
          currentScreen: 'hub',
          currentInteriorId: null,
          currentFloorId: null,
          currentLocationId: null,
          currentHotspotId: null,
        }),

      openMap: () =>
        set({
          currentScreen: 'map',
          currentInteriorId: null,
          currentFloorId: null,
          currentLocationId: null,
          currentHotspotId: null,
        }),

      openInterior: (id: WorldInteriorId, floorId?: InteriorFloorId) =>
        set((state) => {
          const interior = INTERIORS[id];
          const nextFloor = resolveFloorId(interior, floorId);
          let discovered = uniquePush(state.discoveredLocationIds, id);
          if (nextFloor === 'cellar') discovered = uniquePush(discovered, 'gutterjack');
          return {
            currentScreen: 'interior',
            currentInteriorId: id,
            currentFloorId: nextFloor,
            currentLocationId: null,
            currentHotspotId: null,
            discoveredLocationIds: discovered,
          };
        }),

      setFloor: (id: InteriorFloorId) =>
        set((state) => {
          if (state.currentScreen === 'interior' && state.currentInteriorId) {
            const interior = INTERIORS[state.currentInteriorId];
            const floor = floorById(interior, id);
            if (!floor || !isFloorOpen(floor)) return state;
            if (floor.id === state.currentFloorId) return state;
            let discovered = state.discoveredLocationIds;
            if (floor.id === 'cellar') discovered = uniquePush(discovered, 'gutterjack');
            return { currentFloorId: floor.id, discoveredLocationIds: discovered };
          }

          if (state.currentScreen === 'encounter' && state.currentLocationId) {
            const hotspot = getLocationHotspot(state.currentLocationId, state.currentHotspotId);
            const dungeon = dungeonForHotspot(hotspot);
            if (!dungeon) return state;
            const floor = dungeonFloorById(dungeon, id);
            if (floor.id !== id) return state;
            if (!isDungeonFloorUnlocked(floor, state.clearedEncounterIds)) return state;
            if (floor.id === state.currentFloorId) return state;
            return { currentFloorId: floor.id };
          }

          return state;
        }),

      openLocation: (id: MapLocationId) =>
        set((state) => ({
          currentScreen: 'location',
          currentLocationId: id,
          currentHotspotId: null,
          currentInteriorId: null,
          currentFloorId: null,
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, id),
        })),

      openHotspot: (locationId: MapLocationId, hotspotId: string) =>
        set((state) => {
          const hotspot = getLocationHotspot(locationId, hotspotId);
          const dungeon = dungeonForHotspot(hotspot);
          return {
            currentScreen: 'encounter',
            currentLocationId: locationId,
            currentHotspotId: hotspot?.id ?? hotspotId,
            currentInteriorId: null,
            currentFloorId: dungeon?.defaultFloorId ?? null,
            discoveredLocationIds: uniquePush(state.discoveredLocationIds, locationId),
          };
        }),

      closeEncounter: () =>
        set((state) => ({
          currentScreen: 'location',
          currentLocationId: state.currentLocationId,
          currentHotspotId: null,
          currentFloorId: null,
        })),

      markGutterjackCleared: () =>
        set((state) => ({
          gutterjackCleared: true,
          clearedEncounterIds: uniquePush(state.clearedEncounterIds, 'gutterjack'),
          discoveredLocationIds: uniquePush(state.discoveredLocationIds, 'gutterjack'),
        })),

      markEncounterCleared: (id: string) =>
        set((state) => ({
          clearedEncounterIds: uniquePush(state.clearedEncounterIds, id),
          gutterjackCleared: id === 'gutterjack' ? true : state.gutterjackCleared,
        })),

      startEncounterCooldown: (encounterId, durationMs) =>
        set((state) => ({
          encounterCooldownUntil: {
            ...(state.encounterCooldownUntil ?? {}),
            [encounterId]: new Date(Date.now() + Math.max(0, durationMs)).toISOString(),
          },
        })),

      clearEncounterCooldowns: () => set({ encounterCooldownUntil: {} }),

      discoverRegion: (id: string) =>
        set((state) => {
          if (!REGION_IDS.has(id)) return state;
          return { discoveredRegionIds: uniquePush(withCapital(state.discoveredRegionIds), id) };
        }),

      revealAllMap: () =>
        set((state) => {
          const regionIds = [...REGION_IDS];
          let locations = withCapital(state.discoveredLocationIds);
          for (const id of regionIds) locations = uniquePush(locations, id);
          return {
            discoveredRegionIds: withCapital(regionIds),
            discoveredLocationIds: locations,
          };
        }),

      resetWorldDiscovery: () =>
        set({
          currentScreen: 'map',
          currentInteriorId: null,
          currentFloorId: null,
          currentLocationId: null,
          currentHotspotId: null,
          discoveredLocationIds: [...ALWAYS_DISCOVERED],
          discoveredRegionIds: [...DEFAULT_REVEALED_REGION_IDS],
          clearedEncounterIds: [],
          gutterjackCleared: false,
          encounterCooldownUntil: {},
        }),
    }),
    {
      name: 'hnd-world-local',
      version: 6,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const prev = persisted as Partial<WorldState> | undefined;
        const clearedEncounterIds = asClearedEncounterIds(
          prev?.clearedEncounterIds,
          prev?.gutterjackCleared,
        );
        return {
          discoveredLocationIds: prev?.discoveredLocationIds ?? [...ALWAYS_DISCOVERED],
          discoveredRegionIds: asRegionIds(prev?.discoveredRegionIds ?? prev?.discoveredLocationIds),
          clearedEncounterIds,
          gutterjackCleared: prev?.gutterjackCleared ?? clearedEncounterIds.includes('gutterjack'),
          encounterCooldownUntil: prev?.encounterCooldownUntil ?? {},
        };
      },
      partialize: (state) => ({
        discoveredLocationIds: state.discoveredLocationIds,
        discoveredRegionIds: state.discoveredRegionIds,
        clearedEncounterIds: state.clearedEncounterIds,
        gutterjackCleared: state.gutterjackCleared,
        encounterCooldownUntil: state.encounterCooldownUntil,
      }),
    },
  ),
);

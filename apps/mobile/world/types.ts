import type { InteriorFloorId, WorldInteriorId } from './interiors';

export type { InteriorFloorId, WorldInteriorId };

export type WorldView = 'hub' | 'map' | 'interior' | 'location' | 'encounter';

export type MapLocationId =
  | 'smugglers-teeth'
  | 'crown-approaches'
  | 'anvil-glade'
  | 'closed-way'
  | 'raven-castle'
  | 'pallglass'
  | 'vampire-house'
  | 'water-temple'
  | 'pyramid'
  | 'ananiel';

export type WorldState = {
  currentScreen: WorldView;
  currentInteriorId: WorldInteriorId | null;
  currentFloorId: InteriorFloorId | null;
  currentLocationId: MapLocationId | null;
  /** Hotspot on the current location still (npc or dungeon). */
  currentHotspotId: string | null;
  /** Location ids the player has seen. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  /** Kingdom-map fog holes that have opened. Crownhaven starts clear. */
  discoveredRegionIds: string[];
  /** Boss encounter ids that have been first-cleared. */
  clearedEncounterIds: string[];
  gutterjackCleared: boolean;
  /** ISO timestamp when free entry is ready again, per encounter id. */
  encounterCooldownUntil: Record<string, string>;
};

export type WorldActions = {
  openHub: () => void;
  openMap: () => void;
  openInterior: (id: WorldInteriorId, floorId?: InteriorFloorId) => void;
  setFloor: (id: InteriorFloorId) => void;
  openLocation: (id: MapLocationId) => void;
  openHotspot: (locationId: MapLocationId, hotspotId: string) => void;
  closeEncounter: () => void;
  markGutterjackCleared: () => void;
  markEncounterCleared: (id: string) => void;
  startEncounterCooldown: (encounterId: string, durationMs: number) => void;
  clearEncounterCooldowns: () => void;
  discoverRegion: (id: string) => void;
  /** Opens every fog region and marks map pins discovered. */
  revealAllMap: () => void;
  /** Fog + location flags back to first launch. Navigation returns to the map. */
  resetWorldDiscovery: () => void;
};

import type { InteriorFloorId } from './interiors';

export type WorldView = 'hub' | 'map' | 'interior' | 'location' | 'encounter';

export type WorldInteriorId = 'tavern';

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
  /** Location ids the player has seen. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  /** Kingdom-map fog holes that have opened. Crownhaven starts clear. */
  discoveredRegionIds: string[];
  /** Boss encounter ids that have been first-cleared. */
  clearedEncounterIds: string[];
  gutterjackCleared: boolean;
};

export type WorldActions = {
  openHub: () => void;
  openMap: () => void;
  openInterior: (id: WorldInteriorId, floorId?: InteriorFloorId) => void;
  setFloor: (id: InteriorFloorId) => void;
  openLocation: (id: MapLocationId) => void;
  openEncounter: (id: MapLocationId) => void;
  closeEncounter: () => void;
  markGutterjackCleared: () => void;
  markEncounterCleared: (id: string) => void;
  discoverRegion: (id: string) => void;
};

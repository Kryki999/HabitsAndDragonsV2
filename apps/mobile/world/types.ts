import type { InteriorFloorId } from './interiors';

export type WorldView = 'hub' | 'map' | 'interior';

export type WorldInteriorId = 'tavern';

export type WorldState = {
  currentScreen: WorldView;
  currentInteriorId: WorldInteriorId | null;
  currentFloorId: InteriorFloorId | null;
  /** Location ids the player has seen. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  /** Kingdom-map fog holes that have opened. Crownhaven starts clear. */
  discoveredRegionIds: string[];
  gutterjackCleared: boolean;
};

export type WorldActions = {
  openHub: () => void;
  openMap: () => void;
  openInterior: (id: WorldInteriorId, floorId?: InteriorFloorId) => void;
  setFloor: (id: InteriorFloorId) => void;
  markGutterjackCleared: () => void;
  discoverRegion: (id: string) => void;
};

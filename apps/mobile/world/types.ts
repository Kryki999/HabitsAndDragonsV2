export type WorldView = 'hub' | 'map' | 'location';

/** Playground locations. Hub cellar only — not a fog-map pin. */
export type WorldLocationId = 'gutterjack';

export type WorldState = {
  currentScreen: WorldView;
  currentLocationId: WorldLocationId | null;
  /** Location ids the player has seen. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  /** Kingdom-map fog holes that have opened. Crownhaven starts clear. */
  discoveredRegionIds: string[];
  gutterjackCleared: boolean;
};

export type WorldActions = {
  openHub: () => void;
  openMap: () => void;
  openLocation: (id: WorldLocationId) => void;
  markGutterjackCleared: () => void;
  discoverRegion: (id: string) => void;
};

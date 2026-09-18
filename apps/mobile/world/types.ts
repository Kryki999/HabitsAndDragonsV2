export type WorldView = 'hub' | 'map' | 'location';

/** Playground locations. Hub cellar only — not a fog-map pin. */
export type WorldLocationId = 'gutterjack';

export type WorldState = {
  currentScreen: WorldView;
  currentLocationId: WorldLocationId | null;
  /** Location ids the player has seen. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  gutterjackCleared: boolean;
};

export type WorldActions = {
  openHub: () => void;
  openMap: () => void;
  openLocation: (id: WorldLocationId) => void;
  markGutterjackCleared: () => void;
};

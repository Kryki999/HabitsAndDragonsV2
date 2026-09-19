export type WorldView = 'hub' | 'map' | 'location';

/** Playground locations. Gutterjack is hub-internal — not a fog-map pin. */
export type WorldLocationId =
  | 'crownhaven'
  | 'gutterjack'
  | 'smugglers-teeth'
  | 'crown-approaches'
  | 'anvil-glade'
  | 'closed-way'
  | 'pallglass'
  | 'still-tide'
  | 'crimson-press'
  | 'raven-keep'
  | 'osiris'
  | 'ananiel';

export type LocationWindowId =
  | 'approach'
  | 'tavern'
  | 'npc'
  | 'fight'
  | 'fightElite'
  | 'fightChampion';

export type WorldState = {
  currentScreen: WorldView;
  currentLocationId: WorldLocationId | null;
  currentWindowId: LocationWindowId;
  /** Location ids the player has opened. Crownhaven starts discovered. */
  discoveredLocationIds: string[];
  /**
   * Manual unlock set (DEV, later: discover). Crownhaven always starts here.
   * Fog also clears when playerLevel >= the location's unlockLevel.
   */
  unlockedLocationIds: string[];
  /** Fog / map gate. World playground only — not the Hero XP ring. */
  playerLevel: number;
  gutterjackCleared: boolean;
};

export type WorldActions = {
  openHub: (window?: LocationWindowId) => void;
  openMap: () => void;
  openLocation: (id: WorldLocationId, window?: LocationWindowId) => void;
  setWindow: (window: LocationWindowId) => void;
  markGutterjackCleared: () => void;
  setPlayerLevel: (level: number) => void;
  unlockLocation: (id: WorldLocationId) => void;
  lockLocation: (id: WorldLocationId) => void;
  unlockAllLocations: () => void;
  resetFog: () => void;
};

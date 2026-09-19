export type LocationKind = 'hub' | 'side' | 'main' | 'dungeon';

export type LocationId =
  | 'crownhaven'
  | 'crownhaven-tavern'
  | 'gutterjack'
  | 'smugglers-teeth'
  | 'crown-approaches'
  | 'anvil-glade'
  | 'closed-way'
  | 'pallglass-spire'
  | 'long-amen'
  | 'tideglass-isle'
  | 'ravenhold'
  | 'alsah-dunes'
  | 'ananiel-tower';

/** Thin client progress — expand later (level, active days, ★ clears). */
export type WorldFlag = 'gutterjackCleared';

export type WorldFlags = Record<WorldFlag, boolean>;

export type UnlockRule =
  | { type: 'start' }
  | { type: 'flag'; flag: WorldFlag }
  /** Content is in the table; stays fogged until a later slice. */
  | { type: 'locked'; note?: string };

export type LocationView = 'hub' | 'still' | 'gutterjack';

export type WorldState = {
  /** `null` = kingdom map. */
  currentLocationId: LocationId | null;
  discoveredLocationIds: string[];
  flags: WorldFlags;
};

export type WorldActions = {
  openMap: () => void;
  openHub: () => void;
  openLocation: (id: LocationId) => void;
  goBack: () => boolean;
  markGutterjackCleared: () => void;
};

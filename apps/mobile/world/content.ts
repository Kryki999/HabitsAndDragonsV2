import type { ImageSourcePropType } from 'react-native';

import type { HotspotIconName, PinIconName } from './icons';
import type { LocationId, LocationKind, LocationView, UnlockRule, WorldFlags } from './types';

/**
 * Act 1 world content table — single source of truth for locations.
 *
 * How to add a location row
 * -------------------------
 * 1. Drop a PNG in `apps/mobile/assets/images/` (close-up: 941×1672; map is 1254²).
 * 2. Add the id to `LocationId` in `types.ts`.
 * 3. Append a row to `LOCATIONS` below:
 *    `id`, `displayName`, `kind`, `parentId`, `unlock`, `asset`, `view`.
 * 4. Kingdom-map pin: set `mapPin` `{ x, y, icon }` in **normalized 0–1** map space.
 *    Interior / floor: omit `mapPin`, set `parentId`, and put `floors` on the building root
 *    (see Crownhaven tavern: Parter → Gutterjack cellar).
 * 5. Unlock stub: `{ type: 'start' }` | `{ type: 'flag', flag: 'gutterjackCleared' }`
 *    | `{ type: 'locked', note: '…' }`. Fog uses this. Do not hardcode pins in screens.
 * 6. `view`: `'hub'` (hotspots) · `'gutterjack'` (tutorial sheet) · `'still'` (art + icon nav).
 * 7. Typecheck. No new screen file unless the place needs custom UI.
 */

export const CLOSEUP_INTRINSIC = { width: 941, height: 1672 } as const;

export const KINGDOM_MAP = {
  asset: require('@/assets/images/world-map.png') as ImageSourcePropType,
  intrinsic: { width: 1254, height: 1254 } as const,
};

export type MapPinDef = {
  x: number;
  y: number;
  icon: PinIconName;
  /** Fog blob radius as a fraction of map size when this pin is locked. */
  fogRadius?: number;
};

export type LocationHotspotDef = {
  id: string;
  label: string;
  hint?: string;
  x: number;
  y: number;
  icon: HotspotIconName;
  targetId?: LocationId;
  comingSoon?: boolean;
};

export type ExtraStillDef = {
  id: string;
  displayName: string;
  asset: ImageSourcePropType;
};

export type LocationDef = {
  id: LocationId;
  displayName: string;
  /** HUD eyebrow — not a nav link. */
  kicker?: string;
  kind: LocationKind;
  /** Parent place to walk back to. `null` = kingdom map. */
  parentId: LocationId | null;
  /**
   * Ordered floors of this building (root row only).
   * Example: tavern ground → cellar. Stairs icons walk this list.
   */
  floors?: LocationId[];
  unlock: UnlockRule;
  asset: ImageSourcePropType;
  intrinsic: { width: number; height: number };
  view: LocationView;
  mapPin?: MapPinDef;
  hotspots?: LocationHotspotDef[];
  /** Encounter / NPC stills — catalogued, not navigable this slice. */
  extraAssets?: ExtraStillDef[];
};

export const LOCATIONS: LocationDef[] = [
  {
    id: 'crownhaven',
    displayName: 'Crownhaven',
    kicker: 'Capital',
    kind: 'hub',
    parentId: null,
    unlock: { type: 'start' },
    asset: require('@/assets/images/crownhaven.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'hub',
    mapPin: { x: 0.5, y: 0.4, icon: 'castle', fogRadius: 0.2 },
    hotspots: [
      {
        id: 'tavern',
        label: 'Tavern',
        hint: 'Gutterjack',
        x: 0.88,
        y: 0.78,
        icon: 'wine',
        targetId: 'crownhaven-tavern',
      },
      {
        id: 'market',
        label: 'Market',
        hint: 'Soon',
        x: 0.18,
        y: 0.83,
        icon: 'store',
        comingSoon: true,
      },
      {
        id: 'palace',
        label: 'Palace',
        hint: 'Soon',
        x: 0.5,
        y: 0.24,
        icon: 'castle',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'crownhaven-tavern',
    displayName: 'Tavern',
    kicker: 'Ground floor',
    kind: 'hub',
    parentId: 'crownhaven',
    floors: ['crownhaven-tavern', 'gutterjack'],
    unlock: { type: 'start' },
    asset: require('@/assets/images/tavernsage.png') as ImageSourcePropType,
    intrinsic: { width: 1678, height: 937 },
    view: 'still',
  },
  {
    id: 'gutterjack',
    displayName: 'Gutterjack',
    kicker: 'Cellar',
    kind: 'dungeon',
    parentId: 'crownhaven-tavern',
    unlock: { type: 'start' },
    asset: require('@/assets/images/mietek.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'gutterjack',
    hotspots: [
      {
        id: 'stairs-up',
        label: 'Up',
        x: 0.36,
        y: 0.2,
        icon: 'stairsUp',
        targetId: 'crownhaven-tavern',
      },
    ],
  },
  {
    id: 'smugglers-teeth',
    displayName: "Smuggler's Teeth",
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'flag', flag: 'gutterjackCleared' },
    asset: require('@/assets/images/piraci.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.2, y: 0.74, icon: 'anchor', fogRadius: 0.13 },
    extraAssets: [
      {
        id: 'saltbone-crew',
        displayName: 'Saltbone Crew',
        asset: require('@/assets/images/pirates.png') as ImageSourcePropType,
      },
      {
        id: 'captain-marrow',
        displayName: 'Captain Marrow',
        asset: require('@/assets/images/marrow.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'crown-approaches',
    displayName: 'Crown Approaches',
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'locked', note: 'R1 — after first discover point (later).' },
    asset: require('@/assets/images/przedmiescia.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.4, y: 0.68, icon: 'shield', fogRadius: 0.1 },
    extraAssets: [
      {
        id: 'inkless-band',
        displayName: 'Inkless Band',
        asset: require('@/assets/images/rozbojnicy.png') as ImageSourcePropType,
      },
      {
        id: 'rook',
        displayName: 'Rook',
        asset: require('@/assets/images/herszt.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'anvil-glade',
    displayName: 'Anvil Glade',
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'locked', note: 'R1 — player-chosen order (later).' },
    asset: require('@/assets/images/las.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.64, y: 0.64, icon: 'hammer', fogRadius: 0.11 },
    extraAssets: [
      {
        id: 'torrik',
        displayName: 'Torrik',
        asset: require('@/assets/images/krasnolud.png') as ImageSourcePropType,
      },
      {
        id: 'stillgaze',
        displayName: 'Stillgaze',
        asset: require('@/assets/images/bazyliszek.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'closed-way',
    displayName: 'The Closed Way',
    kicker: 'Main ★1',
    kind: 'main',
    parentId: null,
    unlock: { type: 'locked', note: 'Champion ★1 — level + prior sides (later).' },
    asset: require('@/assets/images/zakazanylas.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.66, y: 0.3, icon: 'trees', fogRadius: 0.11 },
    extraAssets: [
      {
        id: 'skarne',
        displayName: 'Skarne',
        asset: require('@/assets/images/przewodniklas.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'pallglass-spire',
    displayName: 'Pallglass Spire',
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'locked', note: 'R2 — after ≥2 R1 discoveries (later).' },
    asset: require('@/assets/images/palantirtower.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.84, y: 0.43, icon: 'sparkles', fogRadius: 0.1 },
    extraAssets: [
      {
        id: 'miro',
        displayName: 'Miro',
        asset: require('@/assets/images/mage.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'long-amen',
    displayName: 'Long Amen Cathedral',
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'locked', note: 'R2 seed — cathedral / vampire (later).' },
    asset: require('@/assets/images/wampirhouse.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.58, y: 0.88, icon: 'church', fogRadius: 0.11 },
    extraAssets: [
      {
        id: 'vampire-cleric',
        displayName: 'Vampire Cleric',
        asset: require('@/assets/images/vampire.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'tideglass-isle',
    displayName: 'Tideglass Isle',
    kicker: 'Side',
    kind: 'side',
    parentId: null,
    unlock: { type: 'locked', note: 'R2 seed — water spirit isle (later).' },
    asset: require('@/assets/images/watertemple.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.2, y: 0.44, icon: 'waves', fogRadius: 0.12 },
    extraAssets: [
      {
        id: 'tide-spirit',
        displayName: 'Tide Spirit',
        asset: require('@/assets/images/waterboss.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'ravenhold',
    displayName: 'Ravenhold',
    kicker: 'Main ★2',
    kind: 'main',
    parentId: null,
    unlock: { type: 'locked', note: 'Champion ★2 — after ★1 (later).' },
    asset: require('@/assets/images/ravencastle.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.82, y: 0.13, icon: 'bird', fogRadius: 0.11 },
    extraAssets: [
      {
        id: 'raven-monk',
        displayName: 'Raven Monk',
        asset: require('@/assets/images/mnich.png') as ImageSourcePropType,
      },
      {
        id: 'raven-monk-elite',
        displayName: 'Raven Monk Elite',
        asset: require('@/assets/images/elitamnich.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'alsah-dunes',
    displayName: 'Alsah Dunes',
    kicker: 'Main ★3',
    kind: 'main',
    parentId: null,
    unlock: { type: 'locked', note: 'Champion ★3 Osiris — after ★2 (later).' },
    asset: require('@/assets/images/piramid.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.24, y: 0.14, icon: 'mountain', fogRadius: 0.12 },
    extraAssets: [
      {
        id: 'cult-elite',
        displayName: 'Embalmed Cultist',
        asset: require('@/assets/images/pyramid_elite.png') as ImageSourcePropType,
      },
      {
        id: 'osiris',
        displayName: 'Osiris',
        asset: require('@/assets/images/oziris.png') as ImageSourcePropType,
      },
    ],
  },
  {
    id: 'ananiel-tower',
    displayName: "Ananiel's Tower",
    kicker: 'Titan',
    kind: 'main',
    parentId: null,
    unlock: { type: 'locked', note: 'Titan — Act 1 climax (later).' },
    asset: require('@/assets/images/ananieltower.png') as ImageSourcePropType,
    intrinsic: CLOSEUP_INTRINSIC,
    view: 'still',
    mapPin: { x: 0.08, y: 0.1, icon: 'landmark', fogRadius: 0.12 },
    extraAssets: [
      {
        id: 'ananiel',
        displayName: 'Ananiel',
        asset: require('@/assets/images/ananiel.png') as ImageSourcePropType,
      },
      {
        id: 'ananiel-elite',
        displayName: 'Ananiel Elite',
        asset: require('@/assets/images/eliteananiel.png') as ImageSourcePropType,
      },
    ],
  },
];

export const LOCATION_BY_ID: Record<LocationId, LocationDef> = LOCATIONS.reduce(
  (acc, loc) => {
    acc[loc.id] = loc;
    return acc;
  },
  {} as Record<LocationId, LocationDef>,
);

export function getLocation(id: LocationId): LocationDef {
  return LOCATION_BY_ID[id];
}

export function isLocationUnlocked(loc: LocationDef, flags: WorldFlags): boolean {
  switch (loc.unlock.type) {
    case 'start':
      return true;
    case 'flag':
      return flags[loc.unlock.flag];
    case 'locked':
      return false;
  }
}

export function getFloors(id: LocationId): LocationId[] {
  let loc: LocationDef | undefined = LOCATION_BY_ID[id];
  while (loc) {
    if (loc.floors?.length) return loc.floors;
    loc = loc.parentId ? LOCATION_BY_ID[loc.parentId] : undefined;
  }
  return [];
}

export function floorNeighbors(id: LocationId): { up?: LocationId; down?: LocationId } {
  const floors = getFloors(id);
  const index = floors.indexOf(id);
  if (index < 0) return {};
  return {
    up: index > 0 ? floors[index - 1] : undefined,
    down: index < floors.length - 1 ? floors[index + 1] : undefined,
  };
}

export const MAP_PIN_LOCATIONS = LOCATIONS.filter((loc): loc is LocationDef & { mapPin: MapPinDef } =>
  Boolean(loc.mapPin),
);

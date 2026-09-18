import type { ImageSourcePropType } from 'react-native';

import type { WorldLocationId } from './types';

/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Anchor = pin tip / hotspot center. Tune by editing this file only.
 *
 * How to retune
 * -------------
 * 1. Replace the PNG in `apps/mobile/assets/images/world/` (keep the filename).
 * 2. Update `MAP_INTRINSIC` / `HUB_INTRINSIC` if the pixel size changed.
 * 3. Nudge `x` / `y` below. 0.01 ≈ 1% of the still.
 * 4. Optional probe: on the Map screen, long-press the art. A readout shows
 *    the normalized coordinate under your finger.
 *
 * Upload note (this slice)
 * ------------------------
 * The three stills arrived truncated (~top 28–34% of pixels, rest black).
 * Coordinates below assume the *intended* full composition from the Concept
 * Bible (Crownhaven in the square's middle; hub = palace top / stall left /
 * tavern right). When the owner drops complete PNGs, retune — especially
 * Crownhaven / Gutterjack map pins and the tavern hotspot.
 */

export const WORLD_ART = {
  map: require('@/assets/images/world/map-kingdom.png') as ImageSourcePropType,
  hub: require('@/assets/images/world/hub-crownhaven.png') as ImageSourcePropType,
  gutterjack: require('@/assets/images/world/dungeon-gutterjack.png') as ImageSourcePropType,
};

export const MAP_INTRINSIC = { width: 1254, height: 1254 } as const;
export const HUB_INTRINSIC = { width: 941, height: 1672 } as const;
export const GUTTERJACK_INTRINSIC = { width: 941, height: 1672 } as const;

export type MapPinKind = 'home' | 'dungeon' | 'locked';

export type MapPinDef = {
  id: string;
  label: string;
  /** Short chip under the name (e.g. Home, Locked). */
  chip: string;
  x: number;
  y: number;
  kind: MapPinKind;
  /** Hub cellar — playground shortcut from the map. Bible: not a fog pin. */
  opens?: 'hub' | WorldLocationId;
};

/**
 * Kingdom orbit pins.
 *
 * Visible in the truncated map (top ~28%): Titan tower (NW), pyramid, NE
 * forest castle, basilisk-eye grove, a red-roof sliver at bottom-center of
 * the live strip — likely the *north* edge of Crownhaven.
 *
 * Crownhaven is placed just below that sliver (center of the square).
 * Gutterjack sits slightly east of the city (tavern in the capital).
 * Teeth = SW coast. Approaches = south gate / fields.
 */
export const KINGDOM_PINS: MapPinDef[] = [
  {
    id: 'crownhaven',
    label: 'Crownhaven',
    chip: 'Home',
    x: 0.5,
    y: 0.46,
    kind: 'home',
    opens: 'hub',
  },
  {
    id: 'gutterjack',
    label: 'Gutterjack',
    chip: 'Tavern cellar',
    x: 0.57,
    y: 0.5,
    kind: 'dungeon',
    opens: 'gutterjack',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    chip: 'Locked',
    x: 0.22,
    y: 0.74,
    kind: 'locked',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    chip: 'Locked',
    x: 0.66,
    y: 0.68,
    kind: 'locked',
  },
];

export type HubHotspotAction = 'gutterjack' | 'comingSoon';

export type HubHotspotDef = {
  id: 'tavern' | 'market' | 'castle';
  label: string;
  hint: string;
  x: number;
  y: number;
  action: HubHotspotAction;
};

/**
 * Crownhaven close-up hotspots (same 9:16 language as the bible):
 * palace on the hill, stall left, tavern / chalice right, fountain mid.
 * The attached hub PNG currently shows the palace + tavern roof (top ~28%).
 */
export const HUB_HOTSPOTS: HubHotspotDef[] = [
  {
    id: 'tavern',
    label: 'Tavern',
    hint: 'Gutterjack',
    x: 0.82,
    y: 0.56,
    action: 'gutterjack',
  },
  {
    id: 'market',
    label: 'Market',
    hint: 'Coming soon',
    x: 0.2,
    y: 0.74,
    action: 'comingSoon',
  },
  {
    id: 'castle',
    label: 'Palace',
    hint: 'Coming soon',
    x: 0.42,
    y: 0.16,
    action: 'comingSoon',
  },
];

export const GUTTERJACK_COPY = {
  kicker: 'Common · Tutorial',
  title: 'Gutterjack',
  blurb:
    'The sot who took the wine vault. Once a family restaurant. Now he sits a barrel-throne with a smashed-bottle tulip and will not give the cellar back.',
  enter: 'Enter',
  back: 'Back',
  fightKicker: 'Tutorial fight · 100% win',
  fightBlurb: 'No combat engine in this playground. Tap victory — Gutterjack always falls the first time.',
  victory: 'Victory (tutorial)',
  clearedKicker: 'Cleared',
  clearedBlurb: 'The cellar is yours. The tavern can breathe again — for now. Common farm comes later.',
  backToHub: 'Back to Crownhaven',
} as const;

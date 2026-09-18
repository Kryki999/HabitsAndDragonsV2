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
 * Art ingest
 * ----------
 * Cursor chat attachments cap at **768KB** (exactly 786432 bytes). Owner PNG
 * stills (~2MB+) arrive truncated: IHDR is full size, IDAT stops ~28–34% down,
 * lower canvas is black, no IEND. Do **not** commit those copies.
 *
 * To land complete stills: commit the PNGs from a local clone, **or** re-export
 * JPEG/WebP so the *whole* frame is under ~700KB and re-attach.
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
 * Kingdom orbit pins (square map, Crownhaven in the middle).
 *
 * Live top strip of the truncated file: Titan tower NW, pyramid, NE forest
 * castle, basilisk-eye grove, red-roof sliver at ~y=0.26 = north edge of
 * Crownhaven. Pins below assume the **full** square: city center, SW coast,
 * south approaches. Re-probe after complete art lands.
 */
export const KINGDOM_PINS: MapPinDef[] = [
  {
    id: 'crownhaven',
    label: 'Crownhaven',
    chip: 'Home',
    x: 0.5,
    y: 0.48,
    kind: 'home',
    opens: 'hub',
  },
  {
    id: 'gutterjack',
    label: 'Gutterjack',
    chip: 'Tavern cellar',
    x: 0.58,
    y: 0.52,
    kind: 'dungeon',
    opens: 'gutterjack',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    chip: 'Locked',
    x: 0.18,
    y: 0.78,
    kind: 'locked',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    chip: 'Locked',
    x: 0.62,
    y: 0.72,
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
 * Crownhaven close-up (9:16): palace on the hill, stall left, tavern/chalice right.
 *
 * Palace lower gate + stairs is in the live top strip (~y=0.23).
 * Tavern **doors** and market stall sit in the lower two-thirds — coordinates
 * match that composition (chalice building right, veg stall left). Re-probe
 * with the long-press readout once a complete hub PNG is in the bundle.
 */
export const HUB_HOTSPOTS: HubHotspotDef[] = [
  {
    id: 'tavern',
    label: 'Tavern',
    hint: 'Gutterjack',
    x: 0.84,
    y: 0.8,
    action: 'gutterjack',
  },
  {
    id: 'market',
    label: 'Market',
    hint: 'Coming soon',
    x: 0.18,
    y: 0.78,
    action: 'comingSoon',
  },
  {
    id: 'castle',
    label: 'Palace',
    hint: 'Coming soon',
    x: 0.4,
    y: 0.23,
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

import type { ImageSourcePropType } from 'react-native';

import type { WorldLocationId } from './types';

/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Map pins: anchor = stem tip on the landmark. Hub hotspots: (x, y) is below the
 * icon (icon sits ~0.05 above y on a 430px-wide 9:16 stage). Tune this file only.
 *
 * How to retune
 * -------------
 * 1. Replace the JPEG in `apps/mobile/assets/images/world/` (keep the filename).
 * 2. Update `MAP_INTRINSIC` / `HUB_INTRINSIC` if the pixel size changed.
 * 3. Nudge `x` / `y` below. 0.01 ≈ 1% of the still.
 * 4. Optional probe: on the Map screen, long-press the art. A readout shows
 *    the normalized coordinate under your finger.
 *
 * Art ingest
 * ----------
 * Cursor chat PNG attachments cap at **768KB** (exactly 786432 bytes) and arrive
 * truncated (full IHDR, black lower canvas, no IEND). Ship **JPEG/WebP under
 * ~700KB** so the whole frame lands. Current stills are complete JPEGs
 * (~213–410KB, live bottoms, 1254² map / 941×1672 hub & cellar).
 */

export const WORLD_ART = {
  map: require('@/assets/images/world/map-kingdom.jpg') as ImageSourcePropType,
  hub: require('@/assets/images/world/hub-crownhaven.jpg') as ImageSourcePropType,
  gutterjack: require('@/assets/images/world/dungeon-gutterjack.jpg') as ImageSourcePropType,
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
 * Landmarks on the full still: keep on the central hill, terracotta town,
 * wrecked ship in the SW cove, watchtower + stone bridge on the south road.
 */
export const KINGDOM_PINS: MapPinDef[] = [
  {
    id: 'crownhaven',
    label: 'Crownhaven',
    chip: 'Home',
    x: 0.52,
    y: 0.35,
    kind: 'home',
    opens: 'hub',
  },
  {
    id: 'gutterjack',
    label: 'Gutterjack',
    chip: 'Tavern cellar',
    x: 0.58,
    y: 0.5,
    kind: 'dungeon',
    opens: 'gutterjack',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    chip: 'Locked',
    x: 0.22,
    y: 0.7,
    kind: 'locked',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    chip: 'Locked',
    x: 0.54,
    y: 0.63,
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
 * Palace = gold-trimmed entrance doors up the stairs. Tavern = arched doors of
 * the chalice-sign building (right). Market = veg crates under the striped awning.
 */
export const HUB_HOTSPOTS: HubHotspotDef[] = [
  {
    id: 'tavern',
    label: 'Tavern',
    hint: 'Gutterjack',
    x: 0.88,
    y: 0.78,
    action: 'gutterjack',
  },
  {
    id: 'market',
    label: 'Market',
    hint: 'Coming soon',
    x: 0.18,
    y: 0.83,
    action: 'comingSoon',
  },
  {
    id: 'castle',
    label: 'Palace',
    hint: 'Coming soon',
    x: 0.5,
    y: 0.24,
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

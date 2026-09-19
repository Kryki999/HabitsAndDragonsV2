import type { ImageSourcePropType } from 'react-native';

/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Map pins: icon only (no name labels). Anchor = stem tip on the landmark.
 * Hub hotspots: (x, y) is below the icon. Tune this file only.
 *
 * How to retune
 * -------------
 * 1. Replace the JPEG in `apps/mobile/assets/images/world/` (keep the filename).
 * 2. Update `MAP_INTRINSIC` / `HUB_INTRINSIC` if the pixel size changed.
 * 3. Nudge `x` / `y` below. 0.01 ≈ 1% of the still.
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
};

export const MAP_INTRINSIC = { width: 1254, height: 1254 } as const;
export const HUB_INTRINSIC = { width: 941, height: 1672 } as const;

export type MapPinKind = 'home' | 'locked';

export type MapPinDef = {
  id: string;
  /** Spoken / fog-hint name. Not drawn on the overview map. */
  label: string;
  x: number;
  y: number;
  kind: MapPinKind;
  /** Crownhaven is the only map pin that opens a hub. */
  opens?: 'hub';
};

/**
 * Kingdom orbit pins (square map, Crownhaven in the middle).
 *
 * Only Crownhaven is interactive. Side pins stay locked. Gutterjack is a
 * tavern hotspot on the hub — not a kingdom-map pin.
 */
export const KINGDOM_PINS: MapPinDef[] = [
  {
    id: 'crownhaven',
    label: 'Crownhaven',
    x: 0.52,
    y: 0.35,
    kind: 'home',
    opens: 'hub',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    x: 0.22,
    y: 0.7,
    kind: 'locked',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
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
 * the chalice-sign building (right) → Gutterjack cellar. Market = veg crates.
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

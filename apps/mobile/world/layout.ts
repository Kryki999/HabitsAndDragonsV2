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
 * 3. Nudge pin `x` / `y` and fog ellipses below. 0.01 ≈ 1% of the still.
 *    Fog is a runtime veil — never paint it into the JPEG. When the
 *    illustration moves, only these normalized holes / drifts need a nudge.
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

export type MapPinKind = 'home' | 'locked' | 'landmark';

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
 * Crownhaven is the only hub pin. Side pins start locked and become landmarks
 * once their fog region is revealed. Gutterjack is a tavern hotspot on the
 * hub — not a kingdom-map pin.
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

/**
 * Fog holes over the kingdom still. Coordinates are normalized 0–1 so a new
 * illustration only needs these ellipses nudged — not a new fog feature.
 *
 * `cx`/`cy` = centre, `rx`/`ry` = radii, `feather` = extra soft edge
 * (fraction of the map). Revealed regions punch a hole through the veil.
 */
export type MapFogRegionDef = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  feather: number;
  revealedByDefault?: boolean;
};

export const MAP_FOG_REGIONS: MapFogRegionDef[] = [
  {
    id: 'crownhaven',
    cx: 0.49,
    cy: 0.4,
    rx: 0.22,
    ry: 0.2,
    feather: 0.12,
    revealedByDefault: true,
  },
  {
    id: 'crown-approaches',
    cx: 0.53,
    cy: 0.66,
    rx: 0.14,
    ry: 0.13,
    feather: 0.1,
  },
  {
    id: 'smugglers-teeth',
    cx: 0.22,
    cy: 0.73,
    rx: 0.18,
    ry: 0.16,
    feather: 0.11,
  },
];

export const DEFAULT_REVEALED_REGION_IDS: string[] = MAP_FOG_REGIONS.filter(
  (region) => region.revealedByDefault,
).map((region) => region.id);

/** Extra density banks — visual only, not discoverable pins. */
export type MapFogDriftDef = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  density: number;
  phase: number;
};

export const MAP_FOG_DRIFTS: MapFogDriftDef[] = [
  { id: 'alsah-dunes', cx: 0.2, cy: 0.16, rx: 0.3, ry: 0.22, density: 0.42, phase: 0.2 },
  { id: 'north-keep', cx: 0.8, cy: 0.13, rx: 0.26, ry: 0.2, density: 0.36, phase: 1.1 },
  { id: 'east-spire', cx: 0.84, cy: 0.4, rx: 0.2, ry: 0.22, density: 0.3, phase: 2.4 },
  { id: 'still-water', cx: 0.22, cy: 0.42, rx: 0.18, ry: 0.16, density: 0.22, phase: 3.6 },
  { id: 'south-vines', cx: 0.56, cy: 0.9, rx: 0.26, ry: 0.16, density: 0.28, phase: 4.5 },
  { id: 'salt-reach', cx: 0.16, cy: 0.88, rx: 0.28, ry: 0.2, density: 0.34, phase: 5.2 },
  { id: 'east-wood', cx: 0.74, cy: 0.62, rx: 0.2, ry: 0.18, density: 0.26, phase: 0.8 },
];

export function isFogRegionRevealed(id: string, discoveredRegionIds: string[]): boolean {
  const region = MAP_FOG_REGIONS.find((entry) => entry.id === id);
  if (region?.revealedByDefault) return true;
  return discoveredRegionIds.includes(id);
}

export function nextHiddenFogRegionId(discoveredRegionIds: string[]): string | null {
  const hidden = MAP_FOG_REGIONS.find(
    (region) => !region.revealedByDefault && !discoveredRegionIds.includes(region.id),
  );
  return hidden?.id ?? null;
}

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

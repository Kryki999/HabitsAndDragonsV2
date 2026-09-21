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
 * 2. Update `MAP_INTRINSIC` / `HUB_INTRINSIC` / tavern ground size if the pixel size changed.
 * 3. Nudge pin `x` / `y` and fog seeds below. 0.01 ≈ 1% of the still.
 *    Fog is one runtime veil — never paint it into the JPEG. Seeds are
 *    influence, not drawn circles: they merge into a single clearing.
 *    When the illustration moves, only these normalized seeds need a nudge.
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
  /**
   * Tavern Ground stand-in: Mentor hall still (landscape). Cover-crops to the
   * wizard on a phone until we have a dedicated 9:16 ground floor.
   */
  tavernGround: require('@/assets/images/tavernsage.png') as ImageSourcePropType,
};

export const MAP_INTRINSIC = { width: 1254, height: 1254 } as const;
export const HUB_INTRINSIC = { width: 941, height: 1672 } as const;
export const TAVERN_GROUND_INTRINSIC = { width: 1678, height: 937 } as const;

export type MapPinKind = 'home' | 'locked' | 'landmark';

export type MapPinDef = {
  id: string;
  /** Spoken / fog-hint name. Not drawn on the overview map. */
  label: string;
  x: number;
  y: number;
  kind: MapPinKind;
  /** Crownhaven opens the hub. Other pins open a location still. */
  opens?: 'hub' | 'location';
};

/**
 * Kingdom orbit pins (square map, Crownhaven in the middle).
 *
 * Crownhaven is the only hub pin. Side pins start locked and become landmarks
 * once their fog region is revealed. Gutterjack is the tavern cellar — not a
 * kingdom-map pin. Hub tavern hotspot opens the Ground hall + floor lift.
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
    opens: 'location',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    x: 0.54,
    y: 0.63,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'anvil-glade',
    label: 'Anvil Glade',
    x: 0.8,
    y: 0.7,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'closed-way',
    label: 'The Closed Way',
    x: 0.63,
    y: 0.23,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'raven-castle',
    label: 'Raven Castle',
    x: 0.8,
    y: 0.11,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'pallglass',
    label: 'Pallglass Spire',
    x: 0.88,
    y: 0.39,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'vampire-house',
    label: 'Vampire House',
    x: 0.36,
    y: 0.78,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'water-temple',
    label: 'Water Temple',
    x: 0.18,
    y: 0.46,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'pyramid',
    label: "Osiris' Pyramid",
    x: 0.24,
    y: 0.15,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'ananiel',
    label: "Ananiel's Spire",
    x: 0.1,
    y: 0.13,
    kind: 'locked',
    opens: 'location',
  },
];

/**
 * Discoverable fog regions. Geometry lives on `MAP_FOG_SEEDS` so one region
 * can be a merged bay, not a circle around its pin.
 */
export type MapFogRegionDef = {
  id: string;
  revealedByDefault?: boolean;
};

export const MAP_FOG_REGIONS: MapFogRegionDef[] = [
  { id: 'crownhaven', revealedByDefault: true },
  { id: 'crown-approaches' },
  { id: 'smugglers-teeth' },
  { id: 'anvil-glade' },
  { id: 'closed-way' },
  { id: 'pallglass' },
  { id: 'raven-castle' },
  { id: 'vampire-house' },
  { id: 'water-temple' },
  { id: 'pyramid' },
  { id: 'ananiel' },
];

export const DEFAULT_REVEALED_REGION_IDS: string[] = MAP_FOG_REGIONS.filter(
  (region) => region.revealedByDefault,
).map((region) => region.id);

/**
 * Influence seeds for the clearance field (normalized 0–1).
 * Nearby seeds of the same (or adjacent revealed) region smooth-min into
 * one organic opening. Not drawn as ellipses.
 */
export type MapFogSeedDef = {
  id: string;
  regionId: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export const MAP_FOG_SEEDS: MapFogSeedDef[] = [
  { id: 'ch-keep', regionId: 'crownhaven', cx: 0.47, cy: 0.355, rx: 0.11, ry: 0.09 },
  { id: 'ch-roofs', regionId: 'crownhaven', cx: 0.495, cy: 0.45, rx: 0.135, ry: 0.1 },
  { id: 'ch-walls', regionId: 'crownhaven', cx: 0.5, cy: 0.525, rx: 0.1, ry: 0.075 },
  { id: 'ca-road', regionId: 'crown-approaches', cx: 0.53, cy: 0.64, rx: 0.11, ry: 0.09 },
  { id: 'ca-south', regionId: 'crown-approaches', cx: 0.545, cy: 0.73, rx: 0.1, ry: 0.085 },
  { id: 'st-cliffs', regionId: 'smugglers-teeth', cx: 0.2, cy: 0.68, rx: 0.125, ry: 0.1 },
  { id: 'st-wreck', regionId: 'smugglers-teeth', cx: 0.22, cy: 0.78, rx: 0.14, ry: 0.11 },
  { id: 'ag-smithy', regionId: 'anvil-glade', cx: 0.8, cy: 0.7, rx: 0.1, ry: 0.085 },
  { id: 'cw-gate', regionId: 'closed-way', cx: 0.63, cy: 0.23, rx: 0.1, ry: 0.08 },
  { id: 'pg-spire', regionId: 'pallglass', cx: 0.88, cy: 0.39, rx: 0.09, ry: 0.1 },
  { id: 'rc-keep', regionId: 'raven-castle', cx: 0.8, cy: 0.12, rx: 0.1, ry: 0.085 },
  { id: 'vh-grove', regionId: 'vampire-house', cx: 0.36, cy: 0.78, rx: 0.09, ry: 0.08 },
  { id: 'wt-isle', regionId: 'water-temple', cx: 0.18, cy: 0.46, rx: 0.11, ry: 0.09 },
  { id: 'wt-water', regionId: 'water-temple', cx: 0.2, cy: 0.52, rx: 0.1, ry: 0.08 },
  { id: 'py-dune', regionId: 'pyramid', cx: 0.24, cy: 0.16, rx: 0.11, ry: 0.09 },
  { id: 'an-tower', regionId: 'ananiel', cx: 0.1, cy: 0.13, rx: 0.1, ry: 0.09 },
];

/** Native Skia veil is unrolled — keep this in lockstep with `fogShader.ts`. */
export const MAP_FOG_SEED_SLOTS = 24;

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

export type HubHotspotAction = 'tavern' | 'comingSoon';

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
 * the chalice-sign building (right) → Ground hall (elevator to Cellar / Gutterjack).
 * Market = veg crates.
 */
export const HUB_HOTSPOTS: HubHotspotDef[] = [
  {
    id: 'tavern',
    label: 'Tavern',
    hint: 'Gutterjack',
    x: 0.88,
    y: 0.78,
    action: 'tavern',
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

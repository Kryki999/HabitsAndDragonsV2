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
 * 1. Replace `map_board.png` (keep the filename / WORLD_ART path).
 * 2. Update `MAP_INTRINSIC` if the pixel size changed (portrait corridor).
 * 3. Nudge pin `x` / `y` and fog seeds below. 0.01 ≈ 1% of the still.
 *    Fog is one runtime veil — never paint it into the PNG. Seeds are
 *    influence, not drawn circles: they merge into a single clearing.
 *    When the illustration moves, only these normalized seeds need a nudge.
 *
 * Art ingest
 * ----------
 * Cursor chat PNG attachments cap at **768KB** (exactly 786432 bytes) and arrive
 * truncated (full IHDR, black lower canvas, no IEND). Ship **JPEG/WebP under
 * ~700KB** so the whole frame lands when attaching in chat. Production
 * `map_board.png` is the live corridor board (941×1672).
 */

export const WORLD_ART = {
  /** Tall upward corridor travel map (Crownhaven at bottom → Ananiel at top). */
  map: require('@/assets/images/map_board.png') as ImageSourcePropType,
  hub: require('@/assets/images/world/hub-crownhaven.jpg') as ImageSourcePropType,
  /**
   * Tavern Ground stand-in: Mentor hall still (landscape). Cover-crops to the
   * wizard on a phone until we have a dedicated 9:16 ground floor.
   */
  tavernGround: require('@/assets/images/tavernsage.png') as ImageSourcePropType,
};

/** Production corridor board — portrait, pans mostly up. */
export const MAP_INTRINSIC = { width: 941, height: 1672 } as const;
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
 * Corridor pins (portrait board, Crownhaven at the bottom).
 *
 * Crownhaven is the only hub pin. Side pins start locked and become landmarks
 * once their fog region is revealed. Gutterjack is the tavern cellar — not a
 * kingdom-map pin. Hub tavern hotspot opens the Ground hall + floor lift.
 *
 * Spine (Main ★): Closed Way → Raven Castle → Pyramid → Ananiel.
 * Optional sides never hard-gate Main ★.
 */
export const KINGDOM_PINS: MapPinDef[] = [
  {
    id: 'crownhaven',
    label: 'Crownhaven',
    x: 0.5,
    y: 0.86,
    kind: 'home',
    opens: 'hub',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    x: 0.51,
    y: 0.68,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    x: 0.18,
    y: 0.52,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'anvil-glade',
    label: 'Anvil Glade',
    x: 0.8,
    y: 0.55,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'closed-way',
    label: 'The Closed Way',
    x: 0.5,
    y: 0.455,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'water-temple',
    label: 'Water Temple',
    x: 0.2,
    y: 0.375,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'pallglass',
    label: 'Pallglass Spire',
    x: 0.83,
    y: 0.33,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'raven-castle',
    label: 'Raven Castle',
    x: 0.5,
    y: 0.255,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'vampire-house',
    label: 'Vampire House',
    x: 0.74,
    y: 0.175,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'pyramid',
    label: "Osiris' Pyramid",
    x: 0.5,
    y: 0.125,
    kind: 'locked',
    opens: 'location',
  },
  {
    id: 'ananiel',
    label: "Ananiel's Spire",
    x: 0.5,
    y: 0.045,
    kind: 'locked',
    opens: 'location',
  },
];

/**
 * Discoverable fog regions. Geometry lives on `MAP_FOG_SEEDS` so one region
 * can be a merged bay, not a circle around its pin.
 *
 * Order = DEV unveil / seed discover sequence: Approaches first, then optional
 * R1 sides, then Main spine + later sides. Sides never hard-gate Main ★.
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
  { id: 'water-temple' },
  { id: 'pallglass' },
  { id: 'raven-castle' },
  { id: 'vampire-house' },
  { id: 'pyramid' },
  { id: 'ananiel' },
];

export const DEFAULT_REVEALED_REGION_IDS: string[] = MAP_FOG_REGIONS.filter(
  (region) => region.revealedByDefault,
).map((region) => region.id);

/**
 * Influence seeds for the clearance field (normalized 0–1).
 * Nearby open regions smooth-min into one bay. Crownhaven alone must not
 * leak the Approaches bridge, Teeth cove, or Anvil forge.
 * Not drawn as ellipses.
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
  { id: 'ch-keep', regionId: 'crownhaven', cx: 0.5, cy: 0.835, rx: 0.16, ry: 0.055 },
  { id: 'ch-plaza', regionId: 'crownhaven', cx: 0.5, cy: 0.89, rx: 0.2, ry: 0.07 },
  { id: 'ch-walls', regionId: 'crownhaven', cx: 0.5, cy: 0.94, rx: 0.18, ry: 0.055 },
  { id: 'ca-bridge', regionId: 'crown-approaches', cx: 0.51, cy: 0.68, rx: 0.12, ry: 0.045 },
  { id: 'ca-road', regionId: 'crown-approaches', cx: 0.5, cy: 0.72, rx: 0.11, ry: 0.04 },
  { id: 'st-cave', regionId: 'smugglers-teeth', cx: 0.18, cy: 0.52, rx: 0.13, ry: 0.055 },
  { id: 'st-wreck', regionId: 'smugglers-teeth', cx: 0.14, cy: 0.56, rx: 0.12, ry: 0.05 },
  { id: 'ag-smithy', regionId: 'anvil-glade', cx: 0.8, cy: 0.55, rx: 0.12, ry: 0.05 },
  { id: 'cw-gate', regionId: 'closed-way', cx: 0.5, cy: 0.455, rx: 0.12, ry: 0.045 },
  { id: 'wt-portal', regionId: 'water-temple', cx: 0.2, cy: 0.375, rx: 0.11, ry: 0.045 },
  { id: 'wt-lake', regionId: 'water-temple', cx: 0.18, cy: 0.4, rx: 0.1, ry: 0.04 },
  { id: 'pg-spire', regionId: 'pallglass', cx: 0.83, cy: 0.33, rx: 0.1, ry: 0.055 },
  { id: 'rc-keep', regionId: 'raven-castle', cx: 0.5, cy: 0.255, rx: 0.13, ry: 0.05 },
  { id: 'vh-manor', regionId: 'vampire-house', cx: 0.74, cy: 0.175, rx: 0.12, ry: 0.045 },
  { id: 'py-dune', regionId: 'pyramid', cx: 0.5, cy: 0.125, rx: 0.13, ry: 0.05 },
  { id: 'an-tower', regionId: 'ananiel', cx: 0.5, cy: 0.045, rx: 0.12, ry: 0.045 },
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

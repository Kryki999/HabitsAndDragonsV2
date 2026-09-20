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
};

export const MAP_INTRINSIC = { width: 1254, height: 1254 } as const;
export const HUB_INTRINSIC = { width: 941, height: 1672 } as const;

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
];

export const MAP_FOG_SEED_SLOTS = 8;

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

import type { ImageSourcePropType } from 'react-native';

import type { StickerName } from '@/ui/stickerRegistry';

/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Map pins: icon only (no name labels). Anchor = stem tip on the landmark.
 * Fogged pins use the same circle with a lock instead of the landmark icon.
 * Hub hotspots: (x, y) is below the icon. Tune this file only.
 *
 * How to retune
 * -------------
 * 1. Replace `map_board.webp` (keep the filename / WORLD_ART path).
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
 * ~700KB** so the whole frame lands when attaching in chat.
 *
 * Live board: `map_board.webp` (1536×7237, stitched folds, **no** scripted sea pad).
 * Old corridor playground: `map_board-corridor-941x1672.png`.
 */

export const WORLD_ART = {
  /** Tall upward corridor travel map (Crownhaven at bottom → Ananiel at top). */
  map: require('@/assets/images/map_board.webp') as ImageSourcePropType,
  hub: require('@/assets/images/world/hub-crownhaven.jpg') as ImageSourcePropType,
  /**
   * Tavern Ground stand-in: Mentor hall still (landscape). Cover-crops to the
   * wizard on a phone until we have a dedicated 9:16 ground floor.
   */
  tavernGround: require('@/assets/images/tavernsage.png') as ImageSourcePropType,
};

/** Stitched fold strip, 1536 wide. Fit-width, pan only up. */
export const MAP_INTRINSIC = { width: 1536, height: 7237 } as const;
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
  /** Landmark sticker when the region is revealed. Hidden on locked / current. */
  sticker: StickerName;
  /** Crownhaven opens the hub. Other pins open a location still. */
  opens?: 'hub' | 'location';
};

/**
 * Strip pins (stitched folds, Crownhaven at the bottom). Anchor = landmark tip.
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
    y: 0.91,
    kind: 'home',
    sticker: 'castle',
    opens: 'hub',
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    x: 0.5,
    y: 0.82,
    kind: 'locked',
    sticker: 'helmet',
    opens: 'location',
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    x: 0.2,
    y: 0.735,
    kind: 'locked',
    sticker: 'dagger',
    opens: 'location',
  },
  {
    id: 'anvil-glade',
    label: 'Anvil Glade',
    x: 0.8,
    y: 0.735,
    kind: 'locked',
    sticker: 'hammer',
    opens: 'location',
  },
  {
    id: 'closed-way',
    label: 'The Closed Way',
    x: 0.5,
    y: 0.64,
    kind: 'locked',
    sticker: 'leaf',
    opens: 'location',
  },
  {
    id: 'water-temple',
    label: 'Water Temple',
    x: 0.2,
    y: 0.51,
    kind: 'locked',
    sticker: 'droplet',
    opens: 'location',
  },
  {
    id: 'pallglass',
    label: 'Pallglass Spire',
    x: 0.8,
    y: 0.51,
    kind: 'locked',
    sticker: 'crystalBall',
    opens: 'location',
  },
  {
    id: 'raven-castle',
    label: 'Raven Castle',
    x: 0.5,
    y: 0.415,
    kind: 'locked',
    sticker: 'blackbird',
    opens: 'location',
  },
  {
    id: 'vampire-house',
    label: 'Vampire House',
    x: 0.78,
    y: 0.3,
    kind: 'locked',
    sticker: 'bat',
    opens: 'location',
  },
  {
    id: 'pyramid',
    label: "Osiris' Pyramid",
    x: 0.5,
    y: 0.175,
    kind: 'locked',
    sticker: 'desert',
    opens: 'location',
  },
  {
    id: 'ananiel',
    label: "Ananiel's Spire",
    x: 0.5,
    y: 0.055,
    kind: 'locked',
    sticker: 'mage',
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
 * Puzzle-piece bays: each region is large enough for its landmark + light
 * margin, and the full set tiles the board so unveil-all leaves zero fog.
 * Nearby open regions smooth-min into one continuous veil. Crownhaven alone
 * must not leak the Approaches bridge, Teeth cove, or Anvil forge.
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
  // Crownhaven — harbor blob; stops short of the bridge
  { id: 'ch-city', regionId: 'crownhaven', cx: 0.5, cy: 0.91, rx: 0.48, ry: 0.07 },
  { id: 'ch-south', regionId: 'crownhaven', cx: 0.5, cy: 0.97, rx: 0.52, ry: 0.055 },
  { id: 'ch-plaza', regionId: 'crownhaven', cx: 0.5, cy: 0.87, rx: 0.4, ry: 0.05 },
  // Approaches — bridge / watchtower row
  { id: 'ca-center', regionId: 'crown-approaches', cx: 0.5, cy: 0.82, rx: 0.44, ry: 0.055 },
  { id: 'ca-west', regionId: 'crown-approaches', cx: 0.14, cy: 0.82, rx: 0.28, ry: 0.055 },
  { id: 'ca-east', regionId: 'crown-approaches', cx: 0.86, cy: 0.82, rx: 0.28, ry: 0.055 },
  // Smuggler's Teeth — west cove
  { id: 'st-cove', regionId: 'smugglers-teeth', cx: 0.18, cy: 0.735, rx: 0.28, ry: 0.07 },
  { id: 'st-west', regionId: 'smugglers-teeth', cx: 0.04, cy: 0.73, rx: 0.18, ry: 0.075 },
  // Anvil Glade — east cottage
  { id: 'ag-forge', regionId: 'anvil-glade', cx: 0.84, cy: 0.735, rx: 0.28, ry: 0.07 },
  { id: 'ag-east', regionId: 'anvil-glade', cx: 0.96, cy: 0.73, rx: 0.18, ry: 0.075 },
  // Closed Way — gate on the spine
  { id: 'cw-gate', regionId: 'closed-way', cx: 0.5, cy: 0.64, rx: 0.4, ry: 0.06 },
  { id: 'cw-path', regionId: 'closed-way', cx: 0.5, cy: 0.69, rx: 0.28, ry: 0.05 },
  // Water Temple — west shrine
  { id: 'wt-portal', regionId: 'water-temple', cx: 0.18, cy: 0.51, rx: 0.28, ry: 0.065 },
  { id: 'wt-west', regionId: 'water-temple', cx: 0.04, cy: 0.5, rx: 0.18, ry: 0.07 },
  // Pallglass — east glass tower
  { id: 'pg-spire', regionId: 'pallglass', cx: 0.84, cy: 0.51, rx: 0.28, ry: 0.07 },
  { id: 'pg-east', regionId: 'pallglass', cx: 0.96, cy: 0.5, rx: 0.18, ry: 0.075 },
  // Raven Castle — keep
  { id: 'rc-keep', regionId: 'raven-castle', cx: 0.5, cy: 0.415, rx: 0.42, ry: 0.065 },
  { id: 'rc-path', regionId: 'raven-castle', cx: 0.5, cy: 0.47, rx: 0.28, ry: 0.05 },
  // Vampire House — right wing
  { id: 'vh-manor', regionId: 'vampire-house', cx: 0.78, cy: 0.3, rx: 0.36, ry: 0.06 },
  { id: 'vh-east', regionId: 'vampire-house', cx: 0.95, cy: 0.29, rx: 0.2, ry: 0.06 },
  // Pyramid — desert belt
  { id: 'py-center', regionId: 'pyramid', cx: 0.5, cy: 0.175, rx: 0.5, ry: 0.065 },
  { id: 'py-belt', regionId: 'pyramid', cx: 0.5, cy: 0.22, rx: 0.46, ry: 0.05 },
  { id: 'py-west', regionId: 'pyramid', cx: 0.1, cy: 0.18, rx: 0.2, ry: 0.06 },
  // Ananiel — tower + sky
  { id: 'an-tower', regionId: 'ananiel', cx: 0.5, cy: 0.055, rx: 0.5, ry: 0.065 },
  { id: 'an-sky', regionId: 'ananiel', cx: 0.5, cy: 0.0, rx: 0.56, ry: 0.055 },
  { id: 'an-nw', regionId: 'ananiel', cx: 0.08, cy: 0.04, rx: 0.18, ry: 0.05 },
  { id: 'an-ne', regionId: 'ananiel', cx: 0.92, cy: 0.04, rx: 0.18, ry: 0.05 },
];

/** Native Skia veil is unrolled — keep this in lockstep with `fogShader.ts`. */
export const MAP_FOG_SEED_SLOTS = 28;

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

export type HubHotspotAction = 'tavern' | 'market' | 'palace';

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
 * Market = veg crates → stall keeper. Palace opens after Champion ★1 (Skarne).
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
    hint: 'Stall',
    x: 0.18,
    y: 0.83,
    action: 'market',
  },
  {
    id: 'castle',
    label: 'Palace',
    hint: 'After ★1',
    x: 0.5,
    y: 0.24,
    action: 'palace',
  },
];

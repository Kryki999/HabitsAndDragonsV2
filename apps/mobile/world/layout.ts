import type { ImageSourcePropType } from 'react-native';

import type { StickerName } from '@/ui/stickerRegistry';

/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Map pins: icon only (no name labels). Anchor = stem tip on the landmark.
 * Locked pins: lock glyph + required hero level (no fog veil).
 * Hub hotspots: (x, y) is below the icon. Tune this file only.
 *
 * How to retune
 * -------------
 * 1. Replace `map_board.webp` (keep the filename / WORLD_ART path).
 * 2. Update `MAP_INTRINSIC` if the pixel size changed (portrait corridor).
 * 3. Nudge pin `x` / `y` below. 0.01 ≈ 1% of the still.
 *    Unlock thresholds are hero level, not map geometry.
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
  /** Spoken name. Not drawn on the overview map. */
  label: string;
  x: number;
  y: number;
  kind: MapPinKind;
  /** Landmark sticker when unlocked. Hidden on locked / current. */
  sticker: StickerName;
  /** Crownhaven opens the hub. Other pins open a location still. */
  opens?: 'hub' | 'location';
  /**
   * Hero level required to enter. `0` = always (Crownhaven).
   * Ladder from docs/17 (side points + Main ★, collapsed to static gates).
   */
  unlockLevel: number;
};

/**
 * Strip pins (stitched folds, Crownhaven at the bottom). Anchor = landmark tip.
 *
 * Crownhaven is the only hub pin (always). Other pins lock until
 * `hero.playerLevel >= unlockLevel`. Gutterjack is the tavern cellar — not a
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
    unlockLevel: 0,
  },
  {
    id: 'crown-approaches',
    label: 'Crown Approaches',
    x: 0.5,
    y: 0.82,
    kind: 'locked',
    sticker: 'helmet',
    opens: 'location',
    unlockLevel: 3,
  },
  {
    id: 'smugglers-teeth',
    label: "Smuggler's Teeth",
    x: 0.2,
    y: 0.735,
    kind: 'locked',
    sticker: 'dagger',
    opens: 'location',
    unlockLevel: 4,
  },
  {
    id: 'anvil-glade',
    label: 'Anvil Glade',
    x: 0.8,
    y: 0.735,
    kind: 'locked',
    sticker: 'hammer',
    opens: 'location',
    unlockLevel: 6,
  },
  {
    id: 'closed-way',
    label: 'The Closed Way',
    x: 0.5,
    y: 0.64,
    kind: 'locked',
    sticker: 'leaf',
    opens: 'location',
    unlockLevel: 5,
  },
  {
    id: 'water-temple',
    label: 'Water Temple',
    x: 0.2,
    y: 0.51,
    kind: 'locked',
    sticker: 'droplet',
    opens: 'location',
    unlockLevel: 7,
  },
  {
    id: 'pallglass',
    label: 'Pallglass Spire',
    x: 0.8,
    y: 0.51,
    kind: 'locked',
    sticker: 'crystalBall',
    opens: 'location',
    unlockLevel: 9,
  },
  {
    id: 'raven-castle',
    label: 'Raven Castle',
    x: 0.5,
    y: 0.415,
    kind: 'locked',
    sticker: 'blackbird',
    opens: 'location',
    unlockLevel: 8,
  },
  {
    id: 'vampire-house',
    label: 'Vampire House',
    x: 0.78,
    y: 0.3,
    kind: 'locked',
    sticker: 'bat',
    opens: 'location',
    unlockLevel: 10,
  },
  {
    id: 'pyramid',
    label: "Osiris' Pyramid",
    x: 0.5,
    y: 0.175,
    kind: 'locked',
    sticker: 'desert',
    opens: 'location',
    unlockLevel: 11,
  },
  {
    id: 'ananiel',
    label: "Ananiel's Spire",
    x: 0.5,
    y: 0.055,
    kind: 'locked',
    sticker: 'mage',
    opens: 'location',
    unlockLevel: 13,
  },
];

export function isMapPinUnlocked(pin: MapPinDef, heroLevel: number): boolean {
  return heroLevel >= pin.unlockLevel;
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

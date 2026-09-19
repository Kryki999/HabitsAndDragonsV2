/**
 * World playground layout — pin / hotspot coordinates.
 *
 * All positions are **normalized 0–1** over the still (x = left→right, y = top→bottom).
 * Map pins: icon only (no name labels). Anchor = stem tip on the landmark.
 * Hub hotspots: (x, y) is below the icon. Tune this file + `catalog.ts` pins only.
 *
 * How to retune
 * -------------
 * 1. Replace the still (keep the filename — `world map.png` has a space).
 * 2. Update `MAP_INTRINSIC` / `STILL_9_16` in `art.ts` if the pixel size changed.
 * 3. Nudge `x` / `y` in `catalog.ts` (map) or `HUB_HOTSPOTS` below. 0.01 ≈ 1% of the still.
 */

import { MAP_PIN_LOCATIONS } from './catalog';
import type { LucideIcon } from 'lucide-react-native';

export { MAP_INTRINSIC, STILL_9_16 as HUB_INTRINSIC, STILL_9_16 as GUTTERJACK_INTRINSIC, WORLD_ART } from './art';
export { GUTTERJACK_COPY } from './catalog';

export type MapPinKind = 'home' | 'open' | 'locked';

export type MapPinDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: LucideIcon;
  unlockLevel: number;
  fogHint: string;
  opens: 'hub' | 'location';
};

export const KINGDOM_PINS: MapPinDef[] = MAP_PIN_LOCATIONS.map((loc) => ({
  id: loc.id,
  label: loc.name,
  x: loc.pin!.x,
  y: loc.pin!.y,
  icon: loc.pin!.icon,
  unlockLevel: loc.unlockLevel,
  fogHint: loc.fogHint,
  opens: loc.id === 'crownhaven' ? 'hub' : 'location',
}));

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

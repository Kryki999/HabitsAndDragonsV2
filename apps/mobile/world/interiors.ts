import type { ImageSourcePropType } from 'react-native';

import { WORLD_ART, TAVERN_GROUND_INTRINSIC } from './layout';

/**
 * Multi-floor interiors (tavern first).
 *
 * The labeled floor lift is the IA — not a stairs icon, not a list under the still.
 * Optional `stairTo` on a floor still is the same `setFloor` as tapping the lift.
 * Add a floor = one row here; Upper is a locked placeholder until we have art.
 */

export type InteriorFloorKind = 'still' | 'fight' | 'locked';

export type InteriorFloorId = 'upper' | 'ground' | 'cellar';

export type InteriorFloorDef = {
  id: InteriorFloorId;
  /** Short lift label. EN. */
  label: string;
  kind: InteriorFloorKind;
  /** Whisper when locked, or a cleared/hint line. */
  hint?: string;
  still?: {
    source: ImageSourcePropType;
    width: number;
    height: number;
  };
  fightId?: 'gutterjack';
  /**
   * Optional diegetic shortcut on THIS floor's still.
   * Same action as picking `to` in the lift — never a second menu.
   */
  stairTo?: { to: InteriorFloorId; x: number; y: number };
};

export type InteriorDef = {
  id: 'tavern';
  name: string;
  hubKicker: string;
  defaultFloorId: InteriorFloorId;
  /** Visual order: top of the building first. */
  floors: InteriorFloorDef[];
};

export const TAVERN_INTERIOR: InteriorDef = {
  id: 'tavern',
  name: 'Tavern',
  hubKicker: 'Crownhaven',
  defaultFloorId: 'ground',
  floors: [
    {
      id: 'upper',
      label: 'Upper',
      kind: 'locked',
      hint: 'Upper rooms — later.',
    },
    {
      id: 'ground',
      label: 'Ground',
      kind: 'still',
      still: {
        source: WORLD_ART.tavernGround,
        width: TAVERN_GROUND_INTRINSIC.width,
        height: TAVERN_GROUND_INTRINSIC.height,
      },
    },
    {
      id: 'cellar',
      label: 'Cellar',
      kind: 'fight',
      hint: 'Gutterjack',
      fightId: 'gutterjack',
    },
  ],
};

export const INTERIORS = {
  tavern: TAVERN_INTERIOR,
} as const;

export function floorById(interior: InteriorDef, id: InteriorFloorId): InteriorFloorDef | undefined {
  return interior.floors.find((floor) => floor.id === id);
}

export function isFloorOpen(floor: InteriorFloorDef): boolean {
  return floor.kind !== 'locked';
}

export function resolveFloorId(interior: InteriorDef, requested?: InteriorFloorId): InteriorFloorId {
  if (!requested) return interior.defaultFloorId;
  const floor = floorById(interior, requested);
  if (!floor || !isFloorOpen(floor)) return interior.defaultFloorId;
  return floor.id;
}

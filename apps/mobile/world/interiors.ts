import type { ImageSourcePropType } from 'react-native';

import { HUB_INTRINSIC, WORLD_ART, TAVERN_GROUND_INTRINSIC } from './layout';

export type WorldInteriorId = 'tavern' | 'market' | 'palace';

/**
 * Hub interiors (tavern + stall + palace). Map dungeons use `content.ts` floors
 * and the same labeled lift chrome.
 *
 * The labeled floor lift is the IA — not a stairs icon, not a list under the still.
 * Optional `stairTo` on a floor still is the same `setFloor` as tapping the lift.
 */

export type InteriorFloorKind = 'still' | 'fight' | 'locked' | 'npc';

export type InteriorFloorId = string;

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
  fightId?: string;
  npcId?: string;
  /**
   * Optional diegetic shortcut on THIS floor's still.
   * Same action as picking `to` in the lift — never a second menu.
   */
  stairTo?: { to: InteriorFloorId; x: number; y: number };
};

export type InteriorDef = {
  id: WorldInteriorId;
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
      hint: 'Cups — later.',
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

export const MARKET_INTERIOR: InteriorDef = {
  id: 'market',
  name: 'Market stall',
  hubKicker: 'Crownhaven',
  defaultFloorId: 'stall',
  floors: [
    {
      id: 'stall',
      label: 'Stall',
      kind: 'npc',
      hint: 'Guide #1',
      npcId: 'vendor',
      still: {
        source: WORLD_ART.hub,
        width: HUB_INTRINSIC.width,
        height: HUB_INTRINSIC.height,
      },
    },
  ],
};

export const PALACE_INTERIOR: InteriorDef = {
  id: 'palace',
  name: 'Palace',
  hubKicker: 'Crownhaven',
  defaultFloorId: 'hall',
  floors: [
    {
      id: 'hall',
      label: 'Hall',
      kind: 'npc',
      hint: 'Advisor',
      npcId: 'advisor',
      still: {
        source: WORLD_ART.hub,
        width: HUB_INTRINSIC.width,
        height: HUB_INTRINSIC.height,
      },
    },
  ],
};

export const INTERIORS: Record<WorldInteriorId, InteriorDef> = {
  tavern: TAVERN_INTERIOR,
  market: MARKET_INTERIOR,
  palace: PALACE_INTERIOR,
};

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

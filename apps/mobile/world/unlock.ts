import { ALWAYS_UNLOCKED, LOCATION_BY_ID } from './catalog';
import type { WorldLocationId } from './types';

const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

export function clampWorldLevel(level: number): number {
  if (!Number.isFinite(level)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
}

export function isLocationUnlocked(
  id: string,
  playerLevel: number,
  unlockedLocationIds: string[],
): boolean {
  if (ALWAYS_UNLOCKED.includes(id as WorldLocationId)) return true;
  if (unlockedLocationIds.includes(id)) return true;
  const loc = LOCATION_BY_ID[id as WorldLocationId];
  if (!loc) return false;
  return playerLevel >= loc.unlockLevel;
}

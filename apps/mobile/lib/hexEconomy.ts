import {
  addHex,
  emptyHex,
  HERO_HEX_STAT_AXIS_ORDER,
  sanitizeHexAxes,
  type HeroHexStatId,
  type HeroHexStats,
} from '@/constants/heroHexStats';
import { bandMultiplier, type DailyRewardBand, type HabitCompletionGrant } from '@/lib/economy';
import type { HabitDifficulty } from '@/habits/types';

/** Primary-axis gain before band. Same diminishing spirit as gold/XP bands. */
export const HEX_PRIMARY_BY_DIFFICULTY: Record<HabitDifficulty, number> = {
  easy: 0.4,
  medium: 0.7,
  hard: 1.0,
};

/** Second tagged axis gets half the primary weight. */
export const HEX_SECONDARY_RATIO = 0.5;

/** Per-axis clamp for one calendar day (after band). */
export const HEX_AXIS_DAILY_CAP = 4;

export function sumHexDeltas(grants: readonly HabitCompletionGrant[] | undefined): HeroHexStats {
  let acc = emptyHex();
  for (const grant of grants ?? []) {
    acc = addHex(acc, grant.hexDelta);
  }
  return acc;
}

export function computeHexDelta(opts: {
  axes: readonly string[] | undefined;
  difficulty: HabitDifficulty;
  band: DailyRewardBand;
  axisGainsAlreadyToday: HeroHexStats;
}): HeroHexStats {
  const axes = sanitizeHexAxes(opts.axes);
  const out = emptyHex();
  if (axes.length === 0) return out;

  const primary = HEX_PRIMARY_BY_DIFFICULTY[opts.difficulty] ?? HEX_PRIMARY_BY_DIFFICULTY.medium;
  const band = bandMultiplier(opts.band);
  if (band <= 0) return out;

  const weights: Partial<Record<HeroHexStatId, number>> = {
    [axes[0]!]: primary * band,
  };
  if (axes[1]) weights[axes[1]] = primary * HEX_SECONDARY_RATIO * band;

  for (const id of HERO_HEX_STAT_AXIS_ORDER) {
    const add = weights[id];
    if (add == null || add <= 0) continue;
    const already = opts.axisGainsAlreadyToday[id] ?? 0;
    const room = Math.max(0, HEX_AXIS_DAILY_CAP - already);
    out[id] = Math.round(Math.min(add, room) * 100) / 100;
  }
  return out;
}

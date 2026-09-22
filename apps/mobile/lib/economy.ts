import type { CombatSynergyTier } from '@/types/dungeonLoot';
import type { HabitDifficulty } from '@/habits/types';

/**
 * Habit + dungeon economy — LOCK numbers from `docs/06-economy-loot.md`.
 * Gold is band-only (difficulty does not change gold). XP uses difficulty base × band.
 */

export const HABIT_GOLD_FULL = 50;
export const HABIT_GOLD_REDUCED = 10;
export const FULL_BAND_MAX = 5;
export const REDUCED_BAND_MAX = 10;

export const KEY_PRICE_GOLD = 100;
export const KEY_DROP_CHANCES = [0.2, 0.05, 0.01] as const;
export const MAX_KEY_DROPS_PER_DAY = KEY_DROP_CHANCES.length;

/** Soft Act 1 curve until Bible locks absolute XP. Remainder carries on level-up. */
export const XP_PER_LEVEL = 100;

/**
 * Mid-band CD seeds from `06` §3 (Common 6–8, Elite 10–12, Champion 24–48, Titan 72).
 * Stick to these hours until Day 0–7 math lands.
 */
export const DUNGEON_CD_HOURS: Record<CombatSynergyTier, number> = {
  common: 7,
  elite: 11,
  champion: 36,
  titan: 72,
};

/** XP base inside a band. Gold here is the full-band label (always 50). */
export const DIFFICULTY_BASE_REWARDS: Record<HabitDifficulty, { xp: number; gold: number }> = {
  easy: { xp: 15, gold: HABIT_GOLD_FULL },
  medium: { xp: 25, gold: HABIT_GOLD_FULL },
  hard: { xp: 40, gold: HABIT_GOLD_FULL },
};

export type DailyRewardBand = 'full' | 'reduced' | 'zero';

export type HabitCompletionGrant = {
  habitId: string;
  gold: number;
  xp: number;
  keys: number;
  band: DailyRewardBand;
};

export function bandForCompletionIndex(index1Based: number): DailyRewardBand {
  if (index1Based <= FULL_BAND_MAX) return 'full';
  if (index1Based <= REDUCED_BAND_MAX) return 'reduced';
  return 'zero';
}

export function bandMultiplier(band: DailyRewardBand): number {
  if (band === 'full') return 1;
  if (band === 'reduced') return 0.2;
  return 0;
}

export function habitGoldForBand(band: DailyRewardBand): number {
  if (band === 'full') return HABIT_GOLD_FULL;
  if (band === 'reduced') return HABIT_GOLD_REDUCED;
  return 0;
}

export function habitXpForDifficulty(difficulty: HabitDifficulty, band: DailyRewardBand): number {
  const base = DIFFICULTY_BASE_REWARDS[difficulty]?.xp ?? DIFFICULTY_BASE_REWARDS.medium.xp;
  return Math.round(base * bandMultiplier(band));
}

export function habitRewardsPreview(
  difficulty: HabitDifficulty,
  completionIndex1Based: number,
): { gold: number; xp: number; band: DailyRewardBand } {
  const band = bandForCompletionIndex(completionIndex1Based);
  return {
    band,
    gold: habitGoldForBand(band),
    xp: habitXpForDifficulty(difficulty, band),
  };
}

export function keyDropChance(dropsAlreadyToday: number): number {
  if (dropsAlreadyToday < 0 || dropsAlreadyToday >= MAX_KEY_DROPS_PER_DAY) return 0;
  return KEY_DROP_CHANCES[dropsAlreadyToday] ?? 0;
}

export function rollHabitKeyDrop(
  dropsAlreadyToday: number,
  random: () => number = Math.random,
): boolean {
  const chance = keyDropChance(dropsAlreadyToday);
  if (chance <= 0) return false;
  return random() < chance;
}

export function countKeyDropsOnDate(
  logByDate: Record<string, readonly HabitCompletionGrant[]>,
  date: string,
): number {
  return (logByDate[date] ?? []).reduce((sum, grant) => sum + grant.keys, 0);
}

export function lastGrantForHabit(
  logByDate: Record<string, readonly HabitCompletionGrant[]>,
  date: string,
  habitId: string,
): HabitCompletionGrant | null {
  const list = logByDate[date] ?? [];
  for (let i = list.length - 1; i >= 0; i--) {
    const grant = list[i];
    if (grant?.habitId === habitId) return grant;
  }
  return null;
}

export function displayRewardsForHabit(opts: {
  habitId: string;
  difficulty: HabitDifficulty;
  completedToday: boolean;
  completionsToday: number;
  grantLog: Record<string, readonly HabitCompletionGrant[]>;
  date: string;
}): { gold: number; xp: number; keys: number; band: DailyRewardBand } {
  const awarded = lastGrantForHabit(opts.grantLog, opts.date, opts.habitId);
  if (opts.completedToday && awarded) {
    return { gold: awarded.gold, xp: awarded.xp, keys: awarded.keys, band: awarded.band };
  }
  const index = opts.completedToday ? opts.completionsToday : opts.completionsToday + 1;
  const preview = habitRewardsPreview(opts.difficulty, Math.max(1, index));
  return { ...preview, keys: 0 };
}

export function computeHabitGrant(opts: {
  habitId: string;
  difficulty: HabitDifficulty;
  completionIndex1Based: number;
  keyDropsAlreadyToday: number;
  random?: () => number;
}): HabitCompletionGrant {
  const band = bandForCompletionIndex(opts.completionIndex1Based);
  const gold = habitGoldForBand(band);
  const xp = habitXpForDifficulty(opts.difficulty, band);
  const canDropKey = band !== 'zero';
  const keys =
    canDropKey && rollHabitKeyDrop(opts.keyDropsAlreadyToday, opts.random ?? Math.random) ? 1 : 0;
  return { habitId: opts.habitId, gold, xp, keys, band };
}

export function applyXpDelta(
  playerLevel: number,
  currentLevelXP: number,
  xpForNextLevel: number,
  delta: number,
): { playerLevel: number; currentLevelXP: number } {
  const cap = Math.max(1, xpForNextLevel);
  let level = Math.max(1, playerLevel);
  let xp = currentLevelXP + delta;
  if (delta >= 0) {
    while (xp >= cap) {
      xp -= cap;
      level += 1;
    }
  } else {
    while (xp < 0 && level > 1) {
      level -= 1;
      xp += cap;
    }
    if (xp < 0) xp = 0;
  }
  return {
    playerLevel: Math.max(1, Math.min(99, level)),
    currentLevelXP: xp,
  };
}

export function dungeonCdMs(tier: CombatSynergyTier): number {
  return DUNGEON_CD_HOURS[tier] * 60 * 60 * 1000;
}

export function isCooldownReady(untilIso: string | null | undefined, now = Date.now()): boolean {
  if (!untilIso) return true;
  const until = Date.parse(untilIso);
  if (!Number.isFinite(until)) return true;
  return until <= now;
}

export function formatCooldownRemaining(untilIso: string, now = Date.now()): string {
  const until = Date.parse(untilIso);
  if (!Number.isFinite(until)) return 'now';
  const ms = until - now;
  if (ms <= 0) return 'now';
  const totalMin = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export type DungeonEntryDecision =
  | { ok: true; cost: 'tutorial' | 'free' | 'key' }
  | { ok: false; reason: 'need-key'; readyAt: string };

export function decideDungeonEntry(opts: {
  skipGate: boolean;
  cooldownUntil?: string | null;
  dungeonKeys: number;
  now?: number;
}): DungeonEntryDecision {
  if (opts.skipGate) return { ok: true, cost: 'tutorial' };
  const now = opts.now ?? Date.now();
  if (isCooldownReady(opts.cooldownUntil, now)) return { ok: true, cost: 'free' };
  if (opts.dungeonKeys >= 1) return { ok: true, cost: 'key' };
  return { ok: false, reason: 'need-key', readyAt: opts.cooldownUntil ?? '' };
}

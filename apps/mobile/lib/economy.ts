import type { HabitDifficulty } from '@/habits/types';

/** Visual card labels only — this PR does not award gold/XP. */
export const DIFFICULTY_BASE_REWARDS: Record<HabitDifficulty, { xp: number; gold: number }> = {
  easy: { xp: 15, gold: 5 },
  medium: { xp: 25, gold: 10 },
  hard: { xp: 40, gold: 20 },
};

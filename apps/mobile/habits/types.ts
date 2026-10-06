import type { HeroHexStatId } from '@/constants/heroHexStats';

export type StatType = 'strength' | 'agility' | 'intelligence';
export type TaskType = 'daily' | 'one-off';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';

/** Domain habit — Castle UI fields only. No RPG economy, Oracle, or classes. */
export type Habit = {
  id: string;
  name: string;
  description: string;
  stat: StatType;
  taskType: TaskType;
  /**
   * Planned due date (`YYYY-MM-DD`).
   * - `null` / `undefined` => unscheduled (visible on today by default)
   * - future date => hidden from the default list until opened via expedition calendar
   */
  scheduledDate?: string | null;
  isActive: boolean;
  currentStreak?: number;
  longestStreak?: number;
  totalCompletions?: number;
  completionDates?: string[];
  completedToday: boolean;
  icon: string;
  difficulty?: HabitDifficulty;
  /**
   * Hex axes this habit trains (0–2). Empty = untagged, no hex gains.
   * Separate from leftover `stat` (STR/AGI/INT) so onboarding can keep using `stat`.
   */
  hexAxes?: HeroHexStatId[];
  isFrozen?: boolean;
  frozenAtDate?: string | null;
  createdAt?: string;
};

export type SuggestedHabit = {
  name: string;
  description: string;
  rpgDescription: string;
  stat: StatType;
  taskType: TaskType;
  icon: string;
  difficulty: HabitDifficulty;
  hexAxes: HeroHexStatId[];
};

export type ActivityDay = {
  completions: number;
  xpFromHabits: number;
};

export type AddHabitInput = {
  name: string;
  description: string;
  stat: StatType;
  taskType: TaskType;
  icon: string;
  difficulty?: HabitDifficulty;
  scheduledDate?: string | null;
  hexAxes?: HeroHexStatId[];
};

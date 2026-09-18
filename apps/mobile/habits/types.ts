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
};

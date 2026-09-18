export type TaskType = 'daily' | 'one-off';

export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  icon: string;
  taskType: TaskType;
  /** Planned start / due day `YYYY-MM-DD`. Null = due today by default. */
  scheduledDate: string | null;
  /** Local calendar days this quest was completed. */
  completionDates: string[];
};

export type HabitDraft = {
  name: string;
  icon?: string;
  taskType?: TaskType;
  scheduledDate?: string | null;
};

export type ActivityByDate = Record<string, { completions: number }>;

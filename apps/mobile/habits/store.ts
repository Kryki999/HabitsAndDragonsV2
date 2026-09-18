import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { addDays, todayKey } from './dates';
import type { ActivityByDate, Habit, HabitDraft, TaskType } from './types';

function makeId(): string {
  return `hab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isHabitCompleteOn(habit: Habit, day: string): boolean {
  return habit.completionDates.includes(day);
}

export function isHabitCompleteToday(habit: Habit, day = todayKey()): boolean {
  return isHabitCompleteOn(habit, day);
}

/** Default list: dailies from start date (incl. overdue); one-offs due today or overdue. */
export function isHabitDueOnList(habit: Habit, day: string, today: string): boolean {
  const start = habit.scheduledDate ?? today;
  if (habit.taskType === 'daily') {
    return start <= day;
  }
  return start <= day && (start === day || day === today);
}

/** Calendar / focus day: dailies repeat from start; one-offs bind to that day. */
export function isHabitPlannedForDate(habit: Habit, day: string, today: string): boolean {
  const start = habit.scheduledDate ?? today;
  if (habit.taskType === 'daily') return day >= start;
  return start === day;
}

export function currentStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let cursor = set.has(today) ? today : addDays(today, -1);
  if (!set.has(cursor)) return 0;
  let n = 0;
  while (set.has(cursor)) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function longestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (prev && cur && addDays(prev, 1) === cur) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

export function buildActivityByDate(habits: Habit[]): ActivityByDate {
  const out: ActivityByDate = {};
  for (const habit of habits) {
    for (const day of habit.completionDates) {
      const prev = out[day];
      out[day] = { completions: (prev?.completions ?? 0) + 1 };
    }
  }
  return out;
}

export function completedNamesByDate(habits: Habit[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const habit of habits) {
    for (const day of habit.completionDates) {
      const list = out[day] ?? [];
      list.push(habit.name);
      out[day] = list;
    }
  }
  return out;
}

function normalizeTaskType(value: unknown): TaskType {
  return value === 'one-off' ? 'one-off' : 'daily';
}

export function migrateHabit(raw: unknown): Habit {
  const h = (raw ?? {}) as Partial<Habit> & { completedOn?: string | null };
  const fromLegacy =
    typeof h.completedOn === 'string' && h.completedOn.length > 0 ? [h.completedOn] : [];
  const completionDates = Array.isArray(h.completionDates)
    ? [...new Set(h.completionDates.filter((d): d is string => typeof d === 'string'))]
    : fromLegacy;
  return {
    id: typeof h.id === 'string' && h.id ? h.id : makeId(),
    name: typeof h.name === 'string' && h.name.trim() ? h.name.trim() : 'Quest',
    createdAt: typeof h.createdAt === 'string' ? h.createdAt : new Date().toISOString(),
    icon: typeof h.icon === 'string' && h.icon ? h.icon : '◇',
    taskType: normalizeTaskType(h.taskType),
    scheduledDate: typeof h.scheduledDate === 'string' ? h.scheduledDate : null,
    completionDates,
  };
}

type HabitsState = {
  habits: Habit[];
  addHabit: (draft: HabitDraft | string) => Habit | null;
  updateHabit: (
    id: string,
    patch: Partial<Pick<Habit, 'name' | 'icon' | 'taskType' | 'scheduledDate'>>,
  ) => void;
  deleteHabit: (id: string) => void;
  toggleComplete: (id: string, day?: string) => void;
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (draft) => {
        const input: HabitDraft = typeof draft === 'string' ? { name: draft } : draft;
        const trimmed = input.name.trim();
        if (!trimmed) return null;
        const habit: Habit = {
          id: makeId(),
          name: trimmed,
          createdAt: new Date().toISOString(),
          icon: input.icon?.trim() || '◇',
          taskType: input.taskType === 'one-off' ? 'one-off' : 'daily',
          scheduledDate: input.scheduledDate ?? null,
          completionDates: [],
        };
        set({ habits: [habit, ...get().habits] });
        return habit;
      },
      updateHabit: (id, patch) => {
        set({
          habits: get().habits.map((habit) => {
            if (habit.id !== id) return habit;
            const name =
              patch.name !== undefined
                ? patch.name.trim() || habit.name
                : habit.name;
            return {
              ...habit,
              name,
              icon: patch.icon !== undefined ? patch.icon.trim() || habit.icon : habit.icon,
              taskType: patch.taskType ?? habit.taskType,
              scheduledDate:
                patch.scheduledDate !== undefined ? patch.scheduledDate : habit.scheduledDate,
            };
          }),
        });
      },
      deleteHabit: (id) => {
        set({ habits: get().habits.filter((habit) => habit.id !== id) });
      },
      toggleComplete: (id, day = todayKey()) => {
        set({
          habits: get().habits.map((habit) => {
            if (habit.id !== id) return habit;
            const done = habit.completionDates.includes(day);
            const completionDates = done
              ? habit.completionDates.filter((d) => d !== day)
              : [...habit.completionDates, day];
            return { ...habit, completionDates };
          }),
        });
      },
    }),
    {
      name: 'hnd-habits-local',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ habits: state.habits }),
      migrate: (persistedState) => {
        const raw = persistedState as { habits?: unknown[] };
        const habits = Array.isArray(raw?.habits) ? raw.habits.map(migrateHabit) : [];
        return { habits } as HabitsState;
      },
    },
  ),
);

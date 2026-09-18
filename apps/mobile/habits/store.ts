import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ActivityDay, AddHabitInput, Habit, HabitDifficulty } from './types';

function todayKey(): string {
  return new Date().toISOString().split('T')[0]!;
}

function yesterdayKey(): string {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return y.toISOString().split('T')[0]!;
}

function newId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function ensureHabitDefaults(habit: Habit): Habit {
  const taskType = habit.taskType ?? 'daily';
  return {
    ...habit,
    taskType,
    description: habit.description ?? '',
    stat: habit.stat ?? 'intelligence',
    icon: habit.icon || '⚔️',
    scheduledDate: habit.scheduledDate ?? null,
    isActive: habit.isActive ?? true,
    currentStreak: taskType === 'daily' ? (habit.currentStreak ?? 0) : undefined,
    longestStreak: taskType === 'daily' ? (habit.longestStreak ?? 0) : undefined,
    totalCompletions: taskType === 'daily' ? (habit.totalCompletions ?? 0) : undefined,
    completionDates: taskType === 'daily' ? (habit.completionDates ?? []) : undefined,
    isFrozen: habit.isFrozen ?? false,
    frozenAtDate: habit.frozenAtDate ?? null,
    difficulty: (habit.difficulty ?? 'medium') as HabitDifficulty,
  };
}

function patchActivityForDay(
  activityByDate: Record<string, ActivityDay>,
  date: string,
  deltaCompletions: number,
): Record<string, ActivityDay> {
  const prev = activityByDate[date] ?? { completions: 0, xpFromHabits: 0 };
  const completions = Math.max(0, prev.completions + deltaCompletions);
  if (completions === 0 && prev.xpFromHabits === 0) {
    const next = { ...activityByDate };
    delete next[date];
    return next;
  }
  return { ...activityByDate, [date]: { completions, xpFromHabits: prev.xpFromHabits } };
}

function appendCompletedHabitNameForDay(
  logByDate: Record<string, string[]>,
  date: string,
  habitName: string,
): Record<string, string[]> {
  const prev = logByDate[date] ?? [];
  return { ...logByDate, [date]: [...prev, habitName] };
}

function removeCompletedHabitNameForDay(
  logByDate: Record<string, string[]>,
  date: string,
  habitName: string,
): Record<string, string[]> {
  const prev = logByDate[date] ?? [];
  if (prev.length === 0) return logByDate;
  const idx = prev.lastIndexOf(habitName);
  if (idx < 0) return logByDate;
  const nextDay = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
  if (nextDay.length === 0) {
    const next = { ...logByDate };
    delete next[date];
    return next;
  }
  return { ...logByDate, [date]: nextDay };
}

type LegacyHabit = {
  id: string;
  name: string;
  createdAt?: string;
  completedOn?: string | null;
};

type HabitsState = {
  habits: Habit[];
  activityByDate: Record<string, ActivityDay>;
  completedHabitNamesByDate: Record<string, string[]>;
  dailyReflectionByDate: Record<string, string>;
  castleQuestSortMode: 'default' | 'custom';
  castleQuestOrderIds: string[];
  planningDayOrderByDate: Record<string, string[]>;
  lastHabitResetDate: string | null;
  accountCreatedAtDateKey: string | null;
  completeHabit: (habitId: string) => void;
  uncompleteHabit: (habitId: string) => void;
  addHabit: (habit: AddHabitInput) => void;
  removeHabit: (habitId: string) => void;
  updateHabit: (
    habitId: string,
    patch: Partial<Pick<Habit, 'name' | 'description' | 'icon' | 'taskType'>>,
  ) => void;
  setHabitScheduledDate: (habitId: string, scheduledDate: string | null) => void;
  setCastleQuestSortMode: (mode: 'default' | 'custom') => void;
  setCastleQuestOrderIds: (orderedHabitIds: string[]) => void;
  setPlanningDayOrderForDate: (dateKey: string, orderedHabitIds: string[]) => void;
  setHeroDailyReflection: (dateKey: string, content: string) => void;
  resetDailyIfNeeded: () => void;
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      activityByDate: {},
      completedHabitNamesByDate: {},
      dailyReflectionByDate: {},
      castleQuestSortMode: 'default',
      castleQuestOrderIds: [],
      planningDayOrderByDate: {},
      lastHabitResetDate: null,
      accountCreatedAtDateKey: null,

      resetDailyIfNeeded: () => {
        const today = todayKey();
        const state = get();
        const accountCreatedAtDateKey = state.accountCreatedAtDateKey ?? today;
        if (state.lastHabitResetDate === today && state.accountCreatedAtDateKey) return;
        if (state.lastHabitResetDate === today) {
          if (!state.accountCreatedAtDateKey) set({ accountCreatedAtDateKey });
          return;
        }

        const yesterday = yesterdayKey();
        set({
          accountCreatedAtDateKey,
          lastHabitResetDate: today,
          habits: state.habits.map(ensureHabitDefaults).map((h) => {
            if (!h.isActive) return h;
            if (h.taskType === 'one-off') {
              if (h.completedToday) return { ...h, completedToday: false, isActive: false };
              return { ...h, completedToday: false };
            }
            if (h.isFrozen) {
              return { ...h, completedToday: false, isFrozen: false, frozenAtDate: null };
            }
            const completedYesterday = (h.completionDates ?? []).includes(yesterday);
            if (!h.completedToday && !completedYesterday) {
              return { ...h, completedToday: false, currentStreak: 0 };
            }
            return { ...h, completedToday: false };
          }),
        });
      },

      completeHabit: (habitId) => {
        get().resetDailyIfNeeded();
        set((state) => {
          const today = todayKey();
          const habit = state.habits.find((h) => h.id === habitId && h.isActive);
          if (!habit || habit.completedToday || habit.isFrozen) return state;
          if (habit.scheduledDate && habit.scheduledDate > today) return state;

          const updatedHabits = state.habits.map((h) => {
            if (h.id !== habitId) return h;
            const next = { ...h, completedToday: true };
            if (h.taskType === 'daily') {
              const completionDates = [...(h.completionDates ?? [])];
              if (!completionDates.includes(today)) completionDates.push(today);
              const currentStreak = (h.currentStreak ?? 0) + 1;
              return {
                ...next,
                completionDates,
                currentStreak,
                longestStreak: Math.max(h.longestStreak ?? 0, currentStreak),
                totalCompletions: (h.totalCompletions ?? 0) + 1,
              };
            }
            const completionDates = [...(h.completionDates ?? [])];
            if (!completionDates.includes(today)) completionDates.push(today);
            return {
              ...next,
              completionDates,
              totalCompletions: (h.totalCompletions ?? 0) + 1,
            };
          });

          return {
            habits: updatedHabits,
            activityByDate: patchActivityForDay(state.activityByDate, today, 1),
            completedHabitNamesByDate: appendCompletedHabitNameForDay(
              state.completedHabitNamesByDate,
              today,
              habit.name,
            ),
          };
        });
      },

      uncompleteHabit: (habitId) => {
        get().resetDailyIfNeeded();
        set((state) => {
          const today = todayKey();
          const habit = state.habits.find((h) => h.id === habitId && h.isActive);
          if (!habit || !habit.completedToday) return state;

          const updatedHabits = state.habits.map((h) => {
            if (h.id !== habitId) return h;
            const completionDates = (h.completionDates ?? []).filter((d) => d !== today);
            if (h.taskType !== 'daily') {
              return { ...h, completedToday: false, completionDates };
            }
            return {
              ...h,
              completedToday: false,
              currentStreak: Math.max(0, (h.currentStreak ?? 0) - 1),
              completionDates,
              totalCompletions: Math.max(0, (h.totalCompletions ?? 0) - 1),
            };
          });

          return {
            habits: updatedHabits,
            activityByDate: patchActivityForDay(state.activityByDate, today, -1),
            completedHabitNamesByDate: removeCompletedHabitNameForDay(
              state.completedHabitNamesByDate,
              today,
              habit.name,
            ),
          };
        });
      },

      addHabit: (habit) => {
        get().resetDailyIfNeeded();
        const taskType = habit.taskType ?? 'daily';
        const newHabit: Habit = {
          id: newId(),
          name: habit.name.trim(),
          description: (habit.description ?? '').trim() || habit.name.trim(),
          stat: habit.stat ?? 'intelligence',
          taskType,
          icon: habit.icon?.trim() || '⚔️',
          scheduledDate: habit.scheduledDate ?? null,
          isActive: true,
          completedToday: false,
          difficulty: habit.difficulty ?? 'medium',
          createdAt: new Date().toISOString(),
          currentStreak: taskType === 'daily' ? 0 : undefined,
          longestStreak: taskType === 'daily' ? 0 : undefined,
          totalCompletions: taskType === 'daily' ? 0 : undefined,
          completionDates: [],
        };
        if (!newHabit.name) return;
        set((s) => ({
          habits: [...s.habits, newHabit],
          castleQuestOrderIds: [...s.castleQuestOrderIds, newHabit.id],
        }));
      },

      setHabitScheduledDate: (habitId, scheduledDate) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === habitId ? { ...h, scheduledDate } : h)),
        }));
      },

      removeHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === habitId ? { ...h, isActive: false } : h)),
          castleQuestOrderIds: state.castleQuestOrderIds.filter((id) => id !== habitId),
        }));
      },

      updateHabit: (habitId, patch) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              name: patch.name != null ? patch.name.trim() || h.name : h.name,
              description:
                patch.description != null ? patch.description.trim() || h.description : h.description,
              icon: patch.icon != null ? patch.icon : h.icon,
              taskType: patch.taskType ?? h.taskType,
            };
          }),
        }));
      },

      setCastleQuestSortMode: (mode) => set({ castleQuestSortMode: mode }),
      setCastleQuestOrderIds: (orderedHabitIds) => set({ castleQuestOrderIds: orderedHabitIds }),
      setPlanningDayOrderForDate: (dateKey, orderedHabitIds) =>
        set((s) => ({
          planningDayOrderByDate: { ...s.planningDayOrderByDate, [dateKey]: orderedHabitIds },
        })),
      setHeroDailyReflection: (dateKey, content) =>
        set((s) => {
          const trimmed = content.trim();
          const next = { ...s.dailyReflectionByDate };
          if (!trimmed) delete next[dateKey];
          else next[dateKey] = trimmed;
          return { dailyReflectionByDate: next };
        }),
    }),
    {
      name: 'hnd-habits-local',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        habits: state.habits,
        activityByDate: state.activityByDate,
        completedHabitNamesByDate: state.completedHabitNamesByDate,
        dailyReflectionByDate: state.dailyReflectionByDate,
        castleQuestSortMode: state.castleQuestSortMode,
        castleQuestOrderIds: state.castleQuestOrderIds,
        planningDayOrderByDate: state.planningDayOrderByDate,
        lastHabitResetDate: state.lastHabitResetDate,
        accountCreatedAtDateKey: state.accountCreatedAtDateKey,
      }),
      migrate: (persisted, version) => {
        const raw = (persisted ?? {}) as {
          habits?: Array<Habit | LegacyHabit>;
          activityByDate?: Record<string, ActivityDay>;
          completedHabitNamesByDate?: Record<string, string[]>;
          dailyReflectionByDate?: Record<string, string>;
          castleQuestSortMode?: 'default' | 'custom';
          castleQuestOrderIds?: string[];
          planningDayOrderByDate?: Record<string, string[]>;
          lastHabitResetDate?: string | null;
          accountCreatedAtDateKey?: string | null;
        };
        const today = todayKey();
        const habits = (raw.habits ?? []).map((h) => {
          if ('completedToday' in h || 'taskType' in h) {
            return ensureHabitDefaults(h as Habit);
          }
          const legacy = h as LegacyHabit;
          const doneToday = legacy.completedOn === today;
          return ensureHabitDefaults({
            id: legacy.id,
            name: legacy.name,
            description: legacy.name,
            stat: 'intelligence',
            taskType: 'daily',
            icon: '⚔️',
            isActive: true,
            completedToday: doneToday,
            createdAt: legacy.createdAt,
            completionDates: legacy.completedOn ? [legacy.completedOn] : [],
            currentStreak: doneToday ? 1 : 0,
            longestStreak: doneToday ? 1 : 0,
            totalCompletions: legacy.completedOn ? 1 : 0,
          });
        });
        return {
          habits,
          activityByDate: raw.activityByDate ?? {},
          completedHabitNamesByDate: raw.completedHabitNamesByDate ?? {},
          dailyReflectionByDate: raw.dailyReflectionByDate ?? {},
          castleQuestSortMode: raw.castleQuestSortMode ?? 'default',
          castleQuestOrderIds: raw.castleQuestOrderIds ?? habits.map((h) => h.id),
          planningDayOrderByDate: raw.planningDayOrderByDate ?? {},
          lastHabitResetDate: raw.lastHabitResetDate ?? (version < 2 ? today : null),
          accountCreatedAtDateKey: raw.accountCreatedAtDateKey ?? today,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.resetDailyIfNeeded();
      },
    },
  ),
);

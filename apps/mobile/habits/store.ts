import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Habit } from './types';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function newId(): string {
  return `hab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isHabitCompleteToday(habit: Habit, day = todayKey()): boolean {
  return habit.completedOn === day;
}

type HabitsState = {
  habits: Habit[];
  addHabit: (name: string) => Habit | null;
  updateHabit: (id: string, name: string) => void;
  deleteHabit: (id: string) => void;
  toggleComplete: (id: string) => void;
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const habit: Habit = {
          id: newId(),
          name: trimmed,
          createdAt: new Date().toISOString(),
          completedOn: null,
        };
        set({ habits: [habit, ...get().habits] });
        return habit;
      },
      updateHabit: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set({
          habits: get().habits.map((habit) =>
            habit.id === id ? { ...habit, name: trimmed } : habit
          ),
        });
      },
      deleteHabit: (id) => {
        set({ habits: get().habits.filter((habit) => habit.id !== id) });
      },
      toggleComplete: (id) => {
        const day = todayKey();
        set({
          habits: get().habits.map((habit) => {
            if (habit.id !== id) return habit;
            const done = habit.completedOn === day;
            return { ...habit, completedOn: done ? null : day };
          }),
        });
      },
    }),
    {
      name: 'hnd-habits-local',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ habits: state.habits }),
    }
  )
);

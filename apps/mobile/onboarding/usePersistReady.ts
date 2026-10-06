import { useEffect, useState } from 'react';

import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { useOnboardingStore } from '@/onboarding/store';
import { useWorldStore } from '@/world/store';

type PersistApi = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

function whenHydrated(store: PersistApi): Promise<void> {
  return new Promise((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = store.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

/**
 * Testers who already have a name, habits, or a Gutterjack clear
 * should not be shoved back through Day 0.
 */
export function reconcileExistingProgress(): void {
  const onboarding = useOnboardingStore.getState();
  if (onboarding.complete) return;
  const named = Boolean(useHeroStore.getState().heroDisplayName?.trim());
  const hasHabits = useHabitsStore.getState().habits.some((habit) => habit.isActive);
  const gutterjack = useWorldStore.getState().gutterjackCleared;
  if (!named && !hasHabits && !gutterjack) return;
  useOnboardingStore.setState({
    complete: true,
    tutorialCueSeen: true,
    tutorialDone: gutterjack,
  });
}

/** Splash stays up until local stores have rehydrated (or 2s, whichever first). */
export function usePersistReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stores = [useOnboardingStore, useHeroStore, useHabitsStore, useWorldStore];
    const timeout = new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
    void Promise.race([Promise.all(stores.map((store) => whenHydrated(store))), timeout]).then(() => {
      if (cancelled) return;
      reconcileExistingProgress();
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}

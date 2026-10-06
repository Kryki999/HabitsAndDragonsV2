import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
  /** First-run gate. False until the stall-keeper flow finishes. */
  complete: boolean;
  /** Bottom sheet on Quests shown once. */
  tutorialCueSeen: boolean;
  /** True after first Gutterjack clear (or DEV reset skip). */
  tutorialDone: boolean;
};

type OnboardingActions = {
  completeOnboarding: () => void;
  markTutorialCueSeen: () => void;
  markTutorialDone: () => void;
  /** DEV. Does not wipe habits/hero — next launch re-asks only if you also clear those. */
  resetOnboarding: () => void;
};

type OnboardingStore = OnboardingState & OnboardingActions;

const EMPTY: OnboardingState = {
  complete: false,
  tutorialCueSeen: false,
  tutorialDone: false,
};

export const ONBOARDING_STORAGE_KEY = 'hnd-onboarding-local';

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      completeOnboarding: () =>
        set({
          complete: true,
          tutorialCueSeen: false,
          tutorialDone: false,
        }),
      markTutorialCueSeen: () => set({ tutorialCueSeen: true }),
      markTutorialDone: () => set({ tutorialDone: true, tutorialCueSeen: true }),
      resetOnboarding: () => set({ ...EMPTY }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        complete: state.complete,
        tutorialCueSeen: state.tutorialCueSeen,
        tutorialDone: state.tutorialDone,
      }),
    },
  ),
);

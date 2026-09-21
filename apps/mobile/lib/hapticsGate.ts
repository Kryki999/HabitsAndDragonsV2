import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';

type HapticsPrefs = {
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
};

/** Local settings — not a game domain store. */
export const useHapticsStore = create<HapticsPrefs>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'hnd-haptics-local',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hapticsEnabled: state.hapticsEnabled }),
    },
  ),
);

function gated(): boolean {
  return useHapticsStore.getState().hapticsEnabled;
}

export async function impactAsync(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  if (!gated()) return;
  await Haptics.impactAsync(style);
}

export async function selectionAsync(): Promise<void> {
  if (!gated()) return;
  await Haptics.selectionAsync();
}

export async function notificationAsync(type: Haptics.NotificationFeedbackType): Promise<void> {
  if (!gated()) return;
  await Haptics.notificationAsync(type);
}

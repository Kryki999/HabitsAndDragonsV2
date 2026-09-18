import * as Haptics from 'expo-haptics';

export { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';

/** Settings toggle is not ported — haptics always on for Castle feel. */
export async function impactAsync(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  await Haptics.impactAsync(style);
}

export async function selectionAsync(): Promise<void> {
  await Haptics.selectionAsync();
}

export async function notificationAsync(type: Haptics.NotificationFeedbackType): Promise<void> {
  await Haptics.notificationAsync(type);
}

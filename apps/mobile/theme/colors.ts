import Colors from '@/constants/colors';

/** Dark cartoon-fantasy HUD. Same palette as V1 Castle. */
export const colors = {
  background: Colors.dark.background,
  surface: Colors.dark.surface,
  surfaceRaised: Colors.dark.surfaceLight,
  border: Colors.dark.border,
  text: Colors.dark.text,
  textSecondary: Colors.dark.textSecondary,
  textMuted: Colors.dark.textMuted,
  gold: Colors.dark.gold,
  goldDim: 'rgba(255, 200, 69, 0.16)',
  tabBar: Colors.dark.tabBar,
  tabInactive: Colors.dark.tabInactive,
} as const;

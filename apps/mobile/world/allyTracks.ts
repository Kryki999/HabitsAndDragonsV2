import type { AllyNode, AllyNodeStatus } from '@/ui/AllyCard';
import type { StickerName } from '@/ui/stickerRegistry';

/** Consecutive days with at least one habit done — same count as Crown Day. */
export function globalStreakDays(
  activity: Record<string, { completions: number } | undefined>,
  today: string,
): number {
  const has = (key: string) => (activity[key]?.completions ?? 0) > 0;
  const shift = (key: string, days: number) => {
    const dt = new Date(`${key}T00:00:00Z`);
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().split('T')[0]!;
  };
  let cursor = has(today) ? today : shift(today, -1);
  let count = 0;
  while (has(cursor)) {
    count += 1;
    cursor = shift(cursor, -1);
    if (count > 5000) break;
  }
  return count;
}

export type AllyTrackDef = {
  raiseLabel: string;
  raiseSticker: StickerName;
  sceneKicker: string;
  sceneRoom: string;
  /** When set, nodes and chip use these days. Omit until the table is locked. */
  thresholds?: readonly [number, number, number];
  rewards?: readonly { title: string; reward: string; sticker?: StickerName }[];
};

/** Torrik — docs/06 §9 + golden world-npc-torrik.png. Reward names are locked placeholder copy. */
export const TORRIK_TRACK: AllyTrackDef = {
  raiseLabel: 'Streak',
  raiseSticker: 'crown',
  sceneKicker: 'Anvil Glade',
  sceneRoom: 'Smithy',
  thresholds: [5, 10, 20],
  rewards: [
    { title: 'Lv 1 · 5 days', reward: 'Repairs', sticker: 'hammer' },
    { title: 'Lv 2 · 10 days', reward: 'Iron blade', sticker: 'dagger' },
    { title: 'Lv 3 · 20 days', reward: 'Masterwork' },
  ],
};

/**
 * Miro — same AllyCard chrome. Growth is screen/focus, not the global streak.
 * Thresholds and reward names are not locked; do not show numbers until they are.
 */
export const MIRO_TRACK: AllyTrackDef = {
  raiseLabel: 'Focus',
  raiseSticker: 'mage',
  sceneKicker: 'Pallglass Spire',
  sceneRoom: 'Spire',
  rewards: [{ title: 'Lv 1', reward: '' }, { title: 'Lv 2', reward: '' }, { title: 'Lv 3', reward: '' }],
};

export function allyNodeStates(streak: number, thresholds: readonly [number, number, number]): AllyNodeStatus[] {
  const [a, b, c] = thresholds;
  if (streak >= c) return ['done', 'done', 'done'];
  if (streak >= b) return ['done', 'done', 'next'];
  if (streak >= a) return ['done', 'next', 'locked'];
  return ['next', 'locked', 'locked'];
}

/** Bar fill toward the next node (lookdev: streak 7 of 10 after Lv 1 = 20%). */
export function allyTrackFill(streak: number, thresholds: readonly [number, number, number]): number {
  const [a, b, c] = thresholds;
  if (streak >= c) return 1;
  if (streak >= b) return 0.5 + 0.5 * ((streak - b) / (c - b));
  if (streak >= a) return 0.5 * ((streak - a) / (b - a));
  return 0;
}

export function allyChipNext(streak: number, thresholds: readonly [number, number, number]): number {
  const [a, b, c] = thresholds;
  if (streak < a) return a;
  if (streak < b) return b;
  return c;
}

export function allyNodesFromTrack(
  track: AllyTrackDef,
  streak: number,
): { nodes: AllyNode[]; fill: number; raiseValue?: string } {
  const rewards = track.rewards ?? [];
  if (!track.thresholds) {
    return {
      fill: 0,
      nodes: rewards.map((reward) => ({
        status: 'locked' as const,
        title: reward.title,
        reward: reward.reward || undefined,
        sticker: undefined,
      })),
    };
  }
  const statuses = allyNodeStates(streak, track.thresholds);
  const fill = allyTrackFill(streak, track.thresholds);
  const next = allyChipNext(streak, track.thresholds);
  return {
    fill,
    raiseValue: `${streak} / ${next}`,
    nodes: rewards.map((reward, index) => {
      const status = statuses[index] ?? 'locked';
      return {
        status,
        title: reward.title,
        reward: reward.reward,
        sticker: status === 'locked' ? undefined : reward.sticker,
      };
    }),
  };
}

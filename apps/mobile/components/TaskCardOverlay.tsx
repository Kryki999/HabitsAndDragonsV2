/**
 * Shared-element expansion. One `expandProgress` value drives geometry.
 * Spring is unchanged: damping 22, stiffness 240, mass 0.9.
 * Compact face matches HabitRow. Expanded face is a white radius-28 card.
 * No dark overlay — tap outside still closes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { Habit, HabitDifficulty } from '@/habits/types';
import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { displayRewardsForHabit } from '@/lib/economy';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { CheckButton } from '@/ui/CheckButton';
import { Glyph } from '@/ui/Glyph';
import { IconButton } from '@/ui/IconButton';
import { Sticker } from '@/ui/Sticker';
import { stickerForHabitIcon } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

export interface CardMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  visible: boolean;
  habit: Habit;
  originMetrics: CardMetrics | null;
  onClose: () => void;
  onComplete: (id: string, meta?: { source: { x: number; y: number } }) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onReschedule?: (habit: Habit) => void;
  rewardGold?: number;
  rewardXp?: number;
}

const SPRING = { damping: 22, stiffness: 240, mass: 0.9 };

const TOP_GAP = 10;
const BOTTOM_GAP = 16;
const TOP_BTNS_H = 44;
const TOP_BTNS_W = 96;

export default function TaskCardOverlay({
  visible,
  habit,
  originMetrics,
  onClose,
  onComplete,
  onUncomplete,
  onDelete,
  onEdit,
  onReschedule,
  rewardGold,
  rewardXp,
}: Props) {
  const { width: SW, height: SH } = useWindowDimensions();
  const TARGET_W = SW * 0.85;
  const TARGET_H = 220;
  const TARGET_X = (SW - TARGET_W) / 2;
  const TARGET_Y = SH * 0.27;

  const expandProgress = useSharedValue(0);
  const originX = useSharedValue(-9999);
  const originY = useSharedValue(-9999);
  const originW = useSharedValue(SW * 0.85);
  const originH = useSharedValue(76);
  const isClosingFlag = useSharedValue(0);

  const [actionsActive, setActionsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rewardRef = useRef<View>(null);

  useAnimatedReaction(
    () => expandProgress.value,
    (value) => {
      if (isClosingFlag.value === 1 && value < 0.14) {
        isClosingFlag.value = 0;
        runOnJS(onClose)();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!visible || !originMetrics) return;
    setActionsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    isClosingFlag.value = 0;
    originX.value = originMetrics.x;
    originY.value = originMetrics.y;
    originW.value = originMetrics.width;
    originH.value = originMetrics.height;
    expandProgress.value = 0;
    expandProgress.value = withSpring(1, SPRING);
    timerRef.current = setTimeout(() => setActionsActive(true), 480);
  }, [visible, originMetrics]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActionsActive(false);
    if (!originMetrics) {
      onClose();
      return;
    }
    isClosingFlag.value = 1;
    expandProgress.value = withSpring(0, SPRING);
  }, [originMetrics, onClose, expandProgress, isClosingFlag]);

  const finishToggle = useCallback(
    (source?: { x: number; y: number }) => {
      if (habit.completedToday) onUncomplete(habit.id);
      else onComplete(habit.id, source ? { source } : undefined);
      triggerClose();
    },
    [habit.completedToday, habit.id, onComplete, onUncomplete, triggerClose],
  );

  const handleComplete = useCallback(() => {
    impactAsync(ImpactFeedbackStyle.Heavy);
    const node = rewardRef.current;
    if (!node || habit.completedToday) {
      finishToggle();
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      finishToggle({ x: x + width / 2, y: y + height / 2 });
    });
  }, [finishToggle, habit.completedToday]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Quest?', 'Are you sure you want to delete this quest? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          impactAsync(ImpactFeedbackStyle.Light);
          onDelete(habit.id);
          triggerClose();
        },
      },
    ]);
  }, [habit.id, onDelete, triggerClose]);

  const handleEdit = useCallback(() => {
    triggerClose();
    if (onEdit) setTimeout(() => onEdit(habit), 170);
  }, [habit, onEdit, triggerClose]);

  const handleReschedule = useCallback(() => {
    triggerClose();
    if (onReschedule) setTimeout(() => onReschedule(habit), 170);
  }, [habit, onReschedule, triggerClose]);

  const isCompleted = habit.completedToday;
  const today = new Date().toISOString().split('T')[0]!;
  const completionsToday = useHabitsStore((s) => s.activityByDate[today]?.completions ?? 0);
  const grantLog = useHeroStore((s) => s.habitGrantLogByDate ?? {});
  const computed = displayRewardsForHabit({
    habitId: habit.id,
    difficulty: (habit.difficulty ?? 'medium') as HabitDifficulty,
    completedToday: habit.completedToday,
    completionsToday,
    grantLog,
    date: today,
  });
  const goldShown = rewardGold ?? computed.gold;
  const xpShown = rewardXp ?? computed.xp;
  const keysShown = computed.keys;
  const sticker = stickerForHabitIcon(habit.icon);

  const cardStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    return {
      position: 'absolute' as const,
      left: originX.value + (TARGET_X - originX.value) * p,
      top: originY.value + (TARGET_Y - originY.value) * p,
      width: originW.value + (TARGET_W - originW.value) * p,
      height: originH.value + (TARGET_H - originH.value) * p,
      borderRadius: tokens.rLg,
      opacity:
        isClosingFlag.value === 1 ? interpolate(p, [0.15, 0.3], [0, 1], Extrapolation.CLAMP) : 1,
      zIndex: 2,
    };
  });

  const compactOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0, 0.35], [1, 0], Extrapolation.CLAMP),
  }));

  const expandedOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0.35, 0.75], [0, 1], Extrapolation.CLAMP),
  }));

  const topBtnsStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    const cx = originX.value + (TARGET_X - originX.value) * p;
    const cw = originW.value + (TARGET_W - originW.value) * p;
    const cy = originY.value + (TARGET_Y - originY.value) * p;
    return {
      position: 'absolute' as const,
      top: cy - TOP_BTNS_H - TOP_GAP,
      left: cx + cw - TOP_BTNS_W,
      opacity: interpolate(p, [0.6, 1], [0, 1], Extrapolation.CLAMP),
      zIndex: 3,
    };
  });

  const bottomRowStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    const cx = originX.value + (TARGET_X - originX.value) * p;
    const cw = originW.value + (TARGET_W - originW.value) * p;
    const cy = originY.value + (TARGET_Y - originY.value) * p;
    const ch = originH.value + (TARGET_H - originH.value) * p;
    return {
      position: 'absolute' as const,
      top: cy + ch + BOTTOM_GAP,
      left: cx,
      width: cw,
      opacity: interpolate(p, [0.6, 1], [0, 1], Extrapolation.CLAMP),
      zIndex: 3,
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={triggerClose}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={triggerClose} accessibilityLabel="Close quest" />

      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[styles.compact, compactOpacityStyle]}>
          <View style={styles.grip} />
          <View style={styles.well}>
            <Sticker name={sticker} size={32} />
          </View>
          <Text style={[styles.compactTitle, isCompleted && styles.doneTitle]} numberOfLines={2}>
            {habit.name}
          </Text>
          <View style={styles.reward}>
            <Text style={styles.rewardText}>{goldShown}</Text>
            <Sticker name="coin" size={18} bare />
          </View>
          <View style={[styles.checkFace, isCompleted && styles.checkFaceDone]}>
            <Glyph name="check" size={26} color={isCompleted ? tokens.onCanvas : tokens.brand} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.expanded, expandedOpacityStyle]} pointerEvents="none">
          <View style={styles.rewardColumn}>
            <Text style={styles.xp}>+{xpShown} XP</Text>
            <View ref={rewardRef} collapsable={false} style={styles.reward}>
              <Text style={styles.rewardText}>{goldShown}</Text>
              <Sticker name="coin" size={18} bare />
            </View>
            {keysShown > 0 ? (
              <View style={styles.reward}>
                <Text style={styles.rewardText}>{keysShown}</Text>
                <Sticker name="key" size={18} />
              </View>
            ) : null}
          </View>
          <View style={styles.expandedBody}>
            <View style={styles.wellLg}>
              <Sticker name={sticker} size={40} />
            </View>
            <Text style={styles.expandedName}>{habit.name}</Text>
            <Text style={styles.caption}>{habit.taskType === 'daily' ? 'Habit' : 'One-time quest'}</Text>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View style={topBtnsStyle} pointerEvents="box-none">
        <View style={styles.topBtns} pointerEvents={actionsActive ? 'box-none' : 'none'}>
          <IconButton glyph="delete" glyphColor={tokens.danger} accessibilityLabel="Delete quest" onPress={handleDelete} />
          <IconButton glyph="close" glyphColor={tokens.ink2} accessibilityLabel="Close" onPress={triggerClose} />
        </View>
      </Animated.View>

      <Animated.View style={bottomRowStyle} pointerEvents="box-none">
        <View style={styles.actionRow} pointerEvents={actionsActive ? 'box-none' : 'none'}>
          <View style={styles.actionSide}>
            <IconButton glyph="edit" accessibilityLabel="Edit" onPress={handleEdit} />
          </View>
          {isCompleted ? (
            <IconButton glyph="refresh" accessibilityLabel="Undo completion" onPress={handleComplete} />
          ) : (
            <CheckButton onPress={handleComplete} accessibilityLabel="Mark complete" />
          )}
          <View style={styles.actionSide}>
            <IconButton glyph="calendar" accessibilityLabel="Reschedule" onPress={handleReschedule} />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: tokens.surface,
    boxShadow: [shadow.cardLip, shadow.dropMd],
  },
  compact: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 10,
    paddingRight: 14,
  },
  grip: {
    width: 6,
    height: 18,
  },
  well: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTitle: {
    flex: 1,
    fontFamily: tokens.font800,
    fontSize: 18,
    lineHeight: 22,
    color: tokens.ink,
  },
  doneTitle: {
    color: tokens.ink2,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontFamily: tokens.font800,
    fontSize: 15,
    color: tokens.ink2,
  },
  checkFace: {
    width: 56,
    height: 52,
    borderRadius: 16,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkFaceDone: {
    backgroundColor: tokens.success,
  },
  expanded: {
    ...StyleSheet.absoluteFill,
  },
  rewardColumn: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'flex-end',
    gap: 6,
  },
  xp: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.ink2,
  },
  expandedBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  expandedName: {
    fontFamily: tokens.font900,
    fontSize: 22,
    lineHeight: 26,
    color: tokens.ink,
    textAlign: 'center',
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink2,
  },
  topBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSide: {
    flex: 1,
    alignItems: 'center',
  },
});

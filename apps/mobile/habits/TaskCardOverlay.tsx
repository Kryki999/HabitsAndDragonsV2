/**
 * Shared-element-style expansion of a habit card.
 * Reimplemented from V1 TaskCardOverlay — no XP/gold, no LinearGradient/lucide.
 */
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '@/theme/colors';

import { currentStreak, isHabitCompleteToday } from './store';
import { todayKey } from './dates';
import type { Habit } from './types';

export type CardMetrics = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  habit: Habit;
  originMetrics: CardMetrics | null;
  onClose: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onReschedule?: (habit: Habit) => void;
};

const SPRING = { damping: 22, stiffness: 240, mass: 0.9 };
const TOP_GAP = 10;
const BOTTOM_GAP = 16;
const TOP_BTNS_H = 36;
const TOP_BTNS_W = 80;

export default function TaskCardOverlay({
  visible,
  habit,
  originMetrics,
  onClose,
  onToggle,
  onDelete,
  onEdit,
  onReschedule,
}: Props) {
  const { width: SW, height: SH } = useWindowDimensions();
  const TARGET_W = Math.min(SW * 0.85, 420);
  const TARGET_H = 200;
  const TARGET_X = (SW - TARGET_W) / 2;
  const TARGET_Y = SH * 0.27;

  const expandProgress = useSharedValue(0);
  const originX = useSharedValue(-9999);
  const originY = useSharedValue(-9999);
  const originW = useSharedValue(SW * 0.85);
  const originH = useSharedValue(72);
  const isClosingFlag = useSharedValue(0);

  const [actionsActive, setActionsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

  const completed = isHabitCompleteToday(habit);
  const streak = currentStreak(habit.completionDates, todayKey());
  const typeLabel = habit.taskType === 'daily' ? 'Nawyk' : 'Jednorazowe';

  const handleComplete = useCallback(() => {
    void Haptics.impactAsync(
      completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy,
    );
    onToggle(habit.id);
    triggerClose();
  }, [completed, habit.id, onToggle, triggerClose]);

  const handleDelete = useCallback(() => {
    Alert.alert('Usunąć quest?', 'Tego nie cofniesz.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const cardBorderColor = completed ? `${colors.gold}70` : `${colors.border}99`;

  const cardStyle = useAnimatedStyle(() => {
    const p = expandProgress.value;
    return {
      position: 'absolute' as const,
      left: originX.value + (TARGET_X - originX.value) * p,
      top: originY.value + (TARGET_Y - originY.value) * p,
      width: originW.value + (TARGET_W - originW.value) * p,
      height: originH.value + (TARGET_H - originH.value) * p,
      borderRadius: 14 + 6 * p,
      opacity:
        isClosingFlag.value === 1
          ? interpolate(p, [0.15, 0.3], [0, 1], Extrapolation.CLAMP)
          : 1,
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0, 0.6], [0, 1], Extrapolation.CLAMP),
  }));

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
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={triggerClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdropBase, backdropStyle]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={triggerClose} />
      </Animated.View>

      <Animated.View style={[styles.card, { borderColor: cardBorderColor }, cardStyle]}>
        <View style={[styles.cardBody, completed && styles.cardBodyDone]}>
          <Animated.View
            style={[styles.compactLayout, completed && styles.compactDone, compactOpacityStyle]}
          >
            <Text style={styles.compactIcon}>{habit.icon}</Text>
            <View style={styles.compactInfo}>
              <Text
                style={[styles.compactName, completed && styles.compactNameDone]}
                numberOfLines={1}
              >
                {habit.name}
              </Text>
            </View>
            <View
              style={[styles.compactCheck, completed && styles.compactCheckDone]}
            >
              {completed ? (
                <Ionicons name="checkmark" size={14} color="#1a1228" />
              ) : null}
            </View>
          </Animated.View>

          <Animated.View
            style={[StyleSheet.absoluteFill, expandedOpacityStyle]}
            pointerEvents="none"
          >
            <View style={styles.expandedBody}>
              <Text style={styles.expandedIcon}>{habit.icon}</Text>
              <Text style={styles.expandedName}>{habit.name}</Text>
              <View style={[styles.typeBadge, completed && styles.typeBadgeDone]}>
                <Text style={[styles.typeBadgeText, completed && styles.typeBadgeTextDone]}>
                  {typeLabel}
                  {habit.taskType === 'daily' && streak > 0 ? ` · ${streak} dni` : ''}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
        <View
          style={[
            styles.accentBar,
            { backgroundColor: completed ? `${colors.gold}80` : colors.border },
          ]}
        />
      </Animated.View>

      <Animated.View style={topBtnsStyle} pointerEvents="box-none">
        <View style={styles.topBtns} pointerEvents={actionsActive ? 'box-none' : 'none'}>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.topBtn,
              styles.topBtnDelete,
              pressed && styles.topBtnPressed,
            ]}
            accessibilityLabel="Usuń quest"
          >
            <Ionicons name="trash-outline" size={15} color={colors.ruby} />
          </Pressable>
          <Pressable
            onPress={triggerClose}
            style={({ pressed }) => [styles.topBtn, pressed && styles.topBtnPressed]}
            accessibilityLabel="Zamknij"
          >
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View style={bottomRowStyle} pointerEvents="box-none">
        <View style={styles.actionRow} pointerEvents={actionsActive ? 'box-none' : 'none'}>
          <View style={styles.actionSide}>
            <Pressable
              onPress={handleEdit}
              style={({ pressed }) => [styles.ghostBtn, pressed && styles.ghostPressed]}
            >
              <Text style={styles.ghostEmoji}>✏️</Text>
              <Text style={styles.ghostLabel}>Edytuj</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleComplete}
            style={({ pressed }) => [
              styles.actionSquare,
              completed ? styles.undoSquare : styles.completeSquare,
              pressed && styles.actionSquarePressed,
            ]}
            accessibilityLabel={completed ? 'Cofnij odhaczenie' : 'Odhacz'}
          >
            {completed ? (
              <Ionicons name="arrow-undo" size={24} color={colors.textSecondary} />
            ) : (
              <Ionicons name="checkmark" size={26} color="#fff" />
            )}
          </Pressable>
          <View style={styles.actionSide}>
            <Pressable
              onPress={handleReschedule}
              style={({ pressed }) => [styles.ghostBtn, pressed && styles.ghostPressed]}
            >
              <Text style={styles.ghostEmoji}>📅</Text>
              <Text style={styles.ghostLabel}>Przełóż</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropBase: {
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 20,
  },
  cardBody: {
    flex: 1,
    backgroundColor: colors.surfaceRaised,
  },
  cardBodyDone: {
    backgroundColor: '#231a05',
  },
  accentBar: {
    height: 4,
  },
  compactLayout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  compactDone: {
    backgroundColor: colors.goldDim,
  },
  compactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  compactNameDone: {
    opacity: 0.55,
    textDecorationLine: 'line-through',
  },
  compactCheck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  compactCheckDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  expandedBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  expandedIcon: {
    fontSize: 44,
  },
  expandedName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: `${colors.purple}22`,
    borderWidth: 1,
    borderColor: `${colors.purple}55`,
  },
  typeBadgeDone: {
    backgroundColor: `${colors.gold}18`,
    borderColor: `${colors.gold}50`,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.purple,
    letterSpacing: 0.4,
  },
  typeBadgeTextDone: {
    color: colors.gold,
  },
  topBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topBtnDelete: {
    backgroundColor: `${colors.ruby}15`,
    borderColor: `${colors.ruby}40`,
  },
  topBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSide: {
    flex: 1,
    alignItems: 'center',
  },
  ghostBtn: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  ghostPressed: {
    opacity: 0.5,
    transform: [{ scale: 0.93 }],
  },
  ghostEmoji: {
    fontSize: 26,
    lineHeight: 30,
  },
  ghostLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  actionSquare: {
    width: 66,
    height: 66,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeSquare: {
    backgroundColor: colors.emerald,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  undoSquare: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionSquarePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.93 }],
  },
});

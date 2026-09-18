import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import CompleteBurst from './CompleteBurst';
import { currentStreak, isHabitCompleteOn, isHabitCompleteToday } from './store';
import TaskCardOverlay, { type CardMetrics } from './TaskCardOverlay';
import { todayKey } from './dates';
import type { Habit } from './types';

type HabitCardProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onReschedule: (habit: Habit) => void;
  readOnly?: boolean;
  /** When set (calendar focus), completion is historical for that day. */
  viewDay?: string;
};

function HabitCard({
  habit,
  onToggle,
  onDelete,
  onEdit,
  onReschedule,
  readOnly,
  viewDay,
}: HabitCardProps) {
  const day = viewDay ?? todayKey();
  const isToday = day === todayKey();
  const completed = isToday ? isHabitCompleteToday(habit) : isHabitCompleteOn(habit, day);
  const streak = currentStreak(habit.completionDates, todayKey());
  const checkAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const cardRef = useRef<View>(null);
  const hasOpenedRef = useRef(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [cardMetrics, setCardMetrics] = useState<CardMetrics | null>(null);
  const [burstSeq, setBurstSeq] = useState(0);

  if (overlayOpen) hasOpenedRef.current = true;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: completed ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [checkAnim, completed]);

  const playCheckAnim = useCallback(
    (nextCompleted: boolean) => {
      if (nextCompleted) {
        Animated.sequence([
          Animated.spring(checkAnim, {
            toValue: 1.2,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(checkAnim, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.spring(checkAnim, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }
    },
    [checkAnim],
  );

  const handleCheckboxPress = () => {
    if (readOnly || !isToday) return;
    const next = !completed;
    void Haptics.impactAsync(
      next ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light,
    );
    playCheckAnim(next);
    if (next) setBurstSeq((n) => n + 1);
    onToggle(habit.id);
  };

  const handleCardPress = () => {
    if (readOnly) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const node = cardRef.current;
    if (!node) {
      setCardMetrics({ x: 24, y: 180, width: 320, height: 72 });
      setOverlayOpen(true);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      setCardMetrics({ x, y, width, height });
      setOverlayOpen(true);
    });
  };

  const typeLabel = habit.taskType === 'daily' ? 'Nawyk' : 'Jednorazowe';

  return (
    <>
      <Pressable
        onPress={handleCardPress}
        disabled={readOnly || overlayOpen}
        testID={`habit-card-${habit.id}`}
      >
        <View
          ref={cardRef}
          collapsable={false}
          style={[
            styles.cardOuter,
            {
              opacity: overlayOpen ? 0 : 1,
              borderColor: completed ? 'rgba(255, 200, 69, 0.45)' : colors.border,
            },
          ]}
        >
          <View style={[styles.cardInner, completed && { backgroundColor: colors.goldDim }]}>
            <View style={styles.cardLeft}>
              <Text style={styles.icon}>{habit.icon}</Text>
              <View style={styles.info}>
                <Text
                  style={[styles.name, completed && styles.nameCompleted]}
                  numberOfLines={2}
                >
                  {habit.name}
                </Text>
                <Text style={styles.meta}>
                  {typeLabel}
                  {habit.taskType === 'daily' && streak > 0 ? ` · ${streak} dni` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <Pressable
                onPress={handleCheckboxPress}
                disabled={readOnly || !isToday}
                hitSlop={8}
                testID={`habit-check-${habit.id}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: completed }}
                accessibilityLabel={habit.name}
              >
                <Animated.View
                  style={[
                    styles.checkCircle,
                    {
                      backgroundColor: completed ? colors.gold : 'transparent',
                      borderColor: completed ? colors.gold : colors.border,
                      transform: [
                        {
                          scale: checkAnim.interpolate({
                            inputRange: [0, 1, 1.2],
                            outputRange: [1, 1, 1.15],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {completed ? (
                    <Ionicons name="checkmark" size={16} color="#1a1228" />
                  ) : null}
                </Animated.View>
              </Pressable>
            </View>
          </View>
          <View
            style={[
              styles.cardBottom,
              { backgroundColor: completed ? 'rgba(255, 200, 69, 0.55)' : colors.border },
            ]}
          />
          <View pointerEvents="none" style={styles.burstLayer}>
            <CompleteBurst seq={burstSeq} />
          </View>
        </View>
      </Pressable>

      {!readOnly && hasOpenedRef.current ? (
        <TaskCardOverlay
          visible={overlayOpen}
          habit={habit}
          originMetrics={cardMetrics}
          onClose={() => setOverlayOpen(false)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onReschedule={onReschedule}
        />
      ) : null}
    </>
  );
}

export default memo(HabitCard);

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  burstLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 14,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  icon: {
    fontSize: 24,
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  nameCompleted: {
    opacity: 0.55,
    textDecorationLine: 'line-through',
  },
  meta: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottom: {
    height: 4,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
});

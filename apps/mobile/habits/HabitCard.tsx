import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { isHabitCompleteToday } from './store';
import type { Habit } from './types';

type HabitCardProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onLongPress: (habit: Habit) => void;
};

function HabitCard({ habit, onToggle, onLongPress }: HabitCardProps) {
  const completed = isHabitCompleteToday(habit);
  const checkAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: completed ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [checkAnim, completed]);

  const handleCheckboxPress = () => {
    void Haptics.impactAsync(
      completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );
    if (completed) {
      Animated.spring(checkAnim, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
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
    }
    onToggle(habit.id);
  };

  const handleCardPress = () => {
    void Haptics.impactAsync(
      completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    onToggle(habit.id);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      onLongPress={() => onLongPress(habit)}
      delayLongPress={380}
      testID={`habit-card-${habit.id}`}
    >
      <View
        style={[
          styles.cardOuter,
          { borderColor: completed ? 'rgba(255, 200, 69, 0.45)' : colors.border },
        ]}
      >
        <View style={[styles.cardInner, completed && { backgroundColor: colors.goldDim }]}>
          <View style={styles.cardLeft}>
            <Text style={styles.icon}>{completed ? '✦' : '◇'}</Text>
            <Text
              style={[styles.name, completed && styles.nameCompleted]}
              numberOfLines={2}
            >
              {habit.name}
            </Text>
          </View>

          <Pressable
            onPress={handleCheckboxPress}
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
        <View
          style={[
            styles.cardBottom,
            { backgroundColor: completed ? 'rgba(255, 200, 69, 0.55)' : colors.border },
          ]}
        />
      </View>
    </Pressable>
  );
}

export default memo(HabitCard);

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: colors.surface,
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
    fontSize: 18,
    color: colors.gold,
    width: 22,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  nameCompleted: {
    opacity: 0.55,
    textDecorationLine: 'line-through',
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

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import ActivityHeatmap from './ActivityHeatmap';
import { formatDayLabel } from './dates';
import { isHabitCompleteOn, isHabitPlannedForDate } from './store';
import type { ActivityByDate, Habit } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  habits: Habit[];
  activityByDate: ActivityByDate;
  today: string;
  initialDate?: string | null;
  onJumpToDate?: (key: string) => void;
};

export default function ChroniclesModal({
  visible,
  onClose,
  habits,
  activityByDate,
  today,
  initialDate,
  onJumpToDate,
}: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setSelected(initialDate ?? null);
  }, [visible, initialDate]);

  const rows = useMemo(() => {
    if (!selected) return [];
    return habits.filter((h) => isHabitPlannedForDate(h, selected, today));
  }, [habits, selected, today]);

  const completedNames = useMemo(() => {
    if (!selected) return [];
    return habits
      .filter((h) => isHabitCompleteOn(h, selected))
      .map((h) => h.name);
  }, [habits, selected]);

  const handleClose = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={[styles.shell, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={handleClose} style={styles.iconBtn} accessibilityLabel="Zamknij kroniki">
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.hero}>Kroniki</Text>
          <Text style={styles.sectionLabel}>Historia aktywności</Text>
          <View style={styles.card}>
            <ActivityHeatmap
              activityByDate={activityByDate}
              embedded
              title="Wszystkie questy"
              selectedDate={selected}
              onSelectDate={(key) => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelected(key);
              }}
            />
          </View>

          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>
              {selected ? formatDayLabel(selected) : 'Wybierz dzień na heatmapie'}
            </Text>
            {selected ? (
              rows.length === 0 && completedNames.length === 0 ? (
                <Text style={styles.muted}>Brak questów tego dnia.</Text>
              ) : (
                <>
                  {rows.map((habit) => {
                    const done = isHabitCompleteOn(habit, selected);
                    return (
                      <View key={habit.id} style={styles.logRow}>
                        <Text style={styles.logIcon}>{habit.icon}</Text>
                        <Text
                          style={[styles.logName, done && styles.logNameDone]}
                          numberOfLines={2}
                        >
                          {habit.name}
                        </Text>
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={done ? colors.gold : colors.textMuted}
                        />
                      </View>
                    );
                  })}
                </>
              )
            ) : (
              <Text style={styles.muted}>Tap komórki, żeby zobaczyć dzień.</Text>
            )}
            {selected && onJumpToDate ? (
              <Pressable
                onPress={() => {
                  onJumpToDate(selected);
                  handleClose();
                }}
                style={styles.jumpBtn}
              >
                <Text style={styles.jumpText}>Pokaż na liście Questy</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.divider} />
          {/* TODO(P1): pionowy timeline dni + refleksje + per-habit heatmap trail (audit §5 P1). */}
          <Text style={styles.sectionLabel}>Oś czasu</Text>
          <View style={styles.stub}>
            <Text style={styles.stubTitle}>Timeline — P1</Text>
            <Text style={styles.stubBody}>
              Feed kolejnych dni (jak kronika, nie jak rytuały Hero z goldem) + heatmapa
              pojedynczego nawyku. Zaplanowane w{' '}
              <Text style={styles.stubEm}>docs/reference/v1-quests-ux-audit.md</Text>.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scroll: {
    paddingBottom: 36,
  },
  hero: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.emerald,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.emerald}33`,
    marginBottom: 12,
  },
  dayCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 8,
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  muted: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  logIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  logName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  logNameDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  jumpBtn: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.gold}66`,
    backgroundColor: `${colors.gold}14`,
    paddingVertical: 10,
    alignItems: 'center',
  },
  jumpText: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
    marginBottom: 16,
  },
  stub: {
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  stubTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  stubBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  stubEm: {
    color: colors.gold,
    fontWeight: '700',
  },
});

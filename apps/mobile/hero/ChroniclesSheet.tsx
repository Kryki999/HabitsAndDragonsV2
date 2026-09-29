import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useHabitsStore } from '@/habits/store';
import type { Habit } from '@/habits/types';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Glyph } from '@/ui/Glyph';
import { Heatmap } from '@/ui/Heatmap';
import { tokens } from '@/ui/tokens';

type Props = {
  activityByDate: Record<string, { completions: number; xpFromHabits: number }>;
};

function formatChronicleDate(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function habitActivityMap(habit: Habit): Record<string, { completions: number; xpFromHabits: number }> {
  const out: Record<string, { completions: number; xpFromHabits: number }> = {};
  for (const date of habit.completionDates ?? []) {
    out[date] = { completions: 1, xpFromHabits: 0 };
  }
  return out;
}

export function ChroniclesSheet({ activityByDate }: Props) {
  const allHabits = useHabitsStore((s) => s.habits);
  const removeHabit = useHabitsStore((s) => s.removeHabit);
  const completedHabitNamesByDate = useHabitsStore((s) => s.completedHabitNamesByDate ?? {});
  const dailyReflectionByDate = useHabitsStore((s) => s.dailyReflectionByDate ?? {});

  const pickableHabits = useMemo(
    () => allHabits.filter((h) => h.isActive && h.taskType === 'daily'),
    [allHabits],
  );

  const [generalSelectedDate, setGeneralSelectedDate] = useState<string | null>(null);
  const [habitTrailId, setHabitTrailId] = useState<string | null>(null);
  const [habitSelectedDate, setHabitSelectedDate] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const trailHabit = useMemo(
    () => (habitTrailId ? (pickableHabits.find((h) => h.id === habitTrailId) ?? null) : null),
    [pickableHabits, habitTrailId],
  );

  const habitHeatmapData = useMemo(() => {
    if (!trailHabit) return {};
    return habitActivityMap(trailHabit);
  }, [trailHabit]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Chronicles</Text>
      <Text style={styles.kicker}>General history</Text>
      <Heatmap activityByDate={activityByDate} weeks={12} onSelectDate={setGeneralSelectedDate} />
      <View style={styles.block}>
        <Text style={styles.blockTitle}>
          {generalSelectedDate ? formatChronicleDate(generalSelectedDate) : 'Pick a day'}
        </Text>
        {generalSelectedDate ? (
          <DayLines dateKey={generalSelectedDate} names={completedHabitNamesByDate} reflection={dailyReflectionByDate} />
        ) : (
          <Text style={styles.muted}>Select a day on the heatmap.</Text>
        )}
      </View>

      <Text style={styles.kicker}>Individual habit heatmaps</Text>
      <Pressable
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          setPickerOpen((v) => !v);
        }}
        style={styles.picker}
      >
        <Text style={styles.pickerLabel} numberOfLines={1}>
          {trailHabit ? trailHabit.name : 'Choose a habit…'}
        </Text>
        <Glyph name={pickerOpen ? 'up' : 'down'} size={20} color={tokens.brand} />
      </Pressable>
      {pickerOpen ? (
        <View style={styles.pickerList}>
          {pickableHabits.length === 0 ? (
            <Text style={styles.muted}>No daily habits to inspect yet.</Text>
          ) : (
            pickableHabits.map((h) => (
              <Pressable
                key={h.id}
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Light);
                  setHabitTrailId(h.id);
                  setHabitSelectedDate(null);
                  setPickerOpen(false);
                }}
                style={styles.pickerItem}
              >
                <Text style={styles.pickerItemText}>{h.name}</Text>
              </Pressable>
            ))
          )}
        </View>
      ) : null}

      {trailHabit ? (
        <>
          <Heatmap activityByDate={habitHeatmapData} weeks={12} onSelectDate={setHabitSelectedDate} />
          {habitSelectedDate ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>{formatChronicleDate(habitSelectedDate)}</Text>
              <DayLines
                dateKey={habitSelectedDate}
                names={{ [habitSelectedDate]: trailHabit.completionDates?.includes(habitSelectedDate) ? [trailHabit.name] : [] }}
                reflection={{}}
              />
            </View>
          ) : null}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Habit progress</Text>
            <Text style={styles.line}>Current streak: {trailHabit.currentStreak ?? 0}</Text>
            <Text style={styles.line}>Best streak: {trailHabit.longestStreak ?? 0}</Text>
            <Text style={styles.line}>Total completions: {trailHabit.totalCompletions ?? 0}</Text>
          </View>
          <View style={styles.manage}>
            <Pressable
              onPress={() => Alert.alert('Coming soon', 'Habit editing will arrive in a later update.')}
              style={styles.manageBtn}
            >
              <Text style={styles.manageText}>Edit habit</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                removeHabit(trailHabit.id);
                setHabitTrailId(null);
                setHabitSelectedDate(null);
              }}
              style={styles.manageBtn}
            >
              <Text style={styles.manageText}>Archive habit</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

function DayLines({
  dateKey,
  names,
  reflection,
}: {
  dateKey: string;
  names: Record<string, string[]>;
  reflection: Record<string, string>;
}) {
  const list = names[dateKey] ?? [];
  const note = (reflection[dateKey] ?? '').trim();
  if (list.length === 0 && !note) {
    return <Text style={styles.muted}>No quests recorded for this day.</Text>;
  }
  return (
    <View style={{ gap: 6 }}>
      {list.map((name) => (
        <View key={name} style={styles.questLine}>
          <Glyph name="check" size={16} color={tokens.success} />
          <Text style={styles.line}>{name}</Text>
        </View>
      ))}
      {note ? <Text style={styles.line}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 560,
  },
  content: {
    paddingBottom: 12,
    gap: 10,
  },
  title: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
  },
  kicker: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink3,
    marginTop: 8,
  },
  block: {
    backgroundColor: tokens.surface2,
    borderRadius: tokens.rMd,
    padding: 14,
    gap: 6,
  },
  blockTitle: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.ink,
  },
  muted: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink3,
  },
  line: {
    fontFamily: tokens.font700,
    fontSize: 14,
    color: tokens.ink2,
    flex: 1,
  },
  questLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.surface2,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  pickerLabel: {
    flex: 1,
    fontFamily: tokens.font800,
    fontSize: 15,
    color: tokens.ink,
  },
  pickerList: {
    backgroundColor: tokens.surface2,
    borderRadius: 18,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pickerItemText: {
    fontFamily: tokens.font700,
    fontSize: 15,
    color: tokens.ink,
  },
  manage: {
    flexDirection: 'row',
    gap: 10,
  },
  manageBtn: {
    flex: 1,
    backgroundColor: tokens.surface2,
    borderRadius: tokens.rPill,
    alignItems: 'center',
    paddingVertical: 12,
  },
  manageText: {
    fontFamily: tokens.font800,
    fontSize: 14,
    color: tokens.brandDeep,
  },
});

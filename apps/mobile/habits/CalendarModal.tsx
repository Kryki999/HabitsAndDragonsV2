import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import {
  buildMonthGridCells,
  dateKeyFromDate,
  formatDayLabel,
  formatMonthYear,
  mondayOfWeek,
  parseDateKey,
  todayKey,
} from './dates';
import type { ActivityByDate } from './types';

const WEEK_LETTERS = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'] as const;
const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  focusDateKey: string | null;
  onSelectDate: (key: string) => void;
  activityByDate: ActivityByDate;
};

export default function CalendarModal({
  visible,
  onClose,
  focusDateKey,
  onSelectDate,
  activityByDate,
}: Props) {
  const insets = useSafeAreaInsets();
  const today = todayKey();
  const selected = focusDateKey ?? today;
  const parsed = parseDateKey(selected) ?? parseDateKey(today)!;
  const [year, setYear] = useState(parsed.y);
  const [month, setMonth] = useState(parsed.m);
  const [weekMonday, setWeekMonday] = useState(() => mondayOfWeek(new Date()));

  useEffect(() => {
    if (!visible) return;
    const p = parseDateKey(focusDateKey ?? today);
    if (p) {
      setYear(p.y);
      setMonth(p.m);
      const d = new Date(p.y, p.m - 1, p.d);
      setWeekMonday(mondayOfWeek(d));
    }
  }, [visible, focusDateKey, today]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekMonday);
        d.setDate(weekMonday.getDate() + i);
        return d;
      }),
    [weekMonday],
  );

  const cells = useMemo(() => buildMonthGridCells(year, month), [year, month]);

  const pick = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDate(key);
    onClose();
  };

  const shiftWeek = (dir: -1 | 1) => {
    const next = new Date(weekMonday);
    next.setDate(weekMonday.getDate() + dir * 7);
    setWeekMonday(next);
    const thu = new Date(next);
    thu.setDate(next.getDate() + 3);
    setYear(thu.getFullYear());
    setMonth(thu.getMonth() + 1);
  };

  const shiftMonth = (dir: -1 | 1) => {
    let m = month + dir;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
    setWeekMonday(mondayOfWeek(new Date(y, m - 1, 1)));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.shell, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconBtn} accessibilityLabel="Zamknij">
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Kalendarz</Text>
          <Pressable
            onPress={() => pick(today)}
            style={styles.todayChip}
            accessibilityLabel="Dziś"
          >
            <Text style={styles.todayChipText}>Dziś</Text>
          </Pressable>
        </View>

        <View style={styles.weekNav}>
          <Pressable onPress={() => shiftWeek(-1)} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.gold} />
          </Pressable>
          <Text style={styles.weekLabel}>{formatMonthYear(year, month)}</Text>
          <Pressable onPress={() => shiftWeek(1)} style={styles.iconBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.gold} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day, idx) => {
            const key = dateKeyFromDate(day);
            const isSelected = key === selected;
            const isToday = key === today;
            const hasActivity = (activityByDate[key]?.completions ?? 0) > 0;
            return (
              <Pressable
                key={key}
                onPress={() => pick(key)}
                style={[
                  styles.weekCell,
                  isSelected && styles.weekCellSelected,
                  isToday && !isSelected && styles.weekCellToday,
                ]}
              >
                <Text style={[styles.weekLetter, (isSelected || isToday) && styles.accentText]}>
                  {WEEK_LETTERS[idx]}
                </Text>
                <Text
                  style={[
                    styles.weekNum,
                    isSelected && styles.accentText,
                    isToday && !isSelected && { color: colors.emerald },
                  ]}
                >
                  {day.getDate()}
                </Text>
                <View style={[styles.dot, hasActivity && styles.dotOn]} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.monthNav}>
          <Pressable onPress={() => shiftMonth(-1)} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.monthTitle}>{formatMonthYear(year, month)}</Text>
          <Pressable onPress={() => shiftMonth(1)} style={styles.iconBtn}>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.dowRow}>
          {WEEKDAY_LABELS.map((lbl) => (
            <Text key={lbl} style={styles.dow}>
              {lbl}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {cells.map((dayNum, i) => {
            if (dayNum === null) {
              return <View key={`e-${i}`} style={styles.monthCell} />;
            }
            const key = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = key === selected;
            const isToday = key === today;
            const hasActivity = (activityByDate[key]?.completions ?? 0) > 0;
            return (
              <Pressable
                key={key}
                onPress={() => pick(key)}
                style={[
                  styles.monthCell,
                  isSelected && styles.monthCellSelected,
                  isToday && !isSelected && styles.monthCellToday,
                ]}
              >
                <Text
                  style={[
                    styles.monthNum,
                    isSelected && styles.accentText,
                    key > today && styles.futureNum,
                  ]}
                >
                  {dayNum}
                </Text>
                {hasActivity ? <View style={styles.dotOn} /> : <View style={styles.dot} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.hint}>
          {selected === today
            ? 'Dziś — odhaczasz na liście.'
            : selected < today
              ? `${formatDayLabel(selected)} · historia (tylko podgląd).`
              : `${formatDayLabel(selected)} · plan (complete odblokuje się tego dnia).`}
        </Text>
        <Text style={styles.subHint}>
          Tap dnia wraca do Questy z tym filtrem.
        </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayChip: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.gold}22`,
    borderWidth: 1,
    borderColor: `${colors.gold}66`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayChipText: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 13,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 3,
  },
  weekCellSelected: {
    backgroundColor: `${colors.gold}28`,
    borderWidth: 1.5,
    borderColor: `${colors.gold}aa`,
  },
  weekCellToday: {
    borderWidth: 1,
    borderColor: `${colors.emerald}88`,
  },
  weekLetter: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  weekNum: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  accentText: {
    color: colors.gold,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  dotOn: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthTitle: {
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthCell: {
    width: '14.285%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 3,
  },
  monthCellSelected: {
    backgroundColor: `${colors.gold}22`,
  },
  monthCellToday: {
    borderWidth: 1,
    borderColor: `${colors.emerald}66`,
  },
  monthNum: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  futureNum: {
    opacity: 0.4,
  },
  hint: {
    marginTop: 20,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  subHint: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 12,
  },
});

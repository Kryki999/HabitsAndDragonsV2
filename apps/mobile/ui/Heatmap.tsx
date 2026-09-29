import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/ui/tokens';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'] as const;

/** surface-2 → success 30% white → 58% → success → success-deep */
const LEVEL = [
  tokens.surface2,
  '#CFF0DC',
  '#A2E3BB',
  tokens.success,
  tokens.successDeep,
] as const;

type Activity = { completions: number; xpFromHabits: number };

type DayCell = { key: string; level: number; future: boolean };

type Props = {
  activityByDate: Record<string, Activity | undefined>;
  weeks?: number;
  onSelectDate?: (dateKey: string) => void;
};

function formatDayKey(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

function intensity(day: Activity | undefined): number {
  if (!day) return 0;
  const score = day.completions * 3 + Math.floor(day.xpFromHabits / 22);
  if (score <= 0) return 0;
  if (score <= 3) return 1;
  if (score <= 8) return 2;
  if (score <= 16) return 3;
  return 4;
}

export function Heatmap({ activityByDate, weeks = 12, onSelectDate }: Props) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayKey = formatDayKey(today);

  const dow = today.getDay();
  const daysFromMon = dow === 0 ? 6 : dow - 1;
  const thisMon = new Date(today);
  thisMon.setDate(today.getDate() - daysFromMon);
  const startMon = new Date(thisMon);
  startMon.setDate(thisMon.getDate() - (weeks - 1) * 7);

  const monthLabels: (string | null)[] = [];
  const columns: DayCell[][] = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(startMon);
    weekStart.setDate(startMon.getDate() + w * 7);
    const m = weekStart.getMonth();
    if (m !== lastMonth) {
      monthLabels.push(MONTHS[m]!);
      lastMonth = m;
    } else {
      monthLabels.push(null);
    }

    const col: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      const key = formatDayKey(day);
      const future = day > today;
      col.push({
        key,
        level: future ? 0 : intensity(activityByDate[key]),
        future,
      });
    }
    columns.push(col);
  }

  return (
    <View>
      <View style={styles.monthRow}>
        <View style={styles.dayCol} />
        {monthLabels.map((label, i) => (
          <Text key={`m-${i}`} style={styles.month} numberOfLines={1}>
            {label ?? ''}
          </Text>
        ))}
      </View>
      {DAY_LABELS.map((label, d) => (
        <View key={`r-${d}`} style={styles.dayRow}>
          <Text style={styles.dayLabel}>{label}</Text>
          {columns.map((col, w) => {
            const cell = col[d]!;
            const isToday = cell.key === todayKey;
            return (
              <Pressable
                key={cell.key}
                disabled={cell.future || !onSelectDate}
                onPress={() => onSelectDate?.(cell.key)}
                accessibilityRole="button"
                accessibilityLabel={cell.key}
                style={[
                  styles.cell,
                  { backgroundColor: LEVEL[cell.level] ?? LEVEL[0] },
                  isToday && styles.today,
                ]}
              />
            );
          })}
        </View>
      ))}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {LEVEL.map((color) => (
          <View key={color} style={[styles.legendSwatch, { backgroundColor: color }]} />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  month: {
    flex: 1,
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    color: tokens.ink3,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  dayCol: {
    width: 30,
  },
  dayLabel: {
    width: 30,
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    color: tokens.ink3,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  today: {
    borderColor: tokens.gold,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  legendText: {
    fontFamily: tokens.font800,
    fontSize: 11,
    lineHeight: 13,
    color: tokens.ink3,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});

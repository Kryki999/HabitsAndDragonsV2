import { useEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { dateKeyFromDate } from './dates';
import type { ActivityByDate } from './types';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const DOW_LABEL_W = 14;
const DOW_LABEL_GAP = 5;
const MONTH_ROW_H = 16;

const MONTHS = [
  'Sty',
  'Lut',
  'Mar',
  'Kwi',
  'Maj',
  'Cze',
  'Lip',
  'Sie',
  'Wrz',
  'Paź',
  'Lis',
  'Gru',
] as const;

const DOW_LABELS = ['P', '', 'Ś', '', 'P', '', 'N'] as const;

const LEVEL_BG: readonly string[] = [
  '#12101a',
  '#1a3d28',
  '#248f5a',
  '#3dd68c',
  '#ffc845',
];

type DayCell = { key: string; level: number } | null;
type WeekColumn = DayCell[];

function dayIntensity(day: { completions: number } | undefined): number {
  const n = day?.completions ?? 0;
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 5) return 3;
  return 4;
}

type Props = {
  activityByDate: ActivityByDate;
  embedded?: boolean;
  compact?: boolean;
  title?: string;
  selectedDate?: string | null;
  onSelectDate?: (dateKey: string) => void;
  numDays?: number;
};

const DEFAULT_NUM_DAYS = 91;

export default function ActivityHeatmap({
  activityByDate,
  embedded,
  compact,
  title = 'Aktywność',
  selectedDate,
  onSelectDate,
  numDays = DEFAULT_NUM_DAYS,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const cell = compact ? 11 : CELL_SIZE;
  const numWeeks = Math.max(5, Math.ceil(numDays / 7));

  const { weeks, monthMap } = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const dow = today.getDay();
    const daysFromMon = dow === 0 ? 6 : dow - 1;
    const thisMon = new Date(today);
    thisMon.setDate(today.getDate() - daysFromMon);
    const startMon = new Date(thisMon);
    startMon.setDate(thisMon.getDate() - (numWeeks - 1) * 7);

    const weeksData: WeekColumn[] = [];
    const monthLabelMap: Record<number, string> = {};
    let lastSeenMonth = -1;

    for (let w = 0; w < numWeeks; w++) {
      const weekStart = new Date(startMon);
      weekStart.setDate(startMon.getDate() + w * 7);
      const col: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        if (day > today) {
          col.push(null);
        } else {
          const key = dateKeyFromDate(day);
          col.push({ key, level: dayIntensity(activityByDate[key]) });
        }
      }
      const m = weekStart.getMonth();
      if (m !== lastSeenMonth) {
        monthLabelMap[w] = MONTHS[m] ?? '';
        lastSeenMonth = m;
      }
      weeksData.push(col);
    }

    return { weeks: weeksData, monthMap: monthLabelMap };
  }, [activityByDate, numWeeks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, [numWeeks]);

  return (
    <View style={[styles.wrap, embedded && styles.wrapEmbedded, compact && styles.wrapCompact]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Ostatnie {numWeeks} tyg.</Text>
      </View>

      <View style={styles.heatmapViewport}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.heatmapScrollContent}
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({ animated: false });
          }}
        >
          <View>
            <View style={[styles.monthRow, compact && { height: 14 }]}>
              <View style={{ width: DOW_LABEL_W + DOW_LABEL_GAP }} />
              {weeks.map((_, wi) => (
                <View
                  key={wi}
                  style={{
                    width: cell,
                    marginRight: wi < weeks.length - 1 ? CELL_GAP : 0,
                    alignItems: 'flex-start',
                  }}
                >
                  {monthMap[wi] !== undefined && !compact ? (
                    <Text style={styles.monthLabel}>{monthMap[wi]}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={styles.gridRow}>
              <View style={[styles.dowCol, { width: DOW_LABEL_W, marginRight: DOW_LABEL_GAP }]}>
                {DOW_LABELS.map((lbl, i) => (
                  <View
                    key={i}
                    style={{
                      height: cell,
                      marginBottom: i < 6 ? CELL_GAP : 0,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}
                  >
                    {compact ? null : <Text style={styles.dowLabel}>{lbl}</Text>}
                  </View>
                ))}
              </View>

              {weeks.map((col, wi) => (
                <View
                  key={wi}
                  style={[
                    styles.weekCol,
                    { width: cell, marginRight: wi < weeks.length - 1 ? CELL_GAP : 0 },
                  ]}
                >
                  {col.map((cellData, di) => {
                    const isLast = di === 6;
                    if (cellData === null) {
                      return (
                        <View
                          key={`ph-${wi}-${di}`}
                          style={{
                            width: cell,
                            height: cell,
                            marginBottom: isLast ? 0 : CELL_GAP,
                          }}
                        />
                      );
                    }
                    const isSelected = selectedDate === cellData.key;
                    return (
                      <Pressable
                        key={cellData.key}
                        onPress={onSelectDate ? () => onSelectDate(cellData.key) : undefined}
                        disabled={!onSelectDate}
                        hitSlop={8}
                        testID={`heatmap-cell-${cellData.key}`}
                        style={({ pressed }) => ({
                          width: cell,
                          height: cell,
                          borderRadius: 3,
                          marginBottom: isLast ? 0 : CELL_GAP,
                          backgroundColor: LEVEL_BG[cellData.level] ?? LEVEL_BG[0],
                          borderWidth: isSelected ? 2 : 1,
                          borderColor: isSelected
                            ? colors.gold
                            : cellData.level >= 3
                              ? `${colors.gold}55`
                              : `${colors.border}44`,
                          opacity: pressed && onSelectDate ? 0.8 : 1,
                        })}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {compact ? null : (
        <View style={styles.legendRow}>
          <Text style={styles.legendMuted}>mniej</Text>
          <View style={styles.legendDots}>
            {LEVEL_BG.map((c, i) => (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: c,
                  borderWidth: 1,
                  borderColor: `${colors.border}88`,
                }}
              />
            ))}
          </View>
          <Text style={styles.legendMuted}>więcej</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    width: '100%',
  },
  wrapEmbedded: {
    marginBottom: 0,
  },
  wrapCompact: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: 11,
    color: colors.textMuted,
    opacity: 0.85,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: MONTH_ROW_H,
    marginBottom: 4,
  },
  heatmapViewport: {
    overflow: 'hidden',
    borderRadius: 2,
  },
  heatmapScrollContent: {
    paddingLeft: 1,
    paddingRight: 4,
  },
  monthLabel: {
    fontSize: 10,
    color: colors.textMuted,
    opacity: 0.75,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dowCol: {
    flexDirection: 'column',
  },
  dowLabel: {
    fontSize: 9,
    color: colors.textMuted,
    opacity: 0.55,
  },
  weekCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  legendMuted: {
    fontSize: 10,
    color: colors.textMuted,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});

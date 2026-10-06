import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  formatStatValue,
  HERO_HEX_LABELS,
  HERO_HEX_STAT_AXIS_ORDER,
  hexHasPositiveDelta,
  type HeroHexStats,
} from '@/constants/heroHexStats';
import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { useOnboardingStore } from '@/onboarding/store';
import { startOfWeekMonday, shiftDateKey, todayKey, yesterdayKey } from '@/lib/dateKey';
import { ButtonFlow } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { Portrait } from '@/ui/Portrait';
import { HEX_STAT_STICKER, StatHex } from '@/ui/StatHex';
import { Sticker } from '@/ui/Sticker';
import { shadowOnCanvas, tokens } from '@/ui/tokens';

type Step = 'welcome' | 'streak' | 'hex';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

function usePersistHydrated(): boolean {
  const [hero, setHero] = useState(() => useHeroStore.persist.hasHydrated());
  const [habits, setHabits] = useState(() => useHabitsStore.persist.hasHydrated());
  useEffect(() => {
    const offHero = useHeroStore.persist.onFinishHydration(() => setHero(true));
    const offHabits = useHabitsStore.persist.onFinishHydration(() => setHabits(true));
    return () => {
      if (typeof offHero === 'function') offHero();
      if (typeof offHabits === 'function') offHabits();
    };
  }, []);
  return hero && habits;
}

function previewLoginStreak(
  lastMorningFlowDate: string | null,
  loginStreakDays: number,
  today: string,
  yesterday: string,
): number {
  if (lastMorningFlowDate === today) return Math.max(1, loginStreakDays);
  if (lastMorningFlowDate === yesterday) return Math.max(1, loginStreakDays) + 1;
  return 1;
}

export function MorningLoginGate() {
  const hydrated = usePersistHydrated();
  const [clock, setClock] = useState(() => todayKey());
  const lastMorningFlowDate = useHeroStore((s) => s.lastMorningFlowDate);
  const loginStreakDays = useHeroStore((s) => s.loginStreakDays);
  const morningLoginDates = useHeroStore((s) => s.morningLoginDates);
  const heroDisplayName = useHeroStore((s) => s.heroDisplayName);
  const completeMorningLogin = useHeroStore((s) => s.completeMorningLogin);
  const previewMorningHexReveal = useHeroStore((s) => s.previewMorningHexReveal);
  const onboardingComplete = useOnboardingStore((s) => s.complete);

  const [step, setStep] = useState<Step>('welcome');
  const [hexAnim, setHexAnim] = useState<{
    from: HeroHexStats;
    to: HeroHexStats;
    delta: HeroHexStats;
  } | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') setClock(todayKey());
    });
    return () => sub.remove();
  }, []);

  const open = hydrated && onboardingComplete && lastMorningFlowDate !== clock;

  useEffect(() => {
    if (open) {
      setStep('welcome');
      setHexAnim(null);
    }
  }, [open, clock]);

  const yesterday = yesterdayKey();
  const streak = previewLoginStreak(lastMorningFlowDate, loginStreakDays, clock, yesterday);
  const name = heroDisplayName?.trim() || '';
  const loginSet = useMemo(() => new Set(morningLoginDates ?? []), [morningLoginDates]);
  const week = useMemo(() => {
    const monday = startOfWeekMonday(clock);
    return WEEKDAYS.map((label, i) => {
      const date = shiftDateKey(monday, i);
      const isToday = date === clock;
      return { label, date, isToday, done: loginSet.has(date) && !isToday, now: isToday };
    });
  }, [clock, loginSet]);

  const goStreak = useCallback(() => setStep('streak'), []);
  const goHex = useCallback(() => {
    setHexAnim(previewMorningHexReveal());
    setStep('hex');
  }, [previewMorningHexReveal]);
  const finish = useCallback(() => {
    completeMorningLogin();
  }, [completeMorningLogin]);

  if (!open) return null;

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" statusBarTranslucent>
      <LinearGradient colors={[tokens.canvasHi, tokens.canvas]} locations={[0, 0.42]} style={styles.fill}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
          {step === 'welcome' ? <WelcomeStep name={name} onContinue={goStreak} /> : null}
          {step === 'streak' ? <StreakStep streak={streak} week={week} onContinue={goHex} /> : null}
          {step === 'hex' && hexAnim ? (
            <HexStep from={hexAnim.from} to={hexAnim.to} delta={hexAnim.delta} onContinue={finish} />
          ) : null}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

function WelcomeStep({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <View style={styles.col}>
      <View style={styles.heroBlock}>
        <Portrait xl />
        <Text style={styles.kicker}>A new day</Text>
        <Text style={styles.display} numberOfLines={2}>
          {name ? `Welcome, ${name}` : 'Welcome'}
        </Text>
        <Text style={styles.note}>
          {name ? 'The realm remembers you.' : 'The realm is waiting. Check in, then take the day.'}
        </Text>
      </View>
      <View style={styles.foot}>
        <ButtonFlow label="Begin the day" onPress={onContinue} block testID="morning-welcome-continue" />
      </View>
    </View>
  );
}

function StreakStep({
  streak,
  week,
  onContinue,
}: {
  streak: number;
  week: readonly { label: string; date: string; isToday: boolean; done: boolean; now: boolean }[];
  onContinue: () => void;
}) {
  return (
    <View style={styles.col}>
      <View style={styles.heroBlock}>
        <View style={styles.medal}>
          <Portrait xl />
          <View style={styles.medalBadge}>
            <Sticker name="crown" size={28} />
          </View>
        </View>
        <Text style={styles.heroNum}>{streak}</Text>
        <Text style={styles.flowTitle}>Day streak</Text>
      </View>
      <Card style={styles.weekCard}>
        <View style={styles.weekLabels}>
          {week.map((d) => (
            <Text key={d.date} style={[styles.weekLbl, d.now && styles.weekLblNow]}>
              {d.label}
            </Text>
          ))}
        </View>
        <View style={styles.weekDots}>
          {week.map((d) => (
            <View key={d.date} style={[styles.dot, d.done && styles.dotDone, d.now && styles.dotNow]}>
              {d.now ? (
                <Sticker name="crown" size={22} />
              ) : d.done ? (
                <Glyph name="check" size={16} color={tokens.onCanvas} />
              ) : null}
            </View>
          ))}
        </View>
      </Card>
      <Text style={styles.note}>Show up. The hex waits for yesterday’s work.</Text>
      <View style={styles.foot}>
        <ButtonFlow label="Continue" onPress={onContinue} block testID="morning-streak-continue" />
      </View>
    </View>
  );
}

function HexStep({
  from,
  to,
  delta,
  onContinue,
}: {
  from: HeroHexStats;
  to: HeroHexStats;
  delta: HeroHexStats;
  onContinue: () => void;
}) {
  const grew = hexHasPositiveDelta(delta);
  const lines = HERO_HEX_STAT_AXIS_ORDER.filter((id) => delta[id] > 0.0001);
  return (
    <View style={styles.col}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.hexScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Yesterday</Text>
        <Text style={styles.display}>{grew ? 'Your hex grew' : 'A quiet night'}</Text>
        <StatHex stats={to} animateFrom={from} />
        <Card style={styles.deltaCard}>
          {grew ? (
            lines.map((id) => (
              <View key={id} style={styles.deltaRow}>
                <Sticker name={HEX_STAT_STICKER[id]} size={22} />
                <Text style={styles.deltaName}>{HERO_HEX_LABELS[id]}</Text>
                <Text style={styles.deltaVal}>+{formatStatValue(delta[id])}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.quiet}>No tagged quests completed yesterday. The hex holds.</Text>
          )}
        </Card>
      </ScrollView>
      <View style={styles.foot}>
        <ButtonFlow label="Enter the realm" onPress={onContinue} block testID="morning-hex-continue" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  col: {
    flex: 1,
    paddingHorizontal: tokens.screenX,
    paddingTop: 12,
  },
  heroBlock: {
    alignItems: 'center',
    marginTop: 12,
  },
  kicker: {
    marginTop: 18,
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  display: {
    marginTop: 6,
    fontFamily: tokens.font900,
    fontSize: 44,
    lineHeight: 50,
    color: tokens.onCanvas,
    textAlign: 'center',
    ...shadowOnCanvas,
  },
  note: {
    marginTop: 10,
    fontFamily: tokens.font700,
    fontSize: 16,
    lineHeight: 22,
    color: tokens.onCanvas,
    textAlign: 'center',
    ...shadowOnCanvas,
  },
  heroNum: {
    marginTop: 8,
    fontFamily: tokens.font900,
    fontSize: 104,
    lineHeight: 110,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  flowTitle: {
    marginTop: -8,
    fontFamily: tokens.font900,
    fontSize: 28,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  medal: { position: 'relative' },
  medalBadge: {
    position: 'absolute',
    right: 8,
    bottom: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.gold,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, color: tokens.goldDeep }],
  },
  weekCard: { marginTop: 18, padding: 16 },
  weekLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekLbl: {
    width: 36,
    textAlign: 'center',
    fontFamily: tokens.font800,
    fontSize: 12,
    color: tokens.ink3,
  },
  weekLblNow: { color: tokens.ink },
  weekDots: { flexDirection: 'row', justifyContent: 'space-between' },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: tokens.success },
  dotNow: { backgroundColor: tokens.gold },
  deltaCard: { marginTop: 8, padding: 14, gap: 10 },
  hexScroll: { paddingBottom: 12, alignItems: 'stretch' },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deltaName: { flex: 1, fontFamily: tokens.font800, fontSize: 16, color: tokens.ink },
  deltaVal: { fontFamily: tokens.font900, fontSize: 16, color: tokens.brandDeep },
  quiet: { fontFamily: tokens.font700, fontSize: 15, color: tokens.ink2, textAlign: 'center' },
  foot: { marginTop: 'auto', paddingBottom: 12 },
});

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeroQuestTimeline from '@/components/HeroQuestTimeline';
import { HERO_DAILY_RITUALS, HERO_EPIC_MILESTONES } from '@/constants/heroQuestSystem';
import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { AccountBar } from '@/ui/AccountBar';
import { tokens } from '@/ui/tokens';

function calendarYesterdayKey(): string {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return y.toISOString().split('T')[0]!;
}

function calendarTomorrowKey(): string {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split('T')[0]!;
}

function formatRemainingToNextMidnight(now: Date): string {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const ms = Math.max(0, next.getTime() - now.getTime());
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function seededOrderForDay<T extends { id: string }>(items: T[], dayKey: string): T[] {
  const seed = dayKey.split('').reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) >>> 0, 5381);
  return [...items]
    .map((item) => {
      const h = item.id.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, seed);
      return { item, h };
    })
    .sort((a, b) => a.h - b.h)
    .map((x) => x.item);
}

export default function MentorScreen() {
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const ownedItemIds = useHeroStore((s) => s.ownedItemIds);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);
  const bossesKilled = useHeroStore((s) => s.bossesDefeated);
  const heroShopPurchaseEver = useHeroStore((s) => s.heroShopPurchaseEver);
  const heroDailyQuestClaimsDate = useHeroStore((s) => s.heroDailyQuestClaimsDate);
  const heroDailyQuestClaimedIds = useHeroStore((s) => s.heroDailyQuestClaimedIds);
  const heroEpicMilestoneClaimedIds = useHeroStore((s) => s.heroEpicMilestoneClaimedIds);
  const claimHeroDailyQuest = useHeroStore((s) => s.claimHeroDailyQuest);
  const claimHeroEpicMilestone = useHeroStore((s) => s.claimHeroEpicMilestone);

  const habits = useHabitsStore((s) => s.habits);
  const dailyReflectionByDate = useHabitsStore((s) => s.dailyReflectionByDate);
  const planningDayOrderByDate = useHabitsStore((s) => s.planningDayOrderByDate);

  const [nowTick, setNowTick] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNowTick(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayKey = useMemo(() => nowTick.toISOString().split('T')[0]!, [nowTick]);
  const nextDailyResetCountdown = useMemo(() => formatRemainingToNextMidnight(nowTick), [nowTick]);

  const dailyQuestRows = useMemo(() => {
    const visitedSage = false;
    const habitToday = habits.some((h) => h.completedToday);
    const reflectionToday = !!(dailyReflectionByDate[todayKey] ?? '').trim();
    const yKey = calendarYesterdayKey();
    const reflectionYesterday = !!(dailyReflectionByDate[yKey] ?? '').trim();
    const reflectionAnyRecent = reflectionToday || reflectionYesterday;
    const tomorrowKey = calendarTomorrowKey();
    const plannedTomorrow =
      (planningDayOrderByDate[tomorrowKey]?.length ?? 0) > 0 ||
      habits.some((h) => h.isActive && h.scheduledDate === tomorrowKey);
    const claimedIds = heroDailyQuestClaimsDate === todayKey ? heroDailyQuestClaimedIds : [];

    const completeById: Record<string, boolean> = {
      daily_visit_sage: visitedSage,
      daily_complete_quest: habitToday,
      daily_affirmations: visitedSage,
      daily_gratitude: visitedSage,
      daily_mood: reflectionAnyRecent,
      daily_reflection: reflectionAnyRecent,
      daily_refresh_epic: false,
      daily_plan_tomorrow: plannedTomorrow,
      daily_spend_gold: heroShopPurchaseEver,
      daily_save_progress: true,
    };

    const trackableDailyRituals = HERO_DAILY_RITUALS.filter((def) =>
      Object.prototype.hasOwnProperty.call(completeById, def.id),
    );
    const rotatedDailyRituals = seededOrderForDay(trackableDailyRituals, todayKey).slice(0, 4);

    return rotatedDailyRituals.map((def) => ({
      def,
      objectiveComplete: completeById[def.id] ?? false,
      claimed: claimedIds.includes(def.id),
    }));
  }, [
    habits,
    dailyReflectionByDate,
    planningDayOrderByDate,
    heroShopPurchaseEver,
    heroDailyQuestClaimsDate,
    heroDailyQuestClaimedIds,
    todayKey,
  ]);

  const epicQuestRows = useMemo(() => {
    const completeById: Record<string, boolean> = {
      epic_collect_items: ownedItemIds.length >= 1,
      epic_castle_level: playerLevel >= 2,
      epic_defeat_bosses: bossesKilled >= 1,
      epic_add_friend: false,
      epic_rare_item: false,
      epic_bind_relic: equippedRelicId != null,
      epic_first_market_trade: heroShopPurchaseEver,
      epic_bind_email: false,
    };

    return HERO_EPIC_MILESTONES.map((def) => ({
      def,
      objectiveComplete: completeById[def.id] ?? false,
      claimed: heroEpicMilestoneClaimedIds.includes(def.id),
    }));
  }, [
    ownedItemIds.length,
    playerLevel,
    bossesKilled,
    equippedRelicId,
    heroShopPurchaseEver,
    heroEpicMilestoneClaimedIds,
  ]);

  const onClaimDaily = useCallback(
    (def: (typeof HERO_DAILY_RITUALS)[number]) => {
      return claimHeroDailyQuest(def.id, def.rewardGold, def.rewardXP);
    },
    [claimHeroDailyQuest],
  );

  const onClaimEpic = useCallback(
    (def: (typeof HERO_EPIC_MILESTONES)[number]) => {
      return claimHeroEpicMilestone(def.id, def.rewardGold, def.rewardXP);
    },
    [claimHeroEpicMilestone],
  );

  return (
    <LinearGradient
      colors={[tokens.canvasHi, tokens.canvas]}
      locations={[0, 0.28]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.stack}
          showsVerticalScrollIndicator={false}
        >
          <AccountBar />
          <HeroQuestTimeline
            dailyRows={dailyQuestRows}
            epicRows={epicQuestRows}
            onClaimDaily={onClaimDaily}
            onClaimEpic={onClaimEpic}
            dailyResetCountdown={nextDailyResetCountdown}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  stack: {
    paddingHorizontal: tokens.screenX,
    paddingBottom: 28,
    gap: 10,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
});

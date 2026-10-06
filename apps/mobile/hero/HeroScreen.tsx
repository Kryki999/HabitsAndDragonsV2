import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackpackInventoryBody from '@/components/BackpackInventoryBody';
import { ChroniclesSheet } from '@/hero/ChroniclesSheet';
import { TITLE_DEFINITIONS } from '@/constants/titles';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { resolveLootItemById } from '@/lib/itemCatalog';
import { useHabitsStore } from '@/habits/store';
import { useHeroStore } from '@/hero/store';
import { useSocialStore } from '@/social/store';
import { AccountBar } from '@/ui/AccountBar';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonSoft } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { Heatmap } from '@/ui/Heatmap';
import { stickerForLootIcon } from '@/ui/ItemTile';
import { Portrait } from '@/ui/Portrait';
import { Progress } from '@/ui/Progress';
import { SectionHead } from '@/ui/SectionHead';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { StatHex } from '@/ui/StatHex';
import { tokens } from '@/ui/tokens';

const TABS = ['Stats', 'Titles', 'Emotes'] as const;

function formatLogDate(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HeroScreen() {
  const playerLevel = useHeroStore((s) => s.playerLevel);
  const currentLevelXP = useHeroStore((s) => s.currentLevelXP);
  const xpForNext = useHeroStore((s) => s.xpForNextLevel);
  const hexStats = useHeroStore((s) => s.hexStats);
  const heroDisplayName = useHeroStore((s) => s.heroDisplayName);
  const unlockedTitleIds = useHeroStore((s) => s.unlockedTitleIds);
  const equippedOutfitId = useHeroStore((s) => s.equippedOutfitId);
  const equippedRelicId = useHeroStore((s) => s.equippedRelicId);

  const activityByDate = useHabitsStore((s) => s.activityByDate);
  const completedHabitNamesByDate = useHabitsStore((s) => s.completedHabitNamesByDate);
  const dailyReflectionByDate = useHabitsStore((s) => s.dailyReflectionByDate);
  const myCode = useSocialStore((s) => s.myCode);

  const [tab, setTab] = useState<(typeof TABS)[number]>('Stats');
  const [chroniclesOpen, setChroniclesOpen] = useState(false);
  const [logDate, setLogDate] = useState<string | null>(null);

  const name = (heroDisplayName?.trim() || 'Wayfarer').slice(0, 48);
  const unlocked = useMemo(() => new Set(unlockedTitleIds), [unlockedTitleIds]);
  const outfitEntry = equippedOutfitId ? resolveLootItemById(equippedOutfitId) : null;
  const relicEntry = equippedRelicId ? resolveLootItemById(equippedRelicId) : null;

  const onCopyFriendCode = useCallback(async () => {
    if (!myCode) return;
    await Clipboard.setStringAsync(myCode);
    impactAsync(ImpactFeedbackStyle.Light);
  }, [myCode]);

  const logNames = logDate ? (completedHabitNamesByDate[logDate] ?? []) : [];
  const logNote = logDate ? (dailyReflectionByDate[logDate] ?? '').trim() : '';

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

          <Card style={styles.profile}>
            <View style={styles.profileTop}>
              <Portrait
                edit
                outfit={
                  outfitEntry
                    ? { sticker: stickerForLootIcon(outfitEntry.icon), rarity: outfitEntry.rarity }
                    : null
                }
                relic={
                  relicEntry
                    ? { sticker: stickerForLootIcon(relicEntry.icon), rarity: relicEntry.rarity }
                    : null
                }
              />
              <View style={styles.profileCol}>
                <Text style={styles.levelCaption}>Level {playerLevel}</Text>
                <Text style={styles.heroName} numberOfLines={1}>
                  {name}
                </Text>
                <Progress value={currentLevelXP} max={xpForNext} unit="XP" />
              </View>
            </View>

            {tab === 'Stats' ? <StatHex stats={hexStats} /> : null}
            {tab === 'Titles' ? (
              <View style={styles.titles}>
                {TITLE_DEFINITIONS.map((def) => {
                  const open = unlocked.has(def.id);
                  return (
                    <View key={def.id} style={[styles.titleRow, !open && styles.titleLocked]}>
                      <Glyph name={open ? 'check' : 'lock'} size={18} color={open ? tokens.success : tokens.ink3} />
                      <View style={styles.titleCopy}>
                        <Text style={styles.titleName}>{def.name}</Text>
                        <Text style={styles.titleDesc}>{def.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}
            {tab === 'Emotes' ? (
              <View style={styles.emotes}>
                <Text style={styles.emotesCopy}>No emotes yet.</Text>
              </View>
            ) : null}

            <SegmentedControl options={TABS} value={tab} onChange={(v) => setTab(v as (typeof TABS)[number])} />
          </Card>

          <SectionHead label="Equipment" />
          <Card style={styles.padCard}>
            <BackpackInventoryBody scrollable={false} />
          </Card>

          <SectionHead label="Chronicles" />
          <Card style={styles.chron}>
            <View style={styles.chronHead}>
              <Text style={styles.chronTitle}>Habit map</Text>
              <Text style={styles.caption}>Last 12 weeks</Text>
            </View>
            <Heatmap activityByDate={activityByDate} weeks={12} onSelectDate={setLogDate} />
            <ButtonSoft
              label="Open chronicles"
              glyph="calendar"
              block
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Light);
                setChroniclesOpen(true);
              }}
            />
          </Card>

          <Card style={styles.friendCard}>
            <Text style={styles.caption}>Friend code</Text>
            <View style={styles.friendRow}>
              <Text style={styles.friendCode} selectable>
                {myCode}
              </Text>
              <Pressable onPress={onCopyFriendCode} accessibilityLabel="Copy friend code">
                <Text style={styles.copy}>Copy</Text>
              </Pressable>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>

      <BottomSheet visible={chroniclesOpen} onClose={() => setChroniclesOpen(false)} fill>
        <ChroniclesSheet activityByDate={activityByDate ?? {}} />
      </BottomSheet>

      <BottomSheet visible={logDate != null} onClose={() => setLogDate(null)}>
        <Text style={styles.sheetTitle}>Quest log — {logDate ? formatLogDate(logDate) : ''}</Text>
        {logNames.length === 0 && !logNote ? (
          <Text style={styles.sheetMuted}>No quests recorded for this day.</Text>
        ) : (
          <View style={styles.logList}>
            {logNames.map((n) => (
              <View key={n} style={styles.logLine}>
                <Glyph name="check" size={16} color={tokens.success} />
                <Text style={styles.sheetBody}>{n}</Text>
              </View>
            ))}
            {logNote ? <Text style={styles.sheetBody}>{logNote}</Text> : null}
          </View>
        )}
      </BottomSheet>
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
  profile: {
    padding: 16,
    gap: 12,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileCol: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  levelCaption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  heroName: {
    fontFamily: tokens.font900,
    fontSize: 24,
    lineHeight: 28,
    color: tokens.ink,
  },
  titles: {
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleLocked: {
    opacity: 0.4,
  },
  titleCopy: {
    flex: 1,
    gap: 2,
  },
  titleName: {
    fontFamily: tokens.font800,
    fontSize: 16,
    color: tokens.ink,
  },
  titleDesc: {
    fontFamily: tokens.font700,
    fontSize: 13,
    color: tokens.ink2,
  },
  emotes: {
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.surface2,
    borderRadius: tokens.rMd,
    padding: 18,
  },
  emotesCopy: {
    fontFamily: tokens.font800,
    fontSize: 16,
    color: tokens.ink2,
  },
  padCard: {
    padding: 16,
  },
  chron: {
    padding: 16,
    gap: 12,
  },
  chronHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  chronTitle: {
    fontFamily: tokens.font900,
    fontSize: 19,
    color: tokens.ink,
  },
  caption: {
    fontFamily: tokens.font800,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: tokens.ink3,
  },
  friendCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendCode: {
    fontFamily: tokens.font900,
    fontSize: 16,
    color: tokens.ink,
    letterSpacing: 1,
  },
  copy: {
    fontFamily: tokens.font800,
    fontSize: 13,
    color: tokens.brandDeep,
  },
  sheetTitle: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    marginBottom: 12,
  },
  sheetMuted: {
    fontFamily: tokens.font700,
    fontSize: 15,
    color: tokens.ink3,
    marginBottom: 8,
  },
  sheetBody: {
    fontFamily: tokens.font700,
    fontSize: 16,
    color: tokens.ink,
    flex: 1,
  },
  logList: {
    gap: 8,
    marginBottom: 8,
  },
  logLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

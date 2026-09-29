import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import type { HeroQuestDefinition } from '@/constants/heroQuestSystem';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from '@/lib/hapticsGate';
import { BottomSheet } from '@/ui/BottomSheet';
import { ButtonSoft } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Glyph } from '@/ui/Glyph';
import { Progress } from '@/ui/Progress';
import { SectionHead } from '@/ui/SectionHead';
import { Sticker } from '@/ui/Sticker';
import { stickerForHabitIcon } from '@/ui/stickerRegistry';
import { shadowOnCanvas, tokens } from '@/ui/tokens';

export type PathQuestRow = {
  def: HeroQuestDefinition;
  objectiveComplete: boolean;
  claimed: boolean;
};

type Props = {
  dailyRows: PathQuestRow[];
  epicRows: PathQuestRow[];
  onClaimDaily: (def: HeroQuestDefinition) => boolean;
  onClaimEpic: (def: HeroQuestDefinition) => boolean;
  dailyResetCountdown: string;
};

const MENTOR_ROUTE = '/(tabs)/mentor';

function rowProgress(row: PathQuestRow): { value: number; max: number } {
  const { def, objectiveComplete, claimed } = row;
  if (def.tiers && def.tiers.length > 0) {
    const max = def.tiers[def.tierIndex ?? 0] ?? 1;
    if (claimed || objectiveComplete) return { value: max, max };
    return { value: def.tierProgress ?? 0, max };
  }
  return { value: claimed || objectiveComplete ? 1 : 0, max: 1 };
}

function PathQuestCard({
  row,
  onClaim,
  onHint,
  onNavigate,
}: {
  row: PathQuestRow;
  onClaim: (def: HeroQuestDefinition) => boolean;
  onHint: (def: HeroQuestDefinition) => void;
  onNavigate: (def: HeroQuestDefinition) => void;
}) {
  const { def, objectiveComplete, claimed } = row;
  const ready = objectiveComplete && !claimed;
  const showArrow = !!def.navigateTo && def.navigateTo !== MENTOR_ROUTE;
  const progress = rowProgress(row);
  const sticker = stickerForHabitIcon(def.icon);

  const claim = () => {
    impactAsync(ImpactFeedbackStyle.Medium);
    if (onClaim(def)) notificationAsync(NotificationFeedbackType.Success);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.well}>
          <Sticker name={sticker} size={32} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, claimed && styles.dim]} numberOfLines={2}>
            {def.title}
          </Text>
          <Text style={[styles.desc, claimed && styles.dim]} numberOfLines={2}>
            {def.description}
          </Text>
        </View>
        {showArrow ? (
          <Pressable
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Light);
              onNavigate(def);
            }}
            accessibilityLabel="Go"
            hitSlop={8}
          >
            <Glyph name="next" size={22} color={tokens.brand} />
          </Pressable>
        ) : null}
        {claimed ? <Glyph name="check" size={22} color={tokens.success} /> : null}
      </View>
      <Progress value={progress.value} max={progress.max} />
      <View style={styles.meta}>
        <View style={styles.gold}>
          <Text style={styles.goldText}>{def.rewardGold}</Text>
          <Sticker name="coin" size={18} bare />
        </View>
        <Pressable
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            onHint(def);
          }}
          accessibilityLabel="Hint"
        >
          <Text style={styles.hint}>Hint</Text>
        </Pressable>
      </View>
      {ready ? <ButtonSoft label="Claim" onPress={claim} /> : null}
    </Card>
  );
}

export default function HeroQuestTimeline({
  dailyRows,
  epicRows,
  onClaimDaily,
  onClaimEpic,
  dailyResetCountdown,
}: Props) {
  const router = useRouter();
  const [hint, setHint] = useState<HeroQuestDefinition | null>(null);

  const go = useCallback(
    (def: HeroQuestDefinition) => {
      if (def.navigateTo && def.navigateTo !== MENTOR_ROUTE) router.push(def.navigateTo as Href);
    },
    [router],
  );

  const hintGo = hint?.navigateTo && hint.navigateTo !== MENTOR_ROUTE;

  return (
    <View style={styles.root}>
      <SectionHead
        label="Today's rituals"
        trailing={
          <Text style={styles.reset}>Resets in {dailyResetCountdown}</Text>
        }
      />
      <View style={styles.list}>
        {dailyRows.map((row) => (
          <PathQuestCard
            key={row.def.id}
            row={row}
            onClaim={onClaimDaily}
            onHint={setHint}
            onNavigate={go}
          />
        ))}
      </View>
      <View style={styles.spacer} />
      <SectionHead label="Milestones" />
      <View style={styles.list}>
        {epicRows.map((row) => (
          <PathQuestCard
            key={row.def.id}
            row={row}
            onClaim={onClaimEpic}
            onHint={setHint}
            onNavigate={go}
          />
        ))}
      </View>
      <BottomSheet visible={hint != null} onClose={() => setHint(null)}>
        <Text style={styles.hintTitle}>{hint?.title}</Text>
        <Text style={styles.hintBody}>{hint?.hint}</Text>
        {hintGo ? (
          <ButtonSoft
            label="Go now"
            style={{ marginTop: 4 }}
            onPress={() => {
              const dest = hint;
              setHint(null);
              if (dest) go(dest);
            }}
          />
        ) : (
          <ButtonSoft label="Got it" style={{ marginTop: 4 }} onPress={() => setHint(null)} />
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 10,
  },
  reset: {
    fontFamily: tokens.font800,
    fontSize: 12,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
  list: {
    gap: 10,
  },
  spacer: {
    height: 8,
  },
  card: {
    padding: 14,
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  well: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  title: {
    fontFamily: tokens.font800,
    fontSize: 18,
    lineHeight: 22,
    color: tokens.ink,
  },
  desc: {
    fontFamily: tokens.font700,
    fontSize: 14,
    lineHeight: 18,
    color: tokens.ink2,
  },
  dim: {
    opacity: 0.55,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goldText: {
    fontFamily: tokens.font800,
    fontSize: 15,
    color: tokens.ink2,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontFamily: tokens.font800,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: tokens.brand,
  },
  hintTitle: {
    fontFamily: tokens.font900,
    fontSize: 22,
    color: tokens.ink,
    marginBottom: 8,
  },
  hintBody: {
    fontFamily: tokens.font700,
    fontSize: 16,
    lineHeight: 22,
    color: tokens.ink2,
    marginBottom: 16,
  },
});

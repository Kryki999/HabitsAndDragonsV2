import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Card } from '@/ui/Card';
import { CheckButton } from '@/ui/CheckButton';
import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import { stickerForHabitIcon, type StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

export type RewardPoint = { x: number; y: number };

type Props = {
  title: string;
  icon?: string;
  sticker?: StickerName;
  gold: number;
  done?: boolean;
  frozen?: boolean;
  readOnly?: boolean;
  onPress?: () => void;
  onCheck?: (source: RewardPoint) => void;
  onDrag?: () => void;
  testID?: string;
};

export function HabitRow({
  title,
  icon,
  sticker,
  gold,
  done = false,
  frozen = false,
  readOnly = false,
  onPress,
  onCheck,
  onDrag,
  testID,
}: Props) {
  const rewardRef = useRef<View>(null);
  const stickerName = sticker ?? stickerForHabitIcon(icon);
  const locked = frozen || readOnly;

  const check = () => {
    if (locked || !onCheck) return;
    impactAsync(ImpactFeedbackStyle.Heavy);
    rewardRef.current?.measureInWindow((x, y, width, height) => {
      onCheck({ x: x + width / 2, y: y + height / 2 });
    });
  };

  return (
    <Card style={styles.row}>
      <Pressable
        onLongPress={onDrag}
        delayLongPress={180}
        disabled={!onDrag}
        accessibilityLabel="Reorder"
        style={styles.gripHit}
      >
        <Grip />
      </Pressable>
      <Pressable
        onPress={locked ? undefined : onPress}
        disabled={locked || !onPress}
        accessibilityLabel={title}
        testID={testID}
        style={styles.main}
      >
        <View style={styles.well}>
          <Sticker name={stickerName} size={32} />
        </View>
        <Text style={[styles.title, frozen && styles.frozenTitle]} numberOfLines={2}>
          {title}
        </Text>
        <View ref={rewardRef} collapsable={false} style={styles.reward}>
          <Text style={styles.rewardText}>{gold}</Text>
          <Sticker name="coin" size={18} bare />
        </View>
      </Pressable>
      {frozen ? (
        <View style={styles.lock}>
          <Glyph name="lock" size={22} color={tokens.ink2} />
        </View>
      ) : (
        <CheckButton
          done={done}
          disabled={locked}
          onPress={check}
          testID={testID ? `${testID}-check` : undefined}
        />
      )}
    </Card>
  );
}

function Grip() {
  return (
    <View style={styles.grip}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.gripRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 76,
    paddingLeft: 10,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gripHit: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
  },
  grip: {
    width: 6,
    height: 18,
    justifyContent: 'space-between',
  },
  gripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 2.4,
    height: 2.4,
    borderRadius: 2,
    backgroundColor: tokens.ink3,
  },
  well: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: tokens.font800,
    fontSize: 18,
    lineHeight: 22,
    color: tokens.ink,
  },
  frozenTitle: {
    color: tokens.ink2,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontFamily: tokens.font800,
    fontSize: 15,
    color: tokens.ink2,
    fontVariant: ['tabular-nums'],
  },
  lock: {
    width: 56,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

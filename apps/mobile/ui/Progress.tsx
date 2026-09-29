import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/ui/tokens';

type Props = {
  value: number;
  max: number;
  unit?: string;
};

export function Progress({ value, max, unit }: Props) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  const shownValue = Number.isInteger(value) ? String(value) : value.toFixed(0);
  const shownMax = Number.isInteger(max) ? String(max) : max.toFixed(0);
  return (
    <View style={styles.track}>
      <View style={[styles.fillClip, { width: `${pct * 100}%` }]}>
        <View style={styles.fill} />
        <View style={styles.fillLip} />
      </View>
      <Text style={styles.val}>
        {shownValue} / {shownMax}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 26,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fillClip: {
    position: 'absolute',
    left: 3,
    top: 3,
    bottom: 3,
    borderRadius: tokens.rPill,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  fill: {
    flex: 1,
    backgroundColor: tokens.gold,
  },
  fillLip: {
    height: 3,
    backgroundColor: tokens.goldDeep,
  },
  val: {
    textAlign: 'center',
    fontFamily: tokens.font900,
    fontSize: 15,
    color: tokens.ink,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/ui/IconButton';
import { shadowOnCanvas, tokens } from '@/ui/tokens';

type Props = {
  step: number;
  total: number;
  onBack?: () => void;
};

/** C2 top chrome: back · track · "n / n". */
export function StepBar({ step, total, onBack }: Props) {
  const pct = total <= 0 ? 0 : Math.max(0, Math.min(1, step / total));
  return (
    <View style={styles.bar}>
      {onBack ? (
        <IconButton glyph="back" size={40} accessibilityLabel="Back" onPress={onBack} />
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.cnt}>
        {step} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spacer: {
    width: 40,
    height: 40,
  },
  track: {
    flex: 1,
    height: 14,
    borderRadius: tokens.rPill,
    backgroundColor: 'rgba(59, 71, 158, 0.38)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 3,
    top: 3,
    bottom: 3,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    boxShadow: [{ offsetX: 0, offsetY: -2, blurRadius: 0, color: tokens.surface3 }],
  },
  cnt: {
    minWidth: 38,
    textAlign: 'right',
    fontFamily: tokens.font900,
    fontSize: 14,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
});

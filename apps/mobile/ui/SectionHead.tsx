import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { shadowOnCanvas, tokens } from '@/ui/tokens';

type Props = {
  label: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function SectionHead({ label, leading, trailing }: Props) {
  return (
    <View style={styles.row}>
      {leading ? <View style={styles.slot}>{leading}</View> : null}
      <Text
        style={styles.label}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
      >
        {label}
      </Text>
      {trailing ? <View style={styles.slot}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 32,
  },
  slot: {
    flexShrink: 0,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: tokens.font900,
    fontSize: 21,
    lineHeight: 24,
    color: tokens.onCanvas,
    ...shadowOnCanvas,
  },
});

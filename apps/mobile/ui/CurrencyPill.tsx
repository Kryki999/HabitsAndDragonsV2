import { forwardRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  sticker: StickerName;
  value: number;
  /** Override the numeral (shop uses a space thousands separator). */
  text?: string;
  popSignal?: number;
  testID?: string;
  accessibilityLabel?: string;
};

export const CurrencyPill = forwardRef<View, Props>(function CurrencyPill(
  { sticker, value, text, popSignal = 0, testID, accessibilityLabel },
  ref,
) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!popSignal) return;
    scale.value = withSequence(
      withTiming(1.12, { duration: 110, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
      withTiming(1, { duration: 110, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
    );
  }, [popSignal, scale]);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View ref={ref} collapsable={false} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={anim}>
        <View style={styles.pill}>
          <Sticker name={sticker} size={26} bare />
          <Text style={styles.value}>{text ?? String(value)}</Text>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    height: 36,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: tokens.rPill,
    backgroundColor: tokens.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    boxShadow: [shadow.dropSm],
  },
  value: {
    fontFamily: tokens.font900,
    fontSize: 16,
    color: tokens.ink,
    fontVariant: ['tabular-nums'],
  },
});

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';

export type FlyPoint = { x: number; y: number };

type Props = {
  from: FlyPoint;
  to: FlyPoint;
  sticker: StickerName;
  onArrive: () => void;
};

export function RewardFlyer({ from, to, sticker, onArrive }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onArrive)();
    });
  }, [onArrive, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const x = from.x + (to.x - from.x) * p;
    const y = from.y + (to.y - from.y) * p - Math.sin(p * Math.PI) * 36;
    return {
      opacity: interpolate(p, [0, 0.08, 0.88, 1], [0, 1, 1, 0.15]),
      transform: [
        { translateX: x - 13 },
        { translateY: y - 13 },
        { scale: interpolate(p, [0, 0.18, 1], [0.7, 1.12, 0.86]) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.flyer, style]} pointerEvents="none">
      <Sticker name={sticker} size={26} bare={sticker === 'coin'} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flyer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 80,
  },
});

import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type CompleteBurstProps = {
  /** Increment to fire a burst. */
  seq: number;
};

const PARTICLES = ['✦', '✧', '✦', '✧', '★'] as const;

function CompleteBurst({ seq }: CompleteBurstProps) {
  const anims = useRef(
    PARTICLES.map(() => ({
      t: new Animated.Value(0),
    })),
  ).current;

  const spreads = useMemo(
    () =>
      PARTICLES.map((_, i) => ({
        dx: -28 + i * 14,
        dy: -46 - (i % 3) * 10,
      })),
    [],
  );

  useEffect(() => {
    if (seq <= 0) return;
    const runs = anims.map((slot, i) => {
      slot.t.setValue(0);
      return Animated.timing(slot.t, {
        toValue: 1,
        duration: 620,
        delay: i * 28,
        useNativeDriver: true,
      });
    });
    Animated.parallel(runs).start();
  }, [anims, seq]);

  if (seq <= 0) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {anims.map((slot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              opacity: slot.t.interpolate({
                inputRange: [0, 0.12, 0.7, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateX: slot.t.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, spreads[i]?.dx ?? 0],
                  }),
                },
                {
                  translateY: slot.t.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, spreads[i]?.dy ?? -40],
                  }),
                },
                {
                  scale: slot.t.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0.6, 1.15, 0.7],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.glyph}>{PARTICLES[i]}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

export default memo(CompleteBurst);

const styles = StyleSheet.create({
  wrap: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  glyph: {
    fontSize: 14,
    color: colors.gold,
  },
});

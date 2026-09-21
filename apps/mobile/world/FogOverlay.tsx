import React, { useEffect, useMemo } from 'react';
import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { FOG_SKSL } from './fogShader';
import { MAP_FOG_SEEDS, MAP_FOG_SEED_SLOTS } from './layout';

export type FogOverlayProps = {
  mapSize: number;
  progress: Record<string, SharedValue<number>>;
};

export default function FogOverlay({ mapSize, progress }: FogOverlayProps) {
  const clock = useSharedValue(0);
  const source = useMemo(() => Skia.RuntimeEffect.Make(FOG_SKSL), []);

  useEffect(() => {
    clock.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 36000, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(clock);
  }, [clock]);

  const uniforms = useDerivedValue(() => {
    const next: Record<string, number | number[]> = {
      res: [mapSize, mapSize],
      clock: clock.value,
    };
    for (let i = 0; i < MAP_FOG_SEED_SLOTS; i += 1) {
      const seed = MAP_FOG_SEEDS[i];
      if (!seed) {
        next[`s${i}`] = [0, 0, 8, 8];
        next[`p${i}`] = 0;
        continue;
      }
      next[`s${i}`] = [seed.cx * mapSize, seed.cy * mapSize, seed.rx * mapSize, seed.ry * mapSize];
      next[`p${i}`] = progress[seed.regionId]?.value ?? 0;
    }
    return next;
  });

  if (mapSize <= 0 || !source) return null;

  return (
    <Canvas
      pointerEvents="none"
      opaque={false}
      style={{ width: mapSize, height: mapSize, backgroundColor: 'transparent' }}
    >
      <Fill>
        <Shader source={source} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}

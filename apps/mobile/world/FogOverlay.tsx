import React, { useEffect } from 'react';
import {
  Canvas,
  Fill,
  FractalNoise,
  Group,
  Oval,
  RadialGradient,
  Rect,
  Turbulence,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import {
  MAP_FOG_DRIFTS,
  MAP_FOG_REGIONS,
  type MapFogDriftDef,
  type MapFogRegionDef,
} from './layout';

export type FogOverlayProps = {
  mapSize: number;
  progress: Record<string, SharedValue<number>>;
};

export default function FogOverlay({ mapSize, progress }: FogOverlayProps) {
  const clock = useSharedValue(0);

  useEffect(() => {
    clock.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 34000, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(clock);
  }, [clock]);

  const noiseTransform = useDerivedValue(() => [
    { translateX: Math.sin(clock.value) * 40 },
    { translateY: Math.cos(clock.value * 0.67) * 28 },
  ]);

  if (mapSize <= 0) return null;

  return (
    <Canvas pointerEvents="none" style={{ width: mapSize, height: mapSize }}>
      <Group layer>
        <Fill color="rgba(186, 196, 210, 0.5)" />
        <Group transform={noiseTransform}>
          <Rect
            x={-90}
            y={-90}
            width={mapSize + 180}
            height={mapSize + 180}
            opacity={0.42}
            blendMode="softLight"
          >
            <FractalNoise freqX={0.0046} freqY={0.0046} octaves={4} seed={3} />
          </Rect>
          <Rect
            x={-90}
            y={-90}
            width={mapSize + 180}
            height={mapSize + 180}
            opacity={0.2}
            blendMode="overlay"
          >
            <Turbulence freqX={0.011} freqY={0.008} octaves={3} seed={11} />
          </Rect>
        </Group>
        {MAP_FOG_DRIFTS.map((drift) => (
          <FogDrift key={drift.id} clock={clock} drift={drift} mapSize={mapSize} />
        ))}
        {MAP_FOG_REGIONS.map((region) => {
          const value = progress[region.id];
          if (!value) return null;
          return <FogClearing key={region.id} mapSize={mapSize} progress={value} region={region} />;
        })}
      </Group>
    </Canvas>
  );
}

function FogDrift({
  clock,
  drift,
  mapSize,
}: {
  clock: SharedValue<number>;
  drift: MapFogDriftDef;
  mapSize: number;
}) {
  const opacity = useDerivedValue(
    () => 0.5 + drift.density * (0.7 + 0.3 * Math.sin(clock.value + drift.phase)),
  );
  const cx = drift.cx * mapSize;
  const cy = drift.cy * mapSize;
  const rx = drift.rx * mapSize;
  const ry = drift.ry * mapSize;

  return (
    <Oval x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} opacity={opacity}>
      <RadialGradient
        c={vec(cx, cy)}
        r={Math.max(rx, ry)}
        colors={['rgba(236, 240, 246, 0.5)', 'rgba(204, 214, 226, 0.18)', 'transparent']}
        positions={[0, 0.48, 1]}
      />
    </Oval>
  );
}

function FogClearing({
  mapSize,
  progress,
  region,
}: {
  mapSize: number;
  progress: SharedValue<number>;
  region: MapFogRegionDef;
}) {
  const cx = region.cx * mapSize;
  const cy = region.cy * mapSize;
  const rx = (region.rx + region.feather) * mapSize;
  const ry = (region.ry + region.feather) * mapSize;
  const p = progress;

  const x = useDerivedValue(() => {
    const grow = 0.86 + 0.14 * p.value;
    return cx - rx * grow;
  });
  const y = useDerivedValue(() => {
    const grow = 0.86 + 0.14 * p.value;
    return cy - ry * grow;
  });
  const width = useDerivedValue(() => {
    const grow = 0.86 + 0.14 * p.value;
    return rx * 2 * grow;
  });
  const height = useDerivedValue(() => {
    const grow = 0.86 + 0.14 * p.value;
    return ry * 2 * grow;
  });
  const opacity = useDerivedValue(() => p.value);

  return (
    <Oval x={x} y={y} width={width} height={height} opacity={opacity} blendMode="dstOut">
      <RadialGradient
        c={vec(cx, cy)}
        r={Math.max(rx, ry)}
        colors={['white', 'white', 'rgba(255,255,255,0.42)', 'transparent']}
        positions={[0, 0.52, 0.8, 1]}
      />
    </Oval>
  );
}

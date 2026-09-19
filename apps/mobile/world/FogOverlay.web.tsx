import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  Mask,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import type { SharedValue } from 'react-native-reanimated';

import { MAP_FOG_DRIFTS, MAP_FOG_REGIONS } from './layout';

type FogOverlayProps = {
  mapSize: number;
  progress: Record<string, SharedValue<number>>;
};

/**
 * Web fallback: same fog data / holes as native Skia, without CanvasKit.
 * Native (`FogOverlay.tsx`) is the real look.
 */
export default function FogOverlay({ mapSize, progress }: FogOverlayProps) {
  useFogTick(progress);

  if (mapSize <= 0) return null;

  return (
    <View pointerEvents="none" style={{ width: mapSize, height: mapSize }}>
      <Svg width={mapSize} height={mapSize}>
        <Defs>
          <Mask id="kingdom-fog-mask" maskUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={mapSize} height={mapSize} fill="white" />
            {MAP_FOG_REGIONS.map((region) => {
              const p = progress[region.id]?.value ?? 0;
              if (p <= 0.01) return null;
              const grow = 0.86 + 0.14 * p;
              const rx = (region.rx + region.feather) * mapSize * grow;
              const ry = (region.ry + region.feather) * mapSize * grow;
              const gid = `fog-hole-${region.id}`;
              return (
                <React.Fragment key={region.id}>
                  <RadialGradient id={gid} cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0%" stopColor="#000" stopOpacity={p} />
                    <Stop offset="52%" stopColor="#000" stopOpacity={p} />
                    <Stop offset="80%" stopColor="#888" stopOpacity={p * 0.45} />
                    <Stop offset="100%" stopColor="#fff" stopOpacity={0} />
                  </RadialGradient>
                  <Ellipse
                    cx={region.cx * mapSize}
                    cy={region.cy * mapSize}
                    rx={rx}
                    ry={ry}
                    fill={`url(#${gid})`}
                  />
                </React.Fragment>
              );
            })}
          </Mask>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={mapSize}
          height={mapSize}
          fill="rgba(176, 188, 204, 0.74)"
          mask="url(#kingdom-fog-mask)"
        />
        {MAP_FOG_DRIFTS.map((drift) => (
          <Ellipse
            key={drift.id}
            cx={drift.cx * mapSize}
            cy={drift.cy * mapSize}
            rx={drift.rx * mapSize}
            ry={drift.ry * mapSize}
            fill="rgba(236, 240, 246, 0.28)"
            opacity={0.45 + drift.density * 0.4}
            mask="url(#kingdom-fog-mask)"
          />
        ))}
      </Svg>
    </View>
  );
}

function useFogTick(progress: Record<string, SharedValue<number>>) {
  const [, setTick] = useState(0);
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      const revealing = Object.values(progress).some((value) => value.value > 0.01 && value.value < 0.999);
      if (revealing) setTick((n) => n + 1);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [progress]);
}

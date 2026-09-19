import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  FeDisplacementMap,
  FeGaussianBlur,
  FeTurbulence,
  Filter,
  G,
  Mask,
  Rect,
} from 'react-native-svg';
import type { SharedValue } from 'react-native-reanimated';

import { MAP_FOG_SEEDS } from './layout';

type FogOverlayProps = {
  mapSize: number;
  progress: Record<string, SharedValue<number>>;
};

/**
 * Web preview of the continuous veil. Native Skia (noise-warped field) is the look.
 * One mask: merged seeds, turbulenced + blurred so openings are bays, not stamps.
 */
export default function FogOverlay({ mapSize, progress }: FogOverlayProps) {
  useFogTick(progress);

  if (mapSize <= 0) return null;

  return (
    <View pointerEvents="none" style={{ width: mapSize, height: mapSize }}>
      <Svg width={mapSize} height={mapSize}>
        <Defs>
          <Filter id="fog-edge" x="-25%" y="-25%" width="150%" height="150%">
            <FeTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="3" result="n" />
            <FeDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale={mapSize * 0.05}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <FeGaussianBlur stdDeviation={mapSize * 0.02} />
          </Filter>
          <Mask id="kingdom-fog-mask" maskUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={mapSize} height={mapSize} fill="white" />
            <G filter="url(#fog-edge)">
              {MAP_FOG_SEEDS.map((seed) => {
                const p = progress[seed.regionId]?.value ?? 0;
                if (p <= 0.01) return null;
                return (
                  <Ellipse
                    key={seed.id}
                    cx={seed.cx * mapSize}
                    cy={seed.cy * mapSize}
                    rx={seed.rx * mapSize * p}
                    ry={seed.ry * mapSize * p}
                    fill="#000"
                  />
                );
              })}
            </G>
          </Mask>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={mapSize}
          height={mapSize}
          fill="rgba(168, 178, 192, 0.94)"
          mask="url(#kingdom-fog-mask)"
        />
        <Rect
          x={0}
          y={0}
          width={mapSize}
          height={mapSize}
          fill="rgba(226, 232, 238, 0.5)"
          mask="url(#kingdom-fog-mask)"
        />
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

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

import { isFogRegionRevealed, MAP_FOG_REGIONS, MAP_FOG_SEEDS } from './layout';

type FogOverlayProps = {
  mapWidth: number;
  mapHeight: number;
  progress: Record<string, SharedValue<number>>;
  /** Forces a paint when discovery changes (SharedValues alone do not). */
  discoveredRegionIds: string[];
};

/**
 * Web preview of the continuous veil. Native Skia (noise-warped field) is the look.
 * One mask: merged seeds, turbulenced + blurred so openings are bays, not stamps.
 * When every region is open, unmount the veil so unveil-all leaves zero fog.
 */
export default function FogOverlay({
  mapWidth,
  mapHeight,
  progress,
  discoveredRegionIds,
}: FogOverlayProps) {
  useFogTick(progress, discoveredRegionIds);

  if (mapWidth <= 0 || mapHeight <= 0) return null;

  const allClear = MAP_FOG_REGIONS.every((region) =>
    isFogRegionRevealed(region.id, discoveredRegionIds),
  );
  if (allClear) return null;

  const blurBase = Math.min(mapWidth, mapHeight);

  return (
    <View pointerEvents="none" style={{ width: mapWidth, height: mapHeight }}>
      <Svg width={mapWidth} height={mapHeight}>
        <Defs>
          <Filter id="fog-edge" x="-25%" y="-25%" width="150%" height="150%">
            <FeTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="3" result="n" />
            <FeDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale={blurBase * 0.055}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <FeGaussianBlur stdDeviation={blurBase * 0.028} />
          </Filter>
          <Mask id="kingdom-fog-mask" maskUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={mapWidth} height={mapHeight} fill="white" />
            <G filter="url(#fog-edge)">
              {MAP_FOG_SEEDS.map((seed) => {
                const p = progress[seed.regionId]?.value ?? 0;
                if (p <= 0.01) return null;
                return (
                  <Ellipse
                    key={seed.id}
                    cx={seed.cx * mapWidth}
                    cy={seed.cy * mapHeight}
                    rx={seed.rx * mapWidth * p}
                    ry={seed.ry * mapHeight * p}
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
          width={mapWidth}
          height={mapHeight}
          fill="rgba(122, 136, 152, 0.986)"
          mask="url(#kingdom-fog-mask)"
        />
        <Rect
          x={0}
          y={0}
          width={mapWidth}
          height={mapHeight}
          fill="rgba(198, 208, 218, 0.78)"
          mask="url(#kingdom-fog-mask)"
        />
      </Svg>
    </View>
  );
}

function useFogTick(progress: Record<string, SharedValue<number>>, discoveredRegionIds: string[]) {
  const [, setTick] = useState(0);
  useEffect(() => {
    setTick((n) => n + 1);
  }, [discoveredRegionIds]);

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

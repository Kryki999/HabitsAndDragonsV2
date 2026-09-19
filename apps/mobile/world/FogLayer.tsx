import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { MAP_PIN_LOCATIONS, isLocationUnlocked, type LocationDef, type MapPinDef } from './content';
import type { WorldFlags } from './types';

type PinLoc = LocationDef & { mapPin: MapPinDef };

type Props = {
  mapSize: number;
  flags: WorldFlags;
};

/**
 * Fog of war: locked map pins sit under a mist blob.
 * Unlocked pins (Crownhaven from start; first side after Gutterjack) stay clear.
 */
export default function FogLayer({ mapSize, flags }: Props) {
  if (mapSize <= 0) return null;

  const locked = MAP_PIN_LOCATIONS.filter((loc) => !isLocationUnlocked(loc, flags));

  return (
    <>
      {locked.map((loc) => (
        <FogBlob key={loc.id} loc={loc} mapSize={mapSize} />
      ))}
    </>
  );
}

function FogBlob({ loc, mapSize }: { loc: PinLoc; mapSize: number }) {
  const radius = (loc.mapPin.fogRadius ?? 0.12) * mapSize;
  const left = loc.mapPin.x * mapSize - radius;
  const top = loc.mapPin.y * mapSize - radius;
  const size = radius * 2;
  const gid = `fog-${loc.id}`;

  return (
    <Svg
      pointerEvents="none"
      width={size}
      height={size}
      style={[styles.blob, { left, top }]}
    >
      <Defs>
        <RadialGradient id={gid} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#141628" stopOpacity={0.88} />
          <Stop offset="42%" stopColor="#1a1c32" stopOpacity={0.72} />
          <Stop offset="78%" stopColor="#22243c" stopOpacity={0.38} />
          <Stop offset="100%" stopColor="#22243c" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={radius} cy={radius} r={radius} fill={`url(#${gid})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    zIndex: 2,
  },
});

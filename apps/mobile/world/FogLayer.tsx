import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MAP_PIN_LOCATIONS, isLocationUnlocked, type LocationDef, type MapPinDef } from './content';
import type { WorldFlags } from './types';

type PinLoc = LocationDef & { mapPin: MapPinDef };

type Props = {
  mapSize: number;
  flags: WorldFlags;
};

/**
 * Fog of war: locked map pins sit under stacked mist discs.
 * Unlocked pins (Crownhaven from start; first side after Gutterjack) stay clear.
 * Views instead of SVG gradients — those vanish on RN-web.
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
  const cx = loc.mapPin.x * mapSize;
  const cy = loc.mapPin.y * mapSize;

  return (
    <View pointerEvents="none" style={[styles.layer, { zIndex: 2 }]}>
      <View
        style={[
          styles.disc,
          {
            left: cx - radius * 1.15,
            top: cy - radius * 1.15,
            width: radius * 2.3,
            height: radius * 2.3,
            borderRadius: radius * 1.15,
            backgroundColor: 'rgba(12, 14, 32, 0.42)',
          },
        ]}
      />
      <View
        style={[
          styles.disc,
          {
            left: cx - radius,
            top: cy - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: 'rgba(10, 12, 28, 0.62)',
          },
        ]}
      />
      <View
        style={[
          styles.disc,
          {
            left: cx - radius * 0.55,
            top: cy - radius * 0.55,
            width: radius * 1.1,
            height: radius * 1.1,
            borderRadius: radius * 0.55,
            backgroundColor: 'rgba(8, 10, 24, 0.78)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  disc: {
    position: 'absolute',
  },
});

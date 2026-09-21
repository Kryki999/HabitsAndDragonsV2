import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { LOCATION_STILL_INTRINSIC, MAP_LOCATIONS } from './locations';
import { useWorldStore } from './store';
import type { MapLocationId } from './types';

type Props = {
  locationId: MapLocationId;
};

/** Ally still — same World grammar as a location, no Fight. */
export default function NpcStill({ locationId }: Props) {
  const insets = useSafeAreaInsets();
  const closeEncounter = useWorldStore((s) => s.closeEncounter);
  const location = MAP_LOCATIONS[locationId];
  const encounter = location.encounter;
  if (encounter.kind !== 'npc') return null;

  return (
    <View style={styles.root} testID={`npc-still-${encounter.id}`}>
      <StillFrame
        source={encounter.still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
      />

      <OverlayHud
        insets={insets}
        kicker={location.name}
        title={encounter.name}
        left={{ icon: 'back', onPress: closeEncounter, accessibilityLabel: 'Back' }}
      />

      <View pointerEvents="none" style={[styles.veilWrap, { paddingBottom: 16 + insets.bottom }]}>
        <LinearGradient
          colors={['transparent', 'rgba(7,5,16,0.55)', 'rgba(7,5,16,0.92)']}
          style={styles.fade}
        />
        <Text style={styles.flavor}>{encounter.flavor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  veilWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    height: 72,
  },
  flavor: {
    marginTop: -8,
    paddingHorizontal: 20,
    paddingBottom: 8,
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

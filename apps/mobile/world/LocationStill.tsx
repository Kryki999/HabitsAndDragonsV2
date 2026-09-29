import React from 'react';
import { StyleSheet, View } from 'react-native';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Nameplate } from '@/ui/Nameplate';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import { tokens } from '@/ui/tokens';

import StillFrame from './StillFrame';
import { LOCATION_STILL_INTRINSIC, MAP_LOCATIONS, isHotspotCleared } from './content';
import { useWorldStore } from './store';
import type { MapLocationId } from './types';

type Props = {
  locationId: MapLocationId;
};

/** Map drill-in: still + nameplates. Not an exit list. */
export default function LocationStill({ locationId }: Props) {
  const openMap = useWorldStore((s) => s.openMap);
  const openHotspot = useWorldStore((s) => s.openHotspot);
  const clearedEncounterIds = useWorldStore((s) => s.clearedEncounterIds);
  const location = MAP_LOCATIONS[locationId];
  const featuredId = location.hotspots.find(
    (hotspot) => hotspot.kind === 'dungeon' && !isHotspotCleared(hotspot, clearedEncounterIds),
  )?.id;

  return (
    <View style={styles.root} testID={`location-still-${locationId}`}>
      <StillFrame
        source={location.still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
      >
        {(box) => (
          <>
            {location.hotspots.map((hotspot) => (
                <Nameplate
                  key={hotspot.id}
                  testID={`location-hotspot-${locationId}-${hotspot.id}`}
                  accessibilityLabel={hotspot.label}
                  label={hotspot.label}
                  sticker={hotspot.kind === 'npc' ? 'mage' : 'swords'}
                  featured={hotspot.id === featuredId}
                  frameWidth={box.width}
                  left={hotspot.x * box.width}
                  top={hotspot.y * box.height}
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Medium);
                    openHotspot(locationId, hotspot.id);
                  }}
                />
            ))}
          </>
        )}
      </StillFrame>
      <ScrimTop />
      <SeamDock fade={90} />
      <SceneHead kicker={location.kicker} name={location.name} onBack={openMap} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
});

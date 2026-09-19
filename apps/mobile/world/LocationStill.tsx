import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationNav } from './IconRail';
import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import WorldHotspot from './WorldHotspot';
import { getLocation } from './content';
import { useWorldStore } from './store';
import type { LocationId } from './types';

type Props = {
  locationId: LocationId;
};

/** Generic close-up: still + icon nav + optional hotspots. Driven by the content table. */
export default function LocationStill({ locationId }: Props) {
  const insets = useSafeAreaInsets();
  const openLocation = useWorldStore((s) => s.openLocation);
  const loc = getLocation(locationId);

  return (
    <View style={styles.root}>
      <StillFrame
        source={loc.asset}
        intrinsicWidth={loc.intrinsic.width}
        intrinsicHeight={loc.intrinsic.height}
      >
        {(box) => (
          <>
            {(loc.hotspots ?? []).map((spot) =>
              spot.targetId ? (
                <WorldHotspot
                  key={spot.id}
                  x={spot.x}
                  y={spot.y}
                  width={box.width}
                  height={box.height}
                  icon={spot.icon}
                  label={spot.label}
                  hint={spot.hint}
                  accessibilityLabel={spot.label}
                  onPress={() => openLocation(spot.targetId!)}
                />
              ) : null,
            )}
          </>
        )}
      </StillFrame>

      <OverlayHud insets={insets} kicker={loc.kicker} title={loc.displayName} />
      <LocationNav locationId={locationId} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
});

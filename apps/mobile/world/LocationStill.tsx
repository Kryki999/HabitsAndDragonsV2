import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Swords } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { LOCATION_STILL_INTRINSIC, MAP_LOCATIONS, isHotspotCleared } from './content';
import { useWorldStore } from './store';
import type { MapLocationId } from './types';

type Props = {
  locationId: MapLocationId;
};

/** Map drill-in: still + HUD + NPC / dungeon hotspots. Not an exit list. */
export default function LocationStill({ locationId }: Props) {
  const insets = useSafeAreaInsets();
  const openMap = useWorldStore((s) => s.openMap);
  const openHotspot = useWorldStore((s) => s.openHotspot);
  const clearedEncounterIds = useWorldStore((s) => s.clearedEncounterIds);
  const location = MAP_LOCATIONS[locationId];

  return (
    <View style={styles.root} testID={`location-still-${locationId}`}>
      <StillFrame
        source={location.still}
        intrinsicWidth={LOCATION_STILL_INTRINSIC.width}
        intrinsicHeight={LOCATION_STILL_INTRINSIC.height}
      >
        {(box) => (
          <>
            {location.hotspots.map((hotspot) => {
              const cleared = isHotspotCleared(hotspot, clearedEncounterIds);
              return (
                <Pressable
                  key={hotspot.id}
                  testID={`location-hotspot-${locationId}-${hotspot.id}`}
                  accessibilityLabel={`${hotspot.label}, ${hotspot.hint}`}
                  onPress={() => {
                    impactAsync(ImpactFeedbackStyle.Medium);
                    openHotspot(locationId, hotspot.id);
                  }}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.hotspot,
                    {
                      left: hotspot.x * box.width - 44,
                      top: hotspot.y * box.height - 56,
                    },
                    pressed && styles.hotspotPressed,
                  ]}
                >
                  <View style={[styles.hotspotDot, hotspot.kind === 'npc' && styles.hotspotDotNpc]}>
                    {hotspot.kind === 'npc' ? (
                      <Sparkles size={15} color={Colors.dark.cyan} strokeWidth={2.4} />
                    ) : (
                      <Swords size={15} color={Colors.dark.gold} strokeWidth={2.4} />
                    )}
                  </View>
                  <View style={styles.hotspotLabel}>
                    <Text style={styles.hotspotName}>{hotspot.label}</Text>
                    <Text style={styles.hotspotHint}>{cleared ? 'Cleared' : hotspot.hint}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </StillFrame>

      <OverlayHud
        insets={insets}
        kicker={location.kicker}
        title={location.name}
        left={{ icon: 'back', onPress: openMap, accessibilityLabel: 'Back' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  hotspot: {
    position: 'absolute',
    width: 88,
    alignItems: 'center',
    zIndex: 3,
  },
  hotspotPressed: {
    opacity: 0.82,
  },
  hotspotDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + 'aa',
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotDotNpc: {
    borderColor: Colors.dark.cyan + 'cc',
  },
  hotspotLabel: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 8, 18, 0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 69, 0.22)',
    alignItems: 'center',
  },
  hotspotName: {
    color: Colors.dark.text,
    fontSize: 11,
    fontWeight: '800',
  },
  hotspotHint: {
    marginTop: 1,
    color: Colors.dark.textMuted,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

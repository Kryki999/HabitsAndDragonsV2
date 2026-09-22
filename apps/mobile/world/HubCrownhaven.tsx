import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Castle, Store, Wine } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { SKARNE_ENCOUNTER_ID } from './content';
import { HUB_HOTSPOTS, HUB_INTRINSIC, WORLD_ART, type HubHotspotDef } from './layout';
import { useWorldStore } from './store';

export default function HubCrownhaven() {
  const insets = useSafeAreaInsets();
  const openMap = useWorldStore((s) => s.openMap);
  const openInterior = useWorldStore((s) => s.openInterior);
  const gutterjackCleared = useWorldStore((s) => s.gutterjackCleared);
  const palaceOpen = useWorldStore((s) => s.clearedEncounterIds.includes(SKARNE_ENCOUNTER_ID));
  const [whisper, setWhisper] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showWhisper = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setWhisper(message);
    timer.current = setTimeout(() => setWhisper(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onHotspot = (spot: HubHotspotDef) => {
    impactAsync(ImpactFeedbackStyle.Medium);
    if (spot.action === 'tavern') {
      openInterior('tavern', 'ground');
      return;
    }
    if (spot.action === 'market') {
      openInterior('market', 'stall');
      return;
    }
    if (!palaceOpen) {
      showWhisper('Gates stay shut until Champion ★1.');
      return;
    }
    openInterior('palace', 'hall');
  };

  return (
    <View style={styles.root}>
      <StillFrame
        source={WORLD_ART.hub}
        intrinsicWidth={HUB_INTRINSIC.width}
        intrinsicHeight={HUB_INTRINSIC.height}
      >
        {(box) => (
          <>
            {HUB_HOTSPOTS.map((spot) => (
              <Pressable
                key={spot.id}
                onPress={() => onHotspot(spot)}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.hotspot,
                  {
                    left: spot.x * box.width - 44,
                    top: spot.y * box.height - 56,
                  },
                  pressed && styles.hotspotPressed,
                ]}
              >
                <View
                  style={[
                    styles.hotspotDot,
                    spot.id === 'tavern' && styles.hotspotDotTavern,
                    spot.id === 'castle' && !palaceOpen && styles.hotspotDotCastle,
                    spot.id === 'castle' && palaceOpen && styles.hotspotDotOpen,
                  ]}
                >
                  {spot.id === 'tavern' ? (
                    <Wine size={15} color={Colors.dark.gold} strokeWidth={2.4} />
                  ) : spot.id === 'castle' ? (
                    <Castle
                      size={15}
                      color={palaceOpen ? Colors.dark.gold : Colors.dark.textMuted}
                      strokeWidth={2.4}
                    />
                  ) : (
                    <Store size={15} color={Colors.dark.gold} strokeWidth={2.4} />
                  )}
                </View>
                <View style={styles.hotspotLabel}>
                  <Text style={styles.hotspotName}>{spot.label}</Text>
                  <Text style={styles.hotspotHint}>
                    {spot.id === 'tavern' && gutterjackCleared
                      ? 'Cleared'
                      : spot.id === 'castle'
                        ? palaceOpen
                          ? 'Advisor'
                          : spot.hint
                        : spot.hint}
                  </Text>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </StillFrame>

      <OverlayHud
        insets={insets}
        kicker="Capital"
        title="Crownhaven"
        left={{ icon: 'back', onPress: openMap, accessibilityLabel: 'Back' }}
      />

      {whisper ? (
        <View pointerEvents="none" style={[styles.whisperWrap, { paddingBottom: 16 + insets.bottom }]}>
          <Text style={styles.whisper}>{whisper}</Text>
        </View>
      ) : null}
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
  hotspotDotTavern: {
    borderColor: Colors.dark.emerald + 'cc',
  },
  hotspotDotCastle: {
    borderColor: Colors.dark.textMuted + '99',
  },
  hotspotDotOpen: {
    borderColor: Colors.dark.gold + 'aa',
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
  whisperWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    alignItems: 'center',
  },
  whisper: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 6,
  },
});

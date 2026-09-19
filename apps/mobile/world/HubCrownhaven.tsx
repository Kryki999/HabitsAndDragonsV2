import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { LocationNav } from './IconRail';
import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import WorldHotspot from './WorldHotspot';
import { getLocation, type LocationHotspotDef } from './content';
import { NAV_ICONS } from './icons';
import { useWorldStore } from './store';

const COMING_SOON: Record<string, { title: string; body: string }> = {
  market: {
    title: 'Market',
    body: 'The stall will buy and sell later. Guide #1 lives here — coming soon.',
  },
  palace: {
    title: 'Palace',
    body: 'Gates stay shut until Champion ★1. The hill is a promise, not a door.',
  },
};

export default function HubCrownhaven() {
  const insets = useSafeAreaInsets();
  const openLocation = useWorldStore((s) => s.openLocation);
  const gutterjackCleared = useWorldStore((s) => s.flags.gutterjackCleared);
  const loc = getLocation('crownhaven');
  const [soonId, setSoonId] = useState<string | null>(null);

  const onHotspot = (spot: LocationHotspotDef) => {
    if (spot.targetId) {
      setSoonId(null);
      openLocation(spot.targetId);
      return;
    }
    setSoonId(spot.id);
  };

  const soon = soonId ? COMING_SOON[soonId] : null;

  return (
    <View style={styles.root}>
      <StillFrame
        source={loc.asset}
        intrinsicWidth={loc.intrinsic.width}
        intrinsicHeight={loc.intrinsic.height}
      >
        {(box) => (
          <>
            {(loc.hotspots ?? []).map((spot) => (
              <WorldHotspot
                key={spot.id}
                x={spot.x}
                y={spot.y}
                width={box.width}
                height={box.height}
                icon={spot.icon}
                label={spot.label}
                hint={
                  spot.id === 'tavern' && gutterjackCleared ? 'Cleared' : spot.hint
                }
                accessibilityLabel={spot.label}
                accent={spot.id === 'tavern' ? 'emerald' : spot.comingSoon ? 'muted' : 'gold'}
                onPress={() => onHotspot(spot)}
              />
            ))}
          </>
        )}
      </StillFrame>

      <OverlayHud insets={insets} kicker={loc.kicker} title={loc.displayName} />
      <LocationNav locationId="crownhaven" />

      {soon ? (
        <View pointerEvents="box-none" style={[styles.bannerWrap, { paddingBottom: 16 + insets.bottom }]}>
          <LinearGradient colors={['transparent', 'rgba(7,5,16,0.55)']} style={styles.bannerFade} />
          <View style={styles.banner}>
            <View style={styles.bannerHead}>
              <View style={styles.bannerCopy}>
                <Text style={styles.bannerKicker}>Coming soon</Text>
                <Text style={styles.bannerTitle}>{soon.title}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss"
                onPress={() => {
                  impactAsync(ImpactFeedbackStyle.Light);
                  setSoonId(null);
                }}
                hitSlop={8}
                style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}
              >
                <NAV_ICONS.close size={18} color={Colors.dark.gold} strokeWidth={2.4} />
              </Pressable>
            </View>
            <Text style={styles.bannerBody}>{soon.body}</Text>
          </View>
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
  bannerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerFade: {
    height: 36,
  },
  banner: {
    marginHorizontal: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border + 'cc',
    backgroundColor: 'rgba(18, 12, 28, 0.94)',
  },
  bannerHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  bannerCopy: {
    flex: 1,
  },
  bannerKicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bannerTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: '800',
  },
  bannerBody: {
    marginTop: 6,
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  dismiss: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
});

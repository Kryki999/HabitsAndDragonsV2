import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Castle, Store, Wine } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import { HUB_HOTSPOTS, HUB_INTRINSIC, WORLD_ART, type HubHotspotDef } from './layout';
import { useWorldStore } from './store';

const COMING_SOON: Record<'market' | 'castle', { title: string; body: string }> = {
  market: {
    title: 'Market',
    body: 'The stall will buy and sell later. Guide #1 lives here — coming soon.',
  },
  castle: {
    title: 'Palace',
    body: 'Gates stay shut until Champion ★1. The hill is a promise, not a door.',
  },
};

export default function HubCrownhaven() {
  const insets = useSafeAreaInsets();
  const openMap = useWorldStore((s) => s.openMap);
  const openLocation = useWorldStore((s) => s.openLocation);
  const gutterjackCleared = useWorldStore((s) => s.gutterjackCleared);
  const [soon, setSoon] = useState<'market' | 'castle' | null>(null);

  const onHotspot = (spot: HubHotspotDef) => {
    impactAsync(ImpactFeedbackStyle.Medium);
    if (spot.action === 'gutterjack') {
      setSoon(null);
      openLocation('gutterjack');
      return;
    }
    setSoon(spot.id === 'castle' ? 'castle' : 'market');
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
                    spot.id === 'castle' && styles.hotspotDotCastle,
                  ]}
                >
                  {spot.id === 'tavern' ? (
                    <Wine size={15} color={Colors.dark.gold} strokeWidth={2.4} />
                  ) : spot.id === 'castle' ? (
                    <Castle size={15} color={Colors.dark.textMuted} strokeWidth={2.4} />
                  ) : (
                    <Store size={15} color={Colors.dark.gold} strokeWidth={2.4} />
                  )}
                </View>
                <View style={styles.hotspotLabel}>
                  <Text style={styles.hotspotName}>{spot.label}</Text>
                  <Text style={styles.hotspotHint}>
                    {spot.id === 'tavern' && gutterjackCleared ? 'Cleared' : spot.hint}
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
        right={{ label: 'Map', onPress: openMap }}
      />

      {soon ? (
        <View pointerEvents="box-none" style={[styles.bannerWrap, { paddingBottom: 16 + insets.bottom }]}>
          <LinearGradient colors={['transparent', 'rgba(7,5,16,0.55)']} style={styles.bannerFade} />
          <View style={styles.banner}>
            <Text style={styles.bannerKicker}>Coming soon</Text>
            <Text style={styles.bannerTitle}>{COMING_SOON[soon].title}</Text>
            <Text style={styles.bannerBody}>{COMING_SOON[soon].body}</Text>
            <Pressable
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Light);
                setSoon(null);
              }}
              style={({ pressed }) => [styles.bannerBtn, pressed && styles.hotspotPressed]}
            >
              <Text style={styles.bannerBtnText}>Stay in the square</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View pointerEvents="none" style={[styles.hintWrap, { paddingBottom: 12 + insets.bottom }]}>
          <Text style={styles.hint}>Tap the tavern for Gutterjack · Map for the kingdom</Text>
        </View>
      )}
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
  bannerBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '55',
  },
  bannerBtnText: {
    color: Colors.dark.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  hintWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    alignItems: 'center',
  },
  hint: {
    color: 'rgba(240, 230, 211, 0.72)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 6,
  },
});

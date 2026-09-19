import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Castle, Map as MapIcon, Swords } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

import OverlayHud from './OverlayHud';
import StillFrame from './StillFrame';
import WindowDock from './WindowDock';
import { LOCATION_BY_ID, windowById } from './catalog';
import { useWorldStore } from './store';
import type { LocationWindowId } from './types';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const locationId = useWorldStore((s) => s.currentLocationId);
  const currentWindowId = useWorldStore((s) => s.currentWindowId);
  const openMap = useWorldStore((s) => s.openMap);
  const openHub = useWorldStore((s) => s.openHub);
  const setWindow = useWorldStore((s) => s.setWindow);

  const loc = locationId ? LOCATION_BY_ID[locationId] : undefined;
  const fallback = loc?.windows[0];
  const window = (loc ? windowById(loc, currentWindowId) : undefined) ?? fallback;

  if (!loc || !window) return null;

  const isFight = window.id.startsWith('fight');

  return (
    <View style={styles.root}>
      <StillFrame
        source={window.source}
        intrinsicWidth={window.intrinsicWidth}
        intrinsicHeight={window.intrinsicHeight}
      />

      <OverlayHud
        insets={insets}
        kicker={loc.kicker}
        title={loc.name}
        left={{ icon: MapIcon, accessibilityLabel: 'Kingdom map', onPress: openMap }}
        right={{ icon: Castle, accessibilityLabel: 'Crownhaven', onPress: openHub }}
      />

      <WindowDock
        windows={loc.windows}
        currentWindowId={window.id}
        onSelectWindow={(id: LocationWindowId) => setWindow(id)}
        onMap={openMap}
      />

      <View pointerEvents="box-none" style={[styles.sheetWrap, { paddingBottom: 12 + insets.bottom }]}>
        <LinearGradient colors={['transparent', 'rgba(7,5,16,0.72)', 'rgba(7,5,16,0.94)']} style={styles.fade} />
        <View style={styles.sheet}>
          <Text style={styles.kicker}>{isFight ? 'Fight stub' : window.label}</Text>
          <Text style={styles.body}>{window.blurb}</Text>
          {isFight ? (
            <View style={styles.fightBadge}>
              <Swords size={14} color={Colors.dark.gold} strokeWidth={2.4} />
              <Text style={styles.fightBadgeText}>Combat later</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 64,
    bottom: 0,
  },
  fade: {
    height: 36,
  },
  sheet: {
    marginHorizontal: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border + 'cc',
    backgroundColor: 'rgba(18, 12, 28, 0.94)',
  },
  kicker: {
    color: Colors.dark.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  body: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  fightBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '44',
  },
  fightBadgeText: {
    color: Colors.dark.gold,
    fontSize: 11,
    fontWeight: '800',
  },
});

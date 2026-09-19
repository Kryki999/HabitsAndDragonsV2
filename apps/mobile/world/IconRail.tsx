import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { floorNeighbors, getLocation } from './content';
import { NAV_ICONS } from './icons';
import { useWorldStore } from './store';
import type { LocationId } from './types';

type LucideGlyph = typeof NAV_ICONS.map;

export type IconRailItem = {
  key: string;
  icon: LucideGlyph;
  accessibilityLabel: string;
  onPress: () => void;
  tone?: 'gold' | 'emerald';
};

type RailProps = {
  items: IconRailItem[];
  insets?: EdgeInsets;
};

/** Vertical icon-only nav. No text labels on screen — a11y names stay spoken. */
export default function IconRail({ items, insets }: RailProps) {
  const safe = useSafeAreaInsets();
  const top = (insets ?? safe).top;

  if (items.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: Math.max(top, 10) + 4 }]}>
      {items.map((item) => (
        <RailButton key={item.key} item={item} />
      ))}
    </View>
  );
}

function RailButton({ item }: { item: IconRailItem }) {
  const Icon = item.icon;
  const accent = item.tone === 'emerald' ? Colors.dark.emerald : Colors.dark.gold;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        item.onPress();
      }}
      hitSlop={6}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Icon size={20} color={accent} strokeWidth={2.4} />
    </Pressable>
  );
}

type LocationNavProps = {
  locationId: LocationId;
};

/** Map / Back / Stairs derived from the content table floor graph. */
export function LocationNav({ locationId }: LocationNavProps) {
  const insets = useSafeAreaInsets();
  const openMap = useWorldStore((s) => s.openMap);
  const openLocation = useWorldStore((s) => s.openLocation);
  const loc = getLocation(locationId);
  const { up, down } = floorNeighbors(locationId);

  const items: IconRailItem[] = [
    {
      key: 'map',
      icon: NAV_ICONS.map,
      accessibilityLabel: 'Kingdom map',
      onPress: openMap,
    },
  ];

  if (loc.parentId) {
    const parent = getLocation(loc.parentId);
    items.push({
      key: 'back',
      icon: NAV_ICONS.back,
      accessibilityLabel: `Back to ${parent.displayName}`,
      onPress: () => openLocation(loc.parentId!),
    });
  }

  if (down) {
    items.push({
      key: 'stairs-down',
      icon: NAV_ICONS.stairsDown,
      accessibilityLabel: `Down to ${getLocation(down).displayName}`,
      onPress: () => openLocation(down),
      tone: 'emerald',
    });
  }

  if (up) {
    items.push({
      key: 'stairs-up',
      icon: NAV_ICONS.stairsUp,
      accessibilityLabel: `Up to ${getLocation(up).displayName}`,
      onPress: () => openLocation(up),
      tone: 'emerald',
    });
  }

  return <IconRail items={items} insets={insets} />;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    zIndex: 20,
    gap: 8,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.dark.gold + '66',
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});

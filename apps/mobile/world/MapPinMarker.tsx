import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Castle, Lock, Wine } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import type { MapPinKind } from './layout';

type Props = {
  label: string;
  chip: string;
  kind: MapPinKind;
  /** Image-space pixels (unscaled). Anchor = pin tip. */
  left: number;
  top: number;
  cleared?: boolean;
  onPress: () => void;
};

const HEAD = 32;

export default function MapPinMarker({ label, chip, kind, left, top, cleared, onPress }: Props) {
  const locked = kind === 'locked';
  const accent = locked ? Colors.dark.textMuted : kind === 'home' ? Colors.dark.gold : Colors.dark.emerald;
  const zIndex = kind === 'home' ? 5 : kind === 'dungeon' ? 4 : 3;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { left: left - 54, top: top - 42, zIndex }]}
    >
      <Pressable
        onPress={() => {
          impactAsync(locked ? ImpactFeedbackStyle.Light : ImpactFeedbackStyle.Medium);
          onPress();
        }}
        hitSlop={8}
        style={({ pressed }) => [styles.headHit, pressed && styles.pressed]}
      >
        <View style={[styles.head, { borderColor: accent, backgroundColor: locked ? '#1a1524ee' : '#120c1cee' }]}>
          {kind === 'home' ? (
            <Castle size={16} color={accent} strokeWidth={2.4} />
          ) : kind === 'dungeon' ? (
            <Wine size={16} color={accent} strokeWidth={2.4} />
          ) : (
            <Lock size={16} color={accent} strokeWidth={2.4} />
          )}
        </View>
        <View style={[styles.stem, { backgroundColor: accent }]} />
      </Pressable>
      <View pointerEvents="none" style={[styles.labelCard, locked && styles.labelCardLocked]}>
        <Text style={[styles.label, { color: accent }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.chip} numberOfLines={1}>
          {cleared ? 'Cleared' : chip}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: 108,
    alignItems: 'center',
  },
  headHit: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  head: {
    width: HEAD,
    height: HEAD,
    borderRadius: HEAD / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stem: {
    width: 2,
    height: 10,
    marginTop: -1,
    opacity: 0.85,
  },
  labelCard: {
    marginTop: 4,
    maxWidth: 108,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 8, 18, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 69, 0.22)',
    alignItems: 'center',
  },
  labelCardLocked: {
    borderColor: 'rgba(107, 94, 122, 0.45)',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  chip: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

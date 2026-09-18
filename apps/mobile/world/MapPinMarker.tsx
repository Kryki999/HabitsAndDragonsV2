import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Castle, Lock } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import type { MapPinKind } from './layout';

type Props = {
  /** Spoken name only — overview map shows the icon, not a text label. */
  accessibilityLabel: string;
  kind: MapPinKind;
  /** Image-space pixels (unscaled). Anchor = pin tip. */
  left: number;
  top: number;
  onPress: () => void;
};

const HEAD = 32;
const STEM = 10;
const WRAP = 44;

export default function MapPinMarker({ accessibilityLabel, kind, left, top, onPress }: Props) {
  const locked = kind === 'locked';
  const accent = locked ? Colors.dark.textMuted : Colors.dark.gold;
  const zIndex = kind === 'home' ? 5 : 3;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { left: left - WRAP / 2, top: top - (HEAD + STEM), zIndex }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={locked ? `${accessibilityLabel}, locked` : accessibilityLabel}
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
          ) : (
            <Lock size={16} color={accent} strokeWidth={2.4} />
          )}
        </View>
        <View style={[styles.stem, { backgroundColor: accent }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: WRAP,
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
    height: STEM,
    marginTop: -1,
    opacity: 0.85,
  },
});

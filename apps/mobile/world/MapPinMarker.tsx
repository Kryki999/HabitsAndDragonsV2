import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { PIN_ICONS, type PinIconName } from './icons';

type Props = {
  accessibilityLabel: string;
  locked: boolean;
  icon: PinIconName;
  /** Image-space pixels (unscaled). Anchor = pin tip. */
  left: number;
  top: number;
  zIndex?: number;
  onPress: () => void;
};

const HEAD = 32;
const STEM = 10;
const WRAP = 44;

export default function MapPinMarker({
  accessibilityLabel,
  locked,
  icon,
  left,
  top,
  zIndex = 3,
  onPress,
}: Props) {
  const accent = locked ? Colors.dark.textMuted : Colors.dark.gold;
  const Icon = locked ? PIN_ICONS.lock : PIN_ICONS[icon];

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
          <Icon size={16} color={accent} strokeWidth={2.4} />
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

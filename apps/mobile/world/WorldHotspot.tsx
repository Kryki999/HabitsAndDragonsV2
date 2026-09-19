import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

import { HOTSPOT_ICONS, type HotspotIconName } from './icons';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: HotspotIconName;
  label?: string;
  hint?: string;
  accessibilityLabel: string;
  accent?: 'gold' | 'emerald' | 'muted';
  onPress: () => void;
};

/** Icon hotspot on a close-up. Short label is optional — prefer icon-first. */
export default function WorldHotspot({
  x,
  y,
  width,
  height,
  icon,
  label,
  hint,
  accessibilityLabel,
  accent = 'gold',
  onPress,
}: Props) {
  const Icon = HOTSPOT_ICONS[icon];
  const border =
    accent === 'emerald'
      ? Colors.dark.emerald + 'cc'
      : accent === 'muted'
        ? Colors.dark.textMuted + '99'
        : Colors.dark.gold + 'aa';
  const glyph =
    accent === 'muted' ? Colors.dark.textMuted : accent === 'emerald' ? Colors.dark.emerald : Colors.dark.gold;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Medium);
        onPress();
      }}
      hitSlop={12}
      style={({ pressed }) => [
        styles.hotspot,
        {
          left: x * width - 44,
          top: y * height - (label ? 56 : 22),
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.dot, { borderColor: border }]}>
        <Icon size={15} color={glyph} strokeWidth={2.4} />
      </View>
      {label ? (
        <View style={styles.caption}>
          <Text style={styles.label}>{label}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hotspot: {
    position: 'absolute',
    width: 88,
    alignItems: 'center',
    zIndex: 3,
  },
  pressed: {
    opacity: 0.82,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    backgroundColor: 'rgba(13, 10, 20, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 8, 18, 0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 69, 0.22)',
    alignItems: 'center',
  },
  label: {
    color: Colors.dark.text,
    fontSize: 11,
    fontWeight: '800',
  },
  hint: {
    marginTop: 1,
    color: Colors.dark.textMuted,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

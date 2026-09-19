import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';

type Props = {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress: () => void;
  onLongPress?: () => void;
  active?: boolean;
  muted?: boolean;
  /** Caption under the glyph. Keep short. */
  caption?: string;
  size?: number;
};

export default function IconHit({
  icon: Icon,
  accessibilityLabel,
  onPress,
  onLongPress,
  active = false,
  muted = false,
  caption,
  size = 48,
}: Props) {
  const accent = muted ? Colors.dark.textMuted : active ? Colors.dark.gold : Colors.dark.gold;
  const glyph = muted ? Colors.dark.textMuted : Colors.dark.gold;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled: muted }}
      onPress={() => {
        impactAsync(muted ? ImpactFeedbackStyle.Light : ImpactFeedbackStyle.Medium);
        onPress();
      }}
      onLongPress={onLongPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.wrap,
        { width: Math.max(size, 48) },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.hit,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: active ? accent : accent + '66',
            backgroundColor: active ? 'rgba(255, 200, 69, 0.16)' : 'rgba(13, 10, 20, 0.82)',
          },
          muted && styles.muted,
        ]}
      >
        <Icon size={Math.round(size * 0.42)} color={glyph} strokeWidth={2.4} />
      </View>
      {caption ? (
        <Text style={[styles.caption, muted && styles.captionMuted]} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  hit: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    backgroundColor: 'rgba(18, 16, 24, 0.72)',
    borderColor: Colors.dark.textMuted + '66',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.96 }],
  },
  caption: {
    marginTop: 4,
    color: Colors.dark.text,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  captionMuted: {
    color: Colors.dark.textMuted,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

type Props = {
  label: string;
  sticker?: StickerName;
  locked?: boolean;
  featured?: boolean;
  /** Still width. Keeps the plate inside the frame. */
  frameWidth?: number;
  /** Landmark point, in the still's laid-out pixels. The anchor sits on it. */
  left: number;
  top: number;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

export function Nameplate({
  label,
  sticker = 'scroll',
  locked = false,
  featured = false,
  frameWidth,
  left,
  top,
  onPress,
  testID,
  accessibilityLabel,
}: Props) {
  const half = 92;
  const x = frameWidth ? Math.min(Math.max(left, half), Math.max(half, frameWidth - half)) : left;
  return (
    <View style={[styles.pin, { left: x, top }]} pointerEvents="box-none">
      <View style={styles.stack}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? (locked ? `${label}, locked` : label)}
        testID={testID}
        onPress={onPress}
        style={[styles.body, locked && styles.bodyLocked, featured && !locked && styles.bodyFeatured]}
      >
        <View style={[styles.medal, locked && styles.medalLocked]}>
          {locked ? (
            <Glyph name="lock" size={18} color={tokens.ink2} />
          ) : (
            <Sticker name={sticker} size={24} />
          )}
        </View>
        <View>
          <Text style={[styles.label, locked && styles.labelLocked]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Pressable>
      <View style={[styles.tail, locked && styles.tailLocked]} />
      </View>
      <View style={[styles.anchor, featured && !locked && styles.anchorFeatured, locked && styles.anchorLocked]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pin: {
    position: 'absolute',
    zIndex: 20,
    alignItems: 'center',
    transform: [{ translateX: '-50%' }, { translateY: '-100%' }],
  },
  stack: {
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingRight: 16,
    paddingLeft: 7,
    backgroundColor: tokens.surface,
    borderRadius: tokens.rPill,
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  bodyLocked: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: [shadow.dropOnArt],
  },
  bodyFeatured: {
    borderWidth: 3,
    borderColor: tokens.gold,
    boxShadow: [shadow.lipGold, shadow.dropOnArt],
  },
  medal: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: tokens.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalLocked: {
    backgroundColor: tokens.surface3,
  },
  label: {
    fontFamily: tokens.font900,
    fontSize: 16,
    color: tokens.ink,
  },
  labelLocked: {
    color: tokens.ink2,
  },
  tail: {
    width: 0,
    height: 0,
    marginTop: 3,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: tokens.surface,
  },
  tailLocked: {
    borderTopColor: 'rgba(255,255,255,0.9)',
  },
  anchor: {
    width: 14,
    height: 14,
    marginTop: 4,
    borderRadius: 7,
    backgroundColor: tokens.surface,
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.brand, spreadDistance: 3 },
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: 'rgba(0,0,0,0.5)' },
    ],
  },
  anchorFeatured: {
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.gold, spreadDistance: 3 },
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: 'rgba(253,180,60,0.35)', spreadDistance: 10 },
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: 'rgba(0,0,0,0.5)' },
    ],
  },
  anchorLocked: {
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: tokens.ink3, spreadDistance: 3 },
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: 'rgba(0,0,0,0.5)' },
    ],
  },
});

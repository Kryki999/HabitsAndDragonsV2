import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Glyph } from '@/ui/Glyph';
import { Sticker } from '@/ui/Sticker';
import type { StickerName } from '@/ui/stickerRegistry';
import { shadow, tokens } from '@/ui/tokens';

const FACE = require('../lookdev/assets/avatar-hero.jpg');

type Kind = 'current' | 'landmark' | 'locked';

type Props = {
  kind: Kind;
  sticker?: StickerName;
  /** Tip of the pin, in the same space as the map image. */
  left: number;
  top: number;
  /** Map camera scale. The pin stays a screen-sized object. */
  scale?: number;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel: string;
};

export function MapPin({
  kind,
  sticker = 'swords',
  left,
  top,
  scale = 1,
  onPress,
  onLongPress,
  accessibilityLabel,
}: Props) {
  const head = (kind === 'current' ? 56 : kind === 'locked' ? 36 : 46) * scale;
  const tip = 10 * scale;
  const locked = kind === 'locked';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          width: head,
          left: left - head / 2,
          top: top - (head + tip),
          zIndex: kind === 'current' ? 5 : locked ? 2 : 3,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={locked ? `${accessibilityLabel}, locked` : accessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={480}
        hitSlop={12}
        style={styles.hit}
      >
        <View
          key={kind}
          style={[
            styles.head,
            {
              width: head,
              height: head,
              borderRadius: head / 2,
            },
            kind === 'current' && styles.current,
            locked && styles.locked,
          ]}
        >
          {kind === 'current' ? (
            <Image source={FACE} style={styles.face} />
          ) : locked ? (
            <Glyph name="lock" size={18 * scale} color={tokens.ink3} />
          ) : (
            <Sticker name={sticker} size={30 * scale} />
          )}
        </View>
        <View
          style={[
            styles.tip,
            {
              borderLeftWidth: 7 * scale,
              borderRightWidth: 7 * scale,
              borderTopWidth: tip,
            },
            kind === 'current' && styles.tipCurrent,
            locked && styles.tipLocked,
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  hit: {
    alignItems: 'center',
  },
  head: {
    backgroundColor: tokens.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    boxShadow: [shadow.lipSurface, shadow.dropOnArt],
  },
  current: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: tokens.gold,
    boxShadow: [
      shadow.lipGold,
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: 'rgba(253,180,60,0.35)', spreadDistance: 7 },
      shadow.dropOnArt,
    ],
  },
  locked: {
    backgroundColor: tokens.surface3,
    boxShadow: [shadow.dropOnArt],
  },
  face: {
    width: '100%',
    height: '100%',
  },
  tip: {
    width: 0,
    height: 0,
    marginTop: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: tokens.surface,
  },
  tipCurrent: {
    borderTopColor: tokens.gold,
  },
  tipLocked: {
    borderTopColor: tokens.surface3,
  },
});
